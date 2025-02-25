"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAllBetsForUserOnPoolEntry = cancelAllBetsForUserOnPoolEntry;
exports.cancelBetByKey = cancelBetByKey;
exports.cancelBet = cancelBet;
const web3_js_1 = require("@solana/web3.js");
const __1 = require("../..");
const utils_1 = require("../../utils");
const treasury_account_1 = require("../../states/treasury-account");
async function cancelAllBetsForUserOnPoolEntry(program, params) {
    const { user, poolKey } = params;
    const bets = await (0, __1.getBetsForUserAndPool)(program, user, poolKey);
    if (!bets) {
        throw new Error('No bet found');
    }
    const txs = await Promise.all(bets.map(async (bet) => {
        return await cancelBetByKey(program, new web3_js_1.PublicKey(bet.publicKey), user, poolKey);
    }));
    return {
        txs,
        bets,
    };
}
async function cancelBetByKey(program, betKey, user, poolKey) {
    const poolAccount = await program.account.pool.fetch(poolKey);
    const treasuryAccount = await treasury_account_1.TreasuryAccount.getInstance(program);
    const tx = await program.methods
        .runCancelBet()
        .accountsStrict({
        authority: user,
        bet: betKey,
        user,
        pool: poolKey,
        systemProgram: web3_js_1.SystemProgram.programId,
        poolVault: poolAccount.vaultKey,
        treasury: treasuryAccount.treasuryKey,
        treasuryVault: treasuryAccount.vaultKey,
    }).instruction();
    const vtx = await (0, utils_1.getVersionTxFromInstructions)(program.provider.connection, [tx]);
    return vtx;
}
async function cancelBet(program, user, poolKey, betHash) {
    const [betPDA] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from("bet"),
        user.toBuffer(),
        poolKey.toBuffer(),
        betHash.toBuffer(),
    ], program.programId);
    const poolAccount = await program.account.pool.fetch(poolKey);
    const treasuryAccount = await treasury_account_1.TreasuryAccount.getInstance(program);
    if (!treasuryAccount) {
        throw new Error('Treasury not found , please make sure to create a treasury first');
    }
    if (!treasuryAccount.treasuryKey) {
        throw new Error(`Treasury not found , please check the treasury account ${treasuryAccount}`);
    }
    if (!treasuryAccount.vaultKey) {
        throw new Error(`Treasury vault not found , please check the treasury account ${treasuryAccount}`);
    }
    const tx = await program.methods
        .runCancelBet()
        .accountsStrict({
        authority: user,
        bet: betPDA,
        user,
        pool: poolKey,
        systemProgram: web3_js_1.SystemProgram.programId,
        poolVault: poolAccount.vaultKey,
        treasury: treasuryAccount.treasuryKey,
        treasuryVault: treasuryAccount.vaultKey,
    }).instruction();
    const vtx = await (0, utils_1.getVersionTxFromInstructions)(program.provider.connection, [tx]);
    return vtx;
}
