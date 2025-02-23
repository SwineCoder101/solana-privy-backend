import { PublicKey } from '@solana/web3.js';
import { Program, BN } from '@coral-xyz/anchor';
import { HorseRace } from '../types/horse_race';
export interface TreasuryData {
    adminAuthorities: string[];
    minSignatures: number;
    totalDeposits: number;
    totalWithdrawals: number;
    bump: number;
    vaultKey: string;
    vaultBump: number;
    treasuryKey: string;
}
export declare class TreasuryAccount {
    adminAuthorities: PublicKey[];
    minSignatures: number;
    totalDeposits: BN;
    totalWithdrawals: BN;
    bump: number;
    vaultKey: PublicKey;
    vaultBump: number;
    treasuryKey: PublicKey;
    static instance: TreasuryAccount;
    constructor(adminAuthorities: PublicKey[], minSignatures: number, totalDeposits: BN, totalWithdrawals: BN, bump: number, vaultKey: PublicKey, vaultBump: number, treasuryKey: PublicKey);
    static toTreasuryData(treasury: TreasuryAccount): Promise<TreasuryData>;
    static fetch(program: Program<HorseRace>, treasuryKey: PublicKey): Promise<TreasuryAccount>;
    static getTreasuryPda(program: Program<HorseRace>): Promise<[PublicKey, number]>;
    static getTreasuryVaultPda(program: Program<HorseRace>): Promise<[PublicKey, number]>;
    static getInstance(program: Program<HorseRace>): Promise<TreasuryAccount>;
    static getTreasuryData(program: Program<HorseRace>): Promise<TreasuryData>;
    static getTreasuryKey(program: Program<HorseRace>): Promise<PublicKey>;
    static getBalance(program: Program<HorseRace>): Promise<bigint>;
    static isInitialized(program: Program<HorseRace>): Promise<boolean>;
}
