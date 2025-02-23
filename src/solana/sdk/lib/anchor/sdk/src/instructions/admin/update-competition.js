"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompetitionInstruction = updateCompetitionInstruction;
const anchor_1 = require("@coral-xyz/anchor");
async function updateCompetitionInstruction(program, competitionPubkey, tokenA, priceFeedId, adminPubkeys, houseCutFactor, minPayoutRatio, interval, startTime, endTime, authority) {
    return program.methods
        .runUpdateCompetition(tokenA, priceFeedId, adminPubkeys, new anchor_1.BN(houseCutFactor), new anchor_1.BN(minPayoutRatio), new anchor_1.BN(interval), new anchor_1.BN(startTime), new anchor_1.BN(endTime))
        .accounts({
        competition: competitionPubkey,
        authority,
    }).instruction();
}
