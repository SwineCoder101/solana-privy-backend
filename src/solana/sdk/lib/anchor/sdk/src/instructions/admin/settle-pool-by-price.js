"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settlePoolByPrice = settlePoolByPrice;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../../utils");
const states_1 = require("../../states");
const treasury_account_1 = require("../../states/treasury-account");
async function settlePoolByPrice(program, admin, poolKey, lowerBoundPrice, upperBoundPrice) {
    // Fetch the pool state.
    const poolAccount = await program.account.pool.fetch(poolKey);
    // Get the treasury PDA and treasury vault PDA.
    const [poolTreasury] = await treasury_account_1.TreasuryAccount.getTreasuryPda(program);
    const [treasuryVault] = await treasury_account_1.TreasuryAccount.getTreasuryVaultPda(program);
    // Get the active bets.
    const betAccounts = (await (0, states_1.getBetAccountsForPool)(program, poolKey))
        .filter((betAccount) => betAccount.status === states_1.BetStatus.Active);
    const userAccounts = betAccounts.map((betAccount) => betAccount.user);
    if (betAccounts.length !== userAccounts.length) {
        throw new Error("Number of bet accounts must match the number of user accounts");
    }
    if (betAccounts.length === 0) {
        throw new Error("No active bets found");
    }
    console.log('betAccounts : ', betAccounts);
    console.log('userAccounts : ', userAccounts);
    const remainingAccounts = [].concat(...betAccounts.map((betAccount) => [
        { pubkey: new web3_js_1.PublicKey(betAccount.publicKey), isWritable: true, isSigner: false },
        { pubkey: new web3_js_1.PublicKey(betAccount.user), isWritable: true, isSigner: false },
    ]));
    const ix = await program.methods.runSettlePoolByPrice(new anchor_1.BN(lowerBoundPrice), new anchor_1.BN(upperBoundPrice))
        .accountsStrict({
        authority: admin,
        pool: poolKey,
        treasury: poolTreasury,
        competition: poolAccount.competition,
        treasuryVault: treasuryVault,
        poolVault: poolAccount.vaultKey,
        systemProgram: anchor_1.web3.SystemProgram.programId,
    })
        .remainingAccounts(remainingAccounts)
        .instruction();
    const vtx = await (0, utils_1.getVersionTxFromInstructions)(program.provider.connection, [ix]);
    return vtx;
}
