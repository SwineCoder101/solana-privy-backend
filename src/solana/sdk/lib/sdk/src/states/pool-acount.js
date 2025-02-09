"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPoolAddress = void 0;
exports.convertPoolToProgramData = convertPoolToProgramData;
exports.convertProgramToPoolData = convertProgramToPoolData;
exports.getPoolData = getPoolData;
exports.getBalanceOfPool = getBalanceOfPool;
exports.getPoolAccount = getPoolAccount;
exports.getPoolAccounts = getPoolAccounts;
exports.getPoolBalance = getPoolBalance;
exports.getAllPools = getAllPools;
exports.getFirstPool = getFirstPool;
exports.getPoolAccountsFromCompetition = getPoolAccountsFromCompetition;
exports.getAllPoolDataByCompetition = getAllPoolDataByCompetition;
exports.getAllPoolDataByUser = getAllPoolDataByUser;
exports.findPoolKeyFromStartEndTime = findPoolKeyFromStartEndTime;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
function convertPoolToProgramData(poolData) {
    return {
        poolKey: new web3_js_1.PublicKey(poolData.poolKey),
        competitionKey: new web3_js_1.PublicKey(poolData.competitionKey),
        startTime: new anchor_1.BN(poolData.startTime),
        endTime: new anchor_1.BN(poolData.endTime),
        treasury: new web3_js_1.PublicKey(poolData.treasury),
        poolHash: new web3_js_1.PublicKey(poolData.poolHash),
    };
}
function convertProgramToPoolData(programData) {
    return {
        poolKey: programData.publicKey.toBase58(),
        poolHash: programData.account.poolHash.toString(),
        competitionKey: programData.account.competitionKey.toString(),
        startTime: typeof programData.account.startTime === 'number' ? programData.account.startTime : programData.account.startTime.toNumber(),
        endTime: typeof programData.account.endTime === 'number' ? programData.account.endTime : programData.account.endTime.toNumber(),
        treasury: programData.account.treasury.toString(),
    };
}
//------------------------------------------------------- Data Finders
const findPoolAddress = (programId, competitionKey, poolHash) => {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(constants_1.POOL_SEED), Buffer.from(competitionKey), Buffer.from(poolHash)], new web3_js_1.PublicKey(programId))[0];
};
exports.findPoolAddress = findPoolAddress;
// ------------------------------------------------------- Data Fetchers
async function getPoolData(program, poolPubkey) {
    const pool = await getPoolAccount(program, poolPubkey);
    return convertProgramToPoolData({ publicKey: poolPubkey, account: pool });
}
async function getBalanceOfPool(program, poolPubkey) {
    const balance = await program.provider.connection.getBalance(poolPubkey);
    return balance;
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
async function getAllPools(program) {
    const pools = await program.account.pool.all();
    return pools.map((pool) => convertProgramToPoolData(pool));
}
async function getFirstPool(program) {
    const pools = await getAllPools(program);
    return pools.sort((a, b) => a.startTime - b.startTime)[0];
}
async function getPoolAccountsFromCompetition(program, competitionKey) {
    const pools = await program.account.pool.all();
    return pools.filter(pool => pool.account.competitionKey.toBase58() === competitionKey.toBase58());
}
async function getAllPoolDataByCompetition(program, competition) {
    const pools = await program.account.pool.all();
    return pools.filter((pool) => pool.account.competitionKey.toBase58() === competition.toBase58()).map((pool) => convertProgramToPoolData(pool));
}
async function getAllPoolDataByUser(program, user) {
    const pools = await program.account.pool.all();
    return pools.filter((pool) => pool.account.treasury.toBase58() === user.toBase58()).map((pool) => convertProgramToPoolData(pool));
}
async function findPoolKeyFromStartEndTime(program, competitionKey, startTime, endTime) {
    const pools = await getAllPoolDataByCompetition(program, competitionKey);
    const poolKeyStr = pools.find(pool => pool.startTime === startTime && pool.endTime === endTime)?.poolKey;
    if (!poolKeyStr) {
        throw new Error("Pool not found");
    }
    return new web3_js_1.PublicKey(poolKeyStr);
}
