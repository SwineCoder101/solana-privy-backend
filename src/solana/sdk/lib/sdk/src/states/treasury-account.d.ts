import { PublicKey } from '@solana/web3.js';
import { Program, BN } from '@coral-xyz/anchor';
import { HorseRace } from '../types/horse_race';
export declare class TreasuryAccount {
    adminAuthorities: PublicKey[];
    minSignatures: number;
    totalDeposits: BN;
    totalWithdrawals: BN;
    bump: number;
    constructor(adminAuthorities: PublicKey[], minSignatures: number, totalDeposits: BN, totalWithdrawals: BN, bump: number);
    static fetch(program: Program<HorseRace>, treasuryKey: PublicKey): Promise<TreasuryAccount>;
    static getPda(program: Program<HorseRace>): Promise<[PublicKey, number]>;
    static getBalance(program: Program<HorseRace>, treasuryKey: PublicKey): Promise<bigint>;
    static isInitialized(program: Program<HorseRace>): Promise<boolean>;
}
