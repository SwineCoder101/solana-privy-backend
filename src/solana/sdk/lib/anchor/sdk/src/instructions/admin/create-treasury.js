"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTreasury = createTreasury;
const anchor_1 = require("@coral-xyz/anchor");
const treasury_account_1 = require("../../states/treasury-account");
async function createTreasury(program, params) {
    const { maxAdmins, minSignatures, initialAdmins, payer = program.provider.publicKey } = params;
    const [treasuryKey] = await treasury_account_1.TreasuryAccount.getPda(program);
    return await program.methods
        .runCreateTreasury(maxAdmins, minSignatures, initialAdmins)
        .accountsStrict({
        treasury: treasuryKey,
        payer,
        systemProgram: anchor_1.web3.SystemProgram.programId,
    })
        .instruction();
}
