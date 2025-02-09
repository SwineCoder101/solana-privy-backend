"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetStatus = void 0;
exports.convertBetToProgramData = convertBetToProgramData;
exports.convertToBetStatus = convertToBetStatus;
exports.convertToBetProgramStatus = convertToBetProgramStatus;
exports.convertProgramToBetData = convertProgramToBetData;
exports.getBetData = getBetData;
exports.getBetAccount = getBetAccount;
exports.getBetAccountsForUser = getBetAccountsForUser;
exports.getAllBetAccounts = getAllBetAccounts;
exports.getActiveBetAccountsForPool = getActiveBetAccountsForPool;
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
function convertBetToProgramData(betData) {
    return {
        user: new web3_js_1.PublicKey(betData.user),
        amount: new anchor_1.BN(betData.amount),
        competition: new web3_js_1.PublicKey(betData.competition),
        lowerBoundPrice: new anchor_1.BN(betData.lowerBoundPrice),
        upperBoundPrice: new anchor_1.BN(betData.upperBoundPrice),
        poolKey: new web3_js_1.PublicKey(betData.poolKey),
        status: convertToBetProgramStatus(betData.status),
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
function convertProgramToBetData(programData) {
    return {
        publicKey: programData.user.toString(),
        user: programData.user.toString(),
        amount: typeof programData.amount === 'number' ? programData.amount : programData.amount.toNumber(),
        lowerBoundPrice: typeof programData.lowerBoundPrice === 'number' ? programData.lowerBoundPrice : programData.lowerBoundPrice.toNumber(),
        upperBoundPrice: typeof programData.upperBoundPrice === 'number' ? programData.upperBoundPrice : programData.upperBoundPrice.toNumber(),
        poolKey: programData.poolKey.toString(),
        competition: programData.competition.toString(),
        status: convertToBetStatus(programData.status),
    };
}
// ------------------------------------------------------- Data Fetchers
async function getBetData(program, betPubkey) {
    const fetchedData = await program.account.bet.fetch(betPubkey);
    return convertProgramToBetData(fetchedData);
}
async function getBetAccount(program, betPubkey) {
    return program.account.bet.fetch(betPubkey);
}
async function getBetAccountsForUser(program, userPubkey) {
    // Get all bet accounts
    const accounts = await program.account.bet.all();
    // Filter accounts where user matches
    const betAccounts = accounts.filter((account) => {
        const accountUser = account.account.user.toBase58();
        const matches = accountUser === userPubkey.toBase58();
        return matches;
    });
    return betAccounts.map(account => ({
        ...convertProgramToBetData(account.account),
        publicKey: account.publicKey.toBase58()
    }));
}
async function getAllBetAccounts(program) {
    const accounts = await program.account.bet.all();
    return accounts.map(account => convertProgramToBetData(account.account));
}
async function getActiveBetAccountsForPool(program, poolPubkey) {
    const accounts = await getBetAccountsForPool(program, poolPubkey);
    return accounts.filter(account => account.status === BetStatus.Active);
}
async function getBetAccountsForPool(program, poolPubkey) {
    // Get all bet accounts
    const accounts = await program.account.bet.all();
    // Filter accounts where poolKey matches
    const betAccounts = accounts.filter((account) => {
        const accountPoolKey = account.account.poolKey.toBase58();
        const matches = accountPoolKey === poolPubkey.toBase58();
        return matches;
    });
    betAccounts.forEach(acc => {
        console.log('Account:', {
            pubkey: acc.publicKey.toBase58(),
            poolKey: acc.account.poolKey.toBase58(),
            user: acc.account.user.toBase58()
        });
    });
    return betAccounts.map(account => ({
        ...convertProgramToBetData(account.account),
        publicKey: account.publicKey.toBase58()
    }));
}
async function getAllBetDataByUser(program, user) {
    const bets = await program.account.bet.all();
    return bets.filter((bet) => bet.account.user.toBase58() === user.toBase58()).map((bet) => convertProgramToBetData(bet.account));
}
