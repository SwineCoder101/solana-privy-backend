"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersionTxFromInstructions = getVersionTxFromInstructions;
const anchor_1 = require("@coral-xyz/anchor");
async function getVersionTxFromInstructions(connection, instructions, payer) {
    const blockhash = await connection.getLatestBlockhash();
    const messageV0 = new anchor_1.web3.TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash.blockhash,
        instructions,
    }).compileToV0Message();
    return new anchor_1.web3.VersionedTransaction(messageV0);
}
