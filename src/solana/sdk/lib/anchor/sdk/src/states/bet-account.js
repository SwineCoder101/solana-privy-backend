"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetStatus = void 0;
exports.convertBetToProgramData = convertBetToProgramData;
exports.convertToBetStatus = convertToBetStatus;
exports.convertToBetProgramStatus = convertToBetProgramStatus;
exports.convertProgramToBetData = convertProgramToBetData;
exports.getBetData = getBetData;
exports.getBetsForUserAndPool = getBetsForUserAndPool;
exports.getOwnerOfAccount = getOwnerOfAccount;
exports.getBetAccount = getBetAccount;
exports.getBetAccountsForUser = getBetAccountsForUser;
exports.getAllBetAccounts = getAllBetAccounts;
exports.getActiveBetAccountsForPool = getActiveBetAccountsForPool;
exports.getActiveBetAccountsForUser = getActiveBetAccountsForUser;
exports.getCancelledBetAccountsForUser = getCancelledBetAccountsForUser;
exports.getSettledBetAccountsForUser = getSettledBetAccountsForUser;
exports.getBetAccountsForPool = getBetAccountsForPool;
exports.getAllBetDataByUser = getAllBetDataByUser;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
var BetStatus;
(function (BetStatus) {
    BetStatus[BetStatus["Active"] = 0] = "Active";
    BetStatus[BetStatus["Cancelled"] = 1] = "Cancelled";
    BetStatus[BetStatus["Settled"] = 2] = "Settled";
})(BetStatus || (exports.BetStatus = BetStatus = {}));
const ACCOUNT_DISCRIMINATOR_SIZE = 8;
const PUBLIC_KEY_SIZE = 32;
const U64_SIZE = 8;
function getPoolKeyOffset() {
    return ACCOUNT_DISCRIMINATOR_SIZE + // Account discriminator
        PUBLIC_KEY_SIZE + // user
        U64_SIZE + // amount
        PUBLIC_KEY_SIZE + // competition
        U64_SIZE + // lower_bound_price
        U64_SIZE; // upper_bound_price
}
function convertBetToProgramData(betData) {
    return {
        user: new web3_js_1.PublicKey(betData.user),
        amount: new anchor_1.BN(betData.amount),
        competition: new web3_js_1.PublicKey(betData.competition),
        lowerBoundPrice: new anchor_1.BN(betData.lowerBoundPrice),
        upperBoundPrice: new anchor_1.BN(betData.upperBoundPrice),
        poolKey: new web3_js_1.PublicKey(betData.poolKey),
        status: convertToBetProgramStatus(betData.status),
        poolVaultKey: new web3_js_1.PublicKey(betData.poolVaultKey),
        leverageMultiplier: new anchor_1.BN(betData.leverageMultiplier),
        createdAt: new anchor_1.BN(betData.createdAt.getTime() / 1000),
        updatedAt: new anchor_1.BN(betData.updatedAt.getTime() / 1000),
    };
}
function convertToBetStatus(status) {
    if ('active' in status) {
        return BetStatus.Active;
    }
    else if ('cancelled' in status) {
        return BetStatus.Cancelled;
    }
    else if ('settled' in status) {
        return BetStatus.Settled;
    }
    else {
        throw new Error("Unknown BetStatus");
    }
}
function convertToBetProgramStatus(status) {
    switch (status) {
        case BetStatus.Active:
            return { active: {} };
        case BetStatus.Cancelled:
            return { cancelled: {} };
        case BetStatus.Settled:
            return { settled: {} };
        default:
            throw new Error("Unknown BetStatus");
    }
}
async function convertProgramToBetData(account, accountPublicKey) {
    return {
        publicKey: accountPublicKey.toBase58(),
        user: account.account.user.toString(),
        amount: account.account.amount.toNumber(),
        lowerBoundPrice: account.account.lowerBoundPrice.toNumber(),
        upperBoundPrice: account.account.upperBoundPrice.toNumber(),
        poolKey: account.account.poolKey.toBase58(),
        competition: account.account.competition.toBase58(),
        status: convertToBetStatus(account.account.status),
        leverageMultiplier: account.account.leverageMultiplier.toNumber(),
        createdAt: new Date(account.account.createdAt.toNumber() * 1000),
        updatedAt: new Date(account.account.updatedAt.toNumber() * 1000),
        poolVaultKey: account.account.poolVaultKey.toBase58(),
    };
}
// ------------------------------------------------------- Data Fetchers
async function getBetData(program, betPubkey) {
    const betAccount = await program.account.bet.fetch(betPubkey);
    return {
        publicKey: betPubkey.toString(),
        user: betAccount.user.toString(),
        amount: betAccount.amount.toNumber(),
        competition: betAccount.competition.toString(),
        lowerBoundPrice: betAccount.lowerBoundPrice.toNumber(),
        upperBoundPrice: betAccount.upperBoundPrice.toNumber(),
        poolKey: betAccount.poolKey.toString(),
        status: convertToBetStatus(betAccount.status),
        leverageMultiplier: betAccount.leverageMultiplier.toNumber(),
        createdAt: new Date(betAccount.createdAt.toNumber() * 1000),
        updatedAt: new Date(betAccount.updatedAt.toNumber() * 1000),
        poolVaultKey: betAccount.poolVaultKey.toString(),
    };
}
async function getBetsForUserAndPool(program, userPubkey, poolPubkey) {
    const bets = await program.account.bet.all();
    return await Promise.all(bets.filter((bet) => bet.account.user.toBase58() === userPubkey.toBase58() && bet.account.poolKey.toBase58() === poolPubkey.toBase58()).map(async (bet) => convertProgramToBetData(bet, bet.publicKey)));
}
//get owner of account
async function getOwnerOfAccount(program, accountPubkey) {
    const account = await program.account.bet.fetch(accountPubkey);
    return account.user;
}
async function getBetAccount(program, betPubkey) {
    return program.account.bet.fetch(betPubkey);
}
async function getBetAccountsForUser(program, userPubkey) {
    const accounts = await program.account.bet.all([
        {
            memcmp: {
                offset: 8,
                bytes: userPubkey.toBase58(),
            },
        },
    ]);
    return accounts.map((account) => ({
        publicKey: account.publicKey.toString(),
        user: account.account.user.toString(),
        amount: account.account.amount.toNumber(),
        lowerBoundPrice: account.account.lowerBoundPrice.toNumber(),
        upperBoundPrice: account.account.upperBoundPrice.toNumber(),
        poolKey: account.account.poolKey.toString(),
        competition: account.account.competition.toString(),
        status: convertToBetStatus(account.account.status),
        poolVaultKey: account.account.poolVaultKey.toString(),
        leverageMultiplier: account.account.leverageMultiplier.toNumber(),
        createdAt: new Date(account.account.createdAt.toNumber() * 1000),
        updatedAt: new Date(account.account.updatedAt.toNumber() * 1000),
    }));
}
async function getAllBetAccounts(program) {
    const accounts = await program.account.bet.all();
    return await Promise.all(accounts.map(async (account) => convertProgramToBetData(account, account.publicKey)));
}
async function getActiveBetAccountsForPool(program, poolPubkey) {
    const accounts = await getBetAccountsForPool(program, poolPubkey);
    return accounts.filter(account => account.status === BetStatus.Active);
}
async function getActiveBetAccountsForUser(program, userPubkey) {
    const accounts = await getBetAccountsForUser(program, userPubkey);
    return accounts.filter(account => account.status === BetStatus.Active);
}
async function getCancelledBetAccountsForUser(program, userPubkey) {
    const accounts = await getBetAccountsForUser(program, userPubkey);
    return accounts.filter(account => account.status === BetStatus.Cancelled);
}
async function getSettledBetAccountsForUser(program, userPubkey) {
    const accounts = await getBetAccountsForUser(program, userPubkey);
    return accounts.filter(account => account.status === BetStatus.Settled);
}
async function getBetAccountsForPool(program, poolPubkey) {
    const accounts = await program.account.bet.all([
        {
            memcmp: {
                offset: getPoolKeyOffset(),
                bytes: poolPubkey.toBase58(),
            },
        },
    ]);
    return accounts.map((account) => ({
        publicKey: account.publicKey.toString(),
        user: account.account.user.toString(),
        amount: account.account.amount.toNumber(),
        lowerBoundPrice: account.account.lowerBoundPrice.toNumber(),
        upperBoundPrice: account.account.upperBoundPrice.toNumber(),
        poolKey: account.account.poolKey.toString(),
        competition: account.account.competition.toString(),
        status: convertToBetStatus(account.account.status),
        poolVaultKey: account.account.poolVaultKey.toString(),
        leverageMultiplier: account.account.leverageMultiplier.toNumber(),
        createdAt: new Date(account.account.createdAt.toNumber() * 1000),
        updatedAt: new Date(account.account.updatedAt.toNumber() * 1000),
    }));
}
async function getAllBetDataByUser(program, user) {
    const bets = await program.account.bet.all();
    return await Promise.all(bets.filter((bet) => bet.account.user.toBase58() === user.toBase58()).map(async (bet) => convertProgramToBetData(bet, bet.publicKey)));
}
