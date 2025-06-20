"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBetEntry = createBetEntry;
exports.createBet = createBet;
const anchor = __importStar(require("@coral-xyz/anchor"));
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../../utils");
const states_1 = require("../../states");
const constants_1 = require("../../constants");
async function createBetEntry(program, params) {
    const { user, amount, lowerBoundPrice, upperBoundPrice, startTime, endTime, competitionKey } = params;
    let leverageMultiplier = params.leverageMultiplier;
    if (!leverageMultiplier) {
        leverageMultiplier = 1;
    }
    if (!startTime || !endTime) {
        throw new Error('startTime and endTime are required');
    }
    if (!params.poolKey) {
        params.poolKey = await (0, states_1.findPoolKeyFromStartEndTime)(program, competitionKey, startTime, endTime);
    }
    return createBet(program, user, amount, lowerBoundPrice, upperBoundPrice, leverageMultiplier, params.poolKey, competitionKey);
}
async function createBet(program, user, amount, lowerBoundPrice, upperBoundPrice, leverageMultiplier, poolKey, competitionKey) {
    const betHash = web3_js_1.Keypair.generate().publicKey;
    const [betPDA] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from("bet"),
        user.toBuffer(),
        poolKey.toBuffer(),
        betHash.toBuffer(),
    ], program.programId);
    const [poolVaultPDA] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(constants_1.POOL_VAULT_SEED),
        poolKey.toBuffer(),
    ], program.programId);
    // console log all accounts
    // console.log("betPDA", betPDA.toBase58());
    // console.log("user", user.toBase58());
    // console.log("poolKey", poolKey.toBase58());
    // console.log("betHash", betHash.toBase58());
    const tx = await program.methods
        .runCreateBet(new anchor.BN(amount), new anchor.BN(lowerBoundPrice), new anchor.BN(upperBoundPrice), poolKey, competitionKey, new anchor.BN(leverageMultiplier))
        .accountsStrict({
        user,
        bet: betPDA,
        pool: poolKey,
        betHashAcc: betHash,
        poolVault: poolVaultPDA,
        systemProgram: anchor_1.web3.SystemProgram.programId,
    }).instruction();
    const vtx = await (0, utils_1.getVersionTxFromInstructions)(program.provider.connection, [tx]);
    return vtx;
}
