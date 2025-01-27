"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPoolAddress = void 0;
exports.convertPoolToProgramData = convertPoolToProgramData;
exports.convertProgramToPoolData = convertProgramToPoolData;
exports.getPoolData = getPoolData;
exports.getPoolAccount = getPoolAccount;
exports.getPoolAccounts = getPoolAccounts;
exports.getPoolBalance = getPoolBalance;
exports.getPoolAccountsFromCompetition = getPoolAccountsFromCompetition;
exports.getAllPoolDataByCompetition = getAllPoolDataByCompetition;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
function convertPoolToProgramData(poolData) {
    return {
        competitionKey: new web3_js_1.PublicKey(poolData.competitionKey),
        startTime: new anchor_1.BN(poolData.startTime),
        endTime: new anchor_1.BN(poolData.endTime),
        treasury: new web3_js_1.PublicKey(poolData.treasury),
        poolHash: new web3_js_1.PublicKey(poolData.poolHash),
    };
}
function convertProgramToPoolData(programData) {
    return {
        poolHash: programData.poolHash.toString(),
        competitionKey: programData.competitionKey.toString(),
        startTime: typeof programData.startTime === 'number' ? programData.startTime : programData.startTime.toNumber(),
        endTime: typeof programData.endTime === 'number' ? programData.endTime : programData.endTime.toNumber(),
        treasury: programData.treasury.toString(),
    };
}
//------------------------------------------------------- Data Finders
const findPoolAddress = (programId, id) => {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(constants_1.POOL_SEED), new anchor_1.BN(id).toArrayLike(Buffer, 'le', 8)], new web3_js_1.PublicKey(programId))[0];
};
exports.findPoolAddress = findPoolAddress;
// ------------------------------------------------------- Data Fetchers
async function getPoolData(program, poolPubkey) {
    const pool = await getPoolAccount(program, poolPubkey);
    return convertProgramToPoolData(pool);
}
async function getPoolAccount(program, poolPubkey) {
    return program.account.pool.fetch(poolPubkey);
}
async function getPoolAccounts(program, poolPubkeys) {
    return program.account.pool.fetchMultiple(poolPubkeys);
}
async function getPoolBalance(poolPubkey, program) {
    return program.provider.connection.getBalance(poolPubkey);
}
async function getPoolAccountsFromCompetition(program, competitionKey) {
    const pools = await program.account.pool.all();
    return pools.filter(pool => pool.account.competitionKey === competitionKey);
}
async function getAllPoolDataByCompetition(program, competition) {
    const pools = await program.account.pool.all();
    return pools.filter((pool) => pool.account.competitionKey.toBase58() === competition.toBase58()).map((pool) => convertProgramToPoolData(pool.account));
}
