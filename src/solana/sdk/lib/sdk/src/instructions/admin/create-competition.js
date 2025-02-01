"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompetitiionEntry = createCompetitiionEntry;
exports.createCompetition = createCompetition;
const anchor_1 = require("@coral-xyz/anchor");
async function createCompetitiionEntry(program, param) {
    return await createCompetition(program, param.authority, param.competitionHash, param.competitionPubkey, param.tokenA, param.priceFeedId, param.adminPubkeys, param.houseCutFactor, param.minPayoutRatio, param.interval, param.startTime, param.endTime);
}
async function createCompetition(program, authority, competitionHash, competitionPubkey, tokenA, priceFeedId, adminPubkeys, houseCutFactor, minPayoutRatio, interval, startTime, endTime) {
    return program.methods
        .runCreateCompetition(tokenA, priceFeedId, adminPubkeys, new anchor_1.BN(houseCutFactor), new anchor_1.BN(minPayoutRatio), new anchor_1.BN(interval), new anchor_1.BN(startTime), new anchor_1.BN(endTime))
        .accountsStrict({
        competition: competitionPubkey,
        compHashAcc: competitionHash,
        authority,
        systemProgram: anchor_1.web3.SystemProgram.programId,
    }).instruction();
}
