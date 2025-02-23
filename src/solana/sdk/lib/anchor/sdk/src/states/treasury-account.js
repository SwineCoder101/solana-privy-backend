"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreasuryAccount = void 0;
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("../constants");
class TreasuryAccount {
    constructor(adminAuthorities, minSignatures, totalDeposits, totalWithdrawals, bump, vaultKey, vaultBump, treasuryKey) {
        this.adminAuthorities = adminAuthorities;
        this.minSignatures = minSignatures;
        this.totalDeposits = totalDeposits;
        this.totalWithdrawals = totalWithdrawals;
        this.bump = bump;
        this.vaultKey = vaultKey;
        this.vaultBump = vaultBump;
        this.treasuryKey = treasuryKey;
        this.adminAuthorities = adminAuthorities;
        this.minSignatures = minSignatures;
        this.totalDeposits = totalDeposits;
        this.totalWithdrawals = totalWithdrawals;
        this.bump = bump;
        this.vaultKey = vaultKey;
        this.vaultBump = vaultBump;
        this.treasuryKey = treasuryKey;
    }
    static async toTreasuryData(treasury) {
        return {
            adminAuthorities: treasury.adminAuthorities.map(a => a.toString()),
            minSignatures: treasury.minSignatures,
            totalDeposits: treasury.totalDeposits.toString(),
            totalWithdrawals: treasury.totalWithdrawals.toString(),
            bump: treasury.bump,
            vaultKey: treasury.vaultKey.toString(),
            vaultBump: treasury.vaultBump,
            treasuryKey: treasury.treasuryKey.toString(),
        };
    }
    static async fetch(program, treasuryKey) {
        const account = await program.account.treasury.fetch(treasuryKey);
        return new TreasuryAccount(account.adminAuthorities, account.minSignatures, account.totalDeposits, account.totalWithdrawals, account.bump, account.vaultKey, account.vaultBump, treasuryKey);
    }
    static async getTreasuryPda(program) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(constants_1.TREASURY_SEED)], program.programId);
    }
    static async getTreasuryVaultPda(program) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(constants_1.TREASURY_VAULT_SEED)], program.programId);
    }
    static async getInstance(program) {
        if (TreasuryAccount.instance) {
            return TreasuryAccount.instance;
        }
        const treasury = await program.account.treasury.all();
        this.instance = treasury.map(t => new TreasuryAccount(t.account.adminAuthorities, t.account.minSignatures, t.account.totalDeposits, t.account.totalWithdrawals, t.account.bump, t.account.vaultKey, t.account.vaultBump, t.publicKey))[0];
        return TreasuryAccount.instance;
    }
    static async getTreasuryData(program) {
        const treasury = await TreasuryAccount.getInstance(program);
        return TreasuryAccount.toTreasuryData(treasury);
    }
    static async getTreasuryKey(program) {
        const treasury = await program.account.treasury.all();
        return treasury[0].publicKey;
    }
    static async getBalance(program) {
        const connection = program.provider.connection;
        const [treasuryVaultKey] = await TreasuryAccount.getTreasuryVaultPda(program);
        const balance = await connection.getBalance(treasuryVaultKey);
        return BigInt(balance);
    }
    static async isInitialized(program) {
        try {
            const [treasuryPda] = await TreasuryAccount.getTreasuryPda(program);
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
