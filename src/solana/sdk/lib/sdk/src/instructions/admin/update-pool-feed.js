"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeed = updateFeed;
const web3_js_1 = require("@solana/web3.js");
async function updateFeed(program, authority, poolKey, priceFeedId, priceFeedAccount) {
    // Get pool oracle PDA
    const [poolOraclePDA] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from("pool_oracle"),
        poolKey.toBuffer(),
        Buffer.from(priceFeedId)
    ], program.programId);
    const tx = await program.methods
        .runUpdatePoolPriceFeed()
        .accountsStrict({
        authority: authority.publicKey,
        poolOracle: poolOraclePDA,
        priceUpdate: priceFeedAccount,
    })
        .signers([authority])
        .rpc();
    return tx;
}
