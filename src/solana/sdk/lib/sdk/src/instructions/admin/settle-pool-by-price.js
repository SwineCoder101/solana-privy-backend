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
exports.settlePoolByPrice = settlePoolByPrice;
const anchor = __importStar(require("@coral-xyz/anchor"));
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../../utils");
const states_1 = require("../../states");
async function settlePoolByPrice(program, admin, poolKey, lowerBoundPrice, upperBoundPrice) {
    const poolAccount = await program.account.pool.fetch(poolKey);
    const treasuryKey = poolAccount.treasury;
    const betAccounts = (await (0, states_1.getBetAccountsForPool)(program, poolKey)).filter((betAccount) => betAccount.status === states_1.BetStatus.Active);
    const userAccounts = betAccounts.map((betAccount) => betAccount.user);
    if (betAccounts.length !== userAccounts.length) {
        throw new Error("Number of bet accounts must match the number of user accounts");
    }
    const remainingAccounts = betAccounts.flatMap((betAccount, index) => [
        { pubkey: new web3_js_1.PublicKey(betAccount.publicKey), isWritable: true, isSigner: false },
        { pubkey: new web3_js_1.PublicKey(userAccounts[index]), isWritable: true, isSigner: false },
    ]);
    const ix = await program.methods.runSettlePoolByPrice(new anchor.BN(lowerBoundPrice), new anchor.BN(upperBoundPrice))
        .accountsStrict({
        authority: admin,
        pool: poolKey,
        competition: poolAccount.competitionKey,
        treasury: treasuryKey,
        systemProgram: anchor.web3.SystemProgram.programId,
    })
        .remainingAccounts(remainingAccounts)
        .instruction();
    const vtx = await (0, utils_1.getVersionTxFromInstructions)(program.provider.connection, [ix]);
    return vtx;
}
