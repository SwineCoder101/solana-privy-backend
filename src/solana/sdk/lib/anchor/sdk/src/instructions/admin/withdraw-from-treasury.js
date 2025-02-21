"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawFromTreasury = withdrawFromTreasury;
const anchor_1 = require("@coral-xyz/anchor");
const treasury_account_1 = require("../../states/treasury-account");
async function withdrawFromTreasury(program, params) {
    const { amount, recipient, pool, authority = program.provider.publicKey } = params;
    const [treasuryKey] = await treasury_account_1.TreasuryAccount.getTreasuryPda(program);
    const [treasuryVaultKey] = await treasury_account_1.TreasuryAccount.getTreasuryVaultPda(program);
    return program.methods
        .runWithdrawFromTreasury(amount)
        .accountsStrict({
        treasury: treasuryKey,
        treasuryVault: treasuryVaultKey,
        recipient,
        pool,
        authority,
        systemProgram: anchor_1.web3.SystemProgram.programId,
    })
        .instruction();
}
