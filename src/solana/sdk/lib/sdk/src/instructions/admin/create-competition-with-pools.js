"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompetitionWithPoolsEntry = createCompetitionWithPoolsEntry;
exports.createCompetitionWithPools = createCompetitionWithPools;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const create_competition_1 = require("./create-competition");
const create_pool_1 = require("./create-pool");
async function createCompetitionWithPoolsEntry(program, params) {
    const competitionHash = web3_js_1.Keypair.generate().publicKey;
    const { competitionTx, // Return first transaction with competition creation
    poolKeys, poolTxs } = await createCompetitionWithPools(program, params.admin, competitionHash, params.tokenA, params.priceFeedId, params.adminKeys, params.houseCutFactor, params.minPayoutRatio, params.interval, params.startTime, params.endTime, params.treasury);
    return {
        competitionTx, // Return first transaction with competition creation
        poolKeys,
        poolTxs
    };
}
async function createCompetitionWithPools(program, admin, competitionHash, tokenA, priceFeedId, adminKeys, houseCutFactor, minPayoutRatio, interval, startTime, endTime, treasury) {
    const [competitionPda] = await anchor_1.web3.PublicKey.findProgramAddressSync([Buffer.from(constants_1.COMPETITION_SEED), competitionHash.toBuffer()], program.programId);
    const competitionTx = await (0, utils_1.getVersionTxFromInstructions)(program.provider.connection, [await (0, create_competition_1.createCompetition)(program, admin, competitionHash, competitionPda, tokenA, priceFeedId, adminKeys, houseCutFactor, minPayoutRatio, interval, startTime, endTime)], admin);
    const poolCount = Math.floor((endTime - startTime) / interval); // Correct calculation
    const poolInterval = interval;
    const poolConfigs = Array.from({ length: poolCount }, (_, i) => ({
        poolHash: anchor_1.web3.Keypair.generate().publicKey,
        startTime: startTime + (i * poolInterval),
        endTime: startTime + ((i + 1) * poolInterval)
    }));
    // Create pool transactions
    const poolTxResponses = await Promise.all(poolConfigs.map(async (config) => {
        const { ix, poolKey } = await (0, create_pool_1.createPool)(program, admin, competitionPda, // Use actual competition PDA
        config.startTime, config.endTime, treasury, config.poolHash);
        return {
            tx: await (0, utils_1.getVersionTxFromInstructions)(program.provider.connection, [ix], admin),
            poolKey
        };
    }));
    const poolKeys = poolTxResponses.map(c => c.poolKey);
    const poolTxs = poolTxResponses.map(c => c.tx);
    return {
        competitionTx, // Return first transaction with competition creation
        poolKeys,
        poolTxs
    };
}
