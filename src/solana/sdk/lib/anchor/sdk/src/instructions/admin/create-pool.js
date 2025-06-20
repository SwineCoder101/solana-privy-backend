"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = createPool;
const anchor_1 = require("@coral-xyz/anchor");
const constants_1 = require("../../constants");
async function createPool(program, admin, competitionKey, startTime, endTime, poolHash) {
    const [poolPda] = anchor_1.web3.PublicKey.findProgramAddressSync([Buffer.from(constants_1.POOL_SEED), competitionKey.toBuffer(), poolHash.toBuffer()], program.programId);
    const [poolVaultPda] = anchor_1.web3.PublicKey.findProgramAddressSync([Buffer.from(constants_1.POOL_VAULT_SEED), poolPda.toBuffer()], program.programId);
    const ix = await program.methods
        .runCreatePool(new anchor_1.BN(startTime), new anchor_1.BN(endTime))
        .accountsStrict({
        authority: admin,
        pool: poolPda,
        competitionAcc: competitionKey,
        poolHashAcc: poolHash,
        poolVault: poolVaultPda,
        systemProgram: anchor_1.web3.SystemProgram.programId,
    })
        .instruction();
    return {
        poolKey: poolPda,
        ix
    };
}
