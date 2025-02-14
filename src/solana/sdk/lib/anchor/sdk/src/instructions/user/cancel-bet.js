"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBetEntry = cancelBetEntry;
exports.cancelBetByKey = cancelBetByKey;
exports.cancelBet = cancelBet;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../../utils");
const __1 = require("../..");
async function cancelBetEntry(program, params) {
    const { user, poolKey } = params;
    const bets = await (0, __1.getBetsForUserAndPool)(program, user, poolKey);
    const betKey = bets[0].publicKey;
    if (!betKey) {
        throw new Error('No bet found');
    }
    return await cancelBetByKey(program, new web3_js_1.PublicKey(betKey), user, poolKey);
}
async function cancelBetByKey(program, betKey, user, poolKey) {
    const tx = await program.methods
        .runCancelBet()
        .accountsStrict({
        bet: betKey,
        user,
        pool: poolKey,
        systemProgram: web3_js_1.SystemProgram.programId,
    }).instruction();
    const vtx = await (0, utils_1.getVersionTxFromInstructions)(program.provider.connection, [tx]);
    return vtx;
}
async function cancelBet(program, user, poolKey, betHash) {
    const [betPDA] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from("bet"),
        user.toBuffer(),
        poolKey.toBuffer(),
        betHash.toBuffer(),
    ], program.programId);
    const tx = await program.methods
        .runCancelBet()
        .accountsStrict({
        bet: betPDA,
        user,
        pool: poolKey,
        systemProgram: web3_js_1.SystemProgram.programId,
    }).instruction();
    const vtx = await (0, utils_1.getVersionTxFromInstructions)(program.provider.connection, [tx]);
    return vtx;
}
