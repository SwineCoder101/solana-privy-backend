"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTreasuryIfNotExists = createTreasuryIfNotExists;
exports.createTreasury = createTreasury;
const anchor_1 = require("@coral-xyz/anchor");
const treasury_account_1 = require("../../states/treasury-account");
async function createTreasuryIfNotExists(program, params) {
    const [treasuryKey] = await treasury_account_1.TreasuryAccount.getTreasuryPda(program);
    const treasuryAccount = await program.account.treasury.fetch(treasuryKey);
    if (treasuryAccount.totalDeposits > 0) {
        return null;
    }
    return await createTreasury(program, params);
}
async function createTreasury(program, params) {
    const { maxAdmins, minSignatures, initialAdmins, payer = program.provider.publicKey } = params;
    const [treasuryKey] = await treasury_account_1.TreasuryAccount.getTreasuryPda(program);
    const [treasuryVaultKey] = await treasury_account_1.TreasuryAccount.getTreasuryVaultPda(program);
    return await program.methods
        .runCreateTreasury(maxAdmins, minSignatures, initialAdmins)
        .accountsStrict({
        treasury: treasuryKey,
        payer,
        systemProgram: anchor_1.web3.SystemProgram.programId,
        treasuryVault: treasuryVaultKey,
    })
        .instruction();
}
