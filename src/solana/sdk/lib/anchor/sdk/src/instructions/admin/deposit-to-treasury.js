"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositToTreasury = depositToTreasury;
const anchor_1 = require("@coral-xyz/anchor");
const treasury_account_1 = require("../../states/treasury-account");
async function depositToTreasury(program, params) {
    const { amount, depositor = program.provider.publicKey } = params;
    const [treasuryKey] = await treasury_account_1.TreasuryAccount.getTreasuryPda(program);
    const treasury = await treasury_account_1.TreasuryAccount.getInstance(program);
    return program.methods
        .runDepositToTreasury(amount)
        .accountsStrict({
        treasury: treasuryKey,
        depositor,
        systemProgram: anchor_1.web3.SystemProgram.programId,
        treasuryVault: treasury.vaultKey,
    })
        .instruction();
}
