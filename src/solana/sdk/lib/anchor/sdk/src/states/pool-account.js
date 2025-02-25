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
exports.getPoolVaultKey = getPoolVaultKey;
exports.getFirstPool = getFirstPool;
exports.getPoolAccountsFromCompetition = getPoolAccountsFromCompetition;
exports.getAllPoolDataByCompetition = getAllPoolDataByCompetition;
exports.findPoolKeyFromStartEndTime = findPoolKeyFromStartEndTime;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
function convertPoolToProgramData(poolData) {
    return {
        poolKey: new web3_js_1.PublicKey(poolData.poolKey),
        competition: new web3_js_1.PublicKey(poolData.competitionKey),
        startTime: new anchor_1.BN(poolData.startTime),
        endTime: new anchor_1.BN(poolData.endTime),
        poolHash: new web3_js_1.PublicKey(poolData.poolHash),
        vaultKey: new web3_js_1.PublicKey(poolData.poolVaultKey),
        vaultBump: poolData.poolVaultBump,
        bump: poolData.bump,
    };
}
function convertProgramToPoolData(programData) {
    return {
        poolKey: programData.publicKey.toBase58(),
        poolHash: programData.account.poolHash.toString(),
        competitionKey: programData.account.competition.toString(),
        startTime: typeof programData.account.startTime === 'number'
            ? programData.account.startTime
            : programData.account.startTime.toNumber(),
        endTime: typeof programData.account.endTime === 'number'
            ? programData.account.endTime
            : programData.account.endTime.toNumber(),
        poolVaultKey: programData.account.vaultKey.toString(),
        poolVaultBump: programData.account.vaultBump,
        bump: programData.account.bump,
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
    return convertProgramToPoolData(pool);
}
async function getBalanceOfPool(program, poolPubkey) {
    const balance = await program.provider.connection.getBalance(poolPubkey);
    return balance;
}
async function getPoolAccount(program, poolPubkey) {
    const pool = await program.account.pool.fetch(poolPubkey);
    return { publicKey: poolPubkey, account: pool };
}
async function getPoolAccounts(program, poolPubkeys) {
    return program.account.pool.fetchMultiple(poolPubkeys);
}
async function getPoolBalance(poolPubkey, program) {
    return program.provider.connection.getBalance(poolPubkey);
}
async function getAllPools(program) {
    const pools = await program.account.pool.all();
    return pools.map((pool) => {
        const poolData = {
            ...pool.account,
            poolVaultKey: pool.account.vaultKey,
            poolVaultBump: pool.account.vaultBump,
        };
        return convertProgramToPoolData({ publicKey: pool.publicKey, account: poolData });
    });
}
async function getPoolVaultKey(program, poolPubkey) {
    const pool = await getPoolAccount(program, poolPubkey);
    return pool.account.vaultKey;
}
async function getFirstPool(program) {
    const pools = await getAllPools(program);
    return pools.sort((a, b) => a.startTime - b.startTime)[0];
}
async function getPoolAccountsFromCompetition(program, competitionKey) {
    const pools = await program.account.pool.all();
    return pools.filter(pool => pool.account.competition.toBase58() === competitionKey.toBase58());
}
async function getAllPoolDataByCompetition(program, competition) {
    const pools = await program.account.pool.all();
    return pools
        .filter((pool) => pool.account.competition.toBase58() === competition.toBase58())
        .map((pool) => convertProgramToPoolData({ publicKey: pool.publicKey, account: pool.account }));
}
async function findPoolKeyFromStartEndTime(program, competitionKey, startTime, endTime) {
    const pools = await getAllPoolDataByCompetition(program, competitionKey);
    const poolKeyStr = pools.find(pool => pool.startTime === startTime && pool.endTime === endTime)?.poolKey;
    if (!poolKeyStr) {
        throw new Error("Pool not found");
    }
    return new web3_js_1.PublicKey(poolKeyStr);
}
