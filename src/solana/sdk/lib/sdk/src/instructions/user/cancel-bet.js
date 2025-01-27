"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBet = cancelBet;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../../utils");
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
