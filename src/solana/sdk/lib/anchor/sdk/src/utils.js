"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToVersionedTransaction = convertToVersionedTransaction;
exports.convertTxsToVersionedTxs = convertTxsToVersionedTxs;
exports.combineTxs = combineTxs;
exports.combineAndConvertTxs = combineAndConvertTxs;
exports.getVersionTxFromInstructions = getVersionTxFromInstructions;
// Here we export some useful types and functions for interacting with the Anchor program.
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
// export const RACE_HORSE_PROGRAM_ID = new PublicKey(HorseRaceIDL.address)
async function convertToVersionedTransaction(connection, transaction) {
    const blockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash.blockhash;
    const versionedTransaction = new web3_js_1.VersionedTransaction(transaction.compileMessage());
    return versionedTransaction;
}
async function convertTxsToVersionedTxs(connection, txs) {
    return Promise.all(txs.map((tx) => convertToVersionedTransaction(connection, tx)));
}
async function combineTxs(txs) {
    return txs.reduce((acc, tx) => acc.add(tx), new web3_js_1.Transaction());
}
async function combineAndConvertTxs(connection, txs) {
    return convertToVersionedTransaction(connection, await combineTxs(txs));
}
async function getVersionTxFromInstructions(connection, instructions, feePayer, addressLookupTableAccounts // Optional ALT support
) {
    if (instructions.length === 0) {
        throw new Error('At least one instruction is required');
    }
    const payer = feePayer || instructions[0].keys.find(k => k.isSigner)?.pubkey;
    if (!payer) {
        throw new Error('Could not determine fee payer. Please specify explicitly.');
    }
    const { blockhash } = await connection.getLatestBlockhash();
    const message = new anchor_1.web3.TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message(addressLookupTableAccounts);
    const versionedTx = new web3_js_1.VersionedTransaction(message);
    return versionedTx;
}
