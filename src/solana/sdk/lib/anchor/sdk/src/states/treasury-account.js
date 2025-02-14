"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreasuryAccount = void 0;
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
class TreasuryAccount {
    constructor(adminAuthorities, minSignatures, totalDeposits, totalWithdrawals, bump) {
        this.adminAuthorities = adminAuthorities;
        this.minSignatures = minSignatures;
        this.totalDeposits = totalDeposits;
        this.totalWithdrawals = totalWithdrawals;
        this.bump = bump;
    }
    static async fetch(program, treasuryKey) {
        const account = await program.account.treasury.fetch(treasuryKey);
        return new TreasuryAccount(account.adminAuthorities, account.minSignatures, account.totalDeposits, account.totalWithdrawals, account.bump);
    }
    static async getPda(program) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(constants_1.TREASURY_SEED)], program.programId);
    }
    static async getBalance(program, treasuryKey) {
        const connection = program.provider.connection;
        const balance = await connection.getBalance(treasuryKey);
        return BigInt(balance);
    }
    static async isInitialized(program) {
        try {
            const [treasuryPda] = await TreasuryAccount.getPda(program);
            // Attempt to fetch the treasury account; if it does not exist, an error will be thrown.
            await program.account.treasury.fetch(treasuryPda);
            return true;
        }
        catch (err) {
            console.log('treasury not initialized', err);
            return false;
        }
    }
}
exports.TreasuryAccount = TreasuryAccount;
