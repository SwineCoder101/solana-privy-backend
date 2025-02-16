import { Program, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { HorseRace } from "../../../target/types/horse_race";
export declare enum BetStatus {
    Active = 0,
    Cancelled = 1,
    Settled = 2
}
export interface BetData {
    publicKey: string;
    user: string;
    amount: number;
    lowerBoundPrice: number;
    upperBoundPrice: number;
    poolKey: string;
    competition: string;
    status: BetStatus;
    leverage: number;
    leverageMultiplier: number;
    createdAt: Date;
    updatedAt: Date;
}
export type BetProgramData = {
    user: PublicKey;
    amount: BN | number;
    competition: PublicKey;
    lowerBoundPrice: BN | number;
    upperBoundPrice: BN | number;
    poolKey: PublicKey;
    status: StatusEnumProgram;
};
export type StatusEnumProgram = {
    active: {};
} | {
    cancelled: {};
} | {
    settled: {};
};
export declare function convertBetToProgramData(betData: BetData): BetProgramData;
export declare function convertToBetStatus(status: StatusEnumProgram): BetStatus;
export declare function convertToBetProgramStatus(status: BetStatus): StatusEnumProgram;
export declare function convertProgramToBetData(account: any, accountPublicKey: PublicKey): Promise<BetData>;
export declare function getBetData(program: Program<HorseRace>, betPubkey: PublicKey): Promise<BetData>;
export declare function getBetsForUserAndPool(program: Program<HorseRace>, userPubkey: PublicKey, poolPubkey: PublicKey): Promise<BetData[]>;
export declare function getBetAccount(program: Program<HorseRace>, betPubkey: PublicKey): Promise<{
    user: PublicKey;
    amount: BN;
    competition: PublicKey;
    lowerBoundPrice: BN;
    upperBoundPrice: BN;
    poolKey: PublicKey;
    status: any;
    leverage: BN;
    leverageMultiplier: BN;
    createdAt: BN;
    updatedAt: BN;
}>;
export declare function getBetAccountsForUser(program: Program<HorseRace>, userPubkey: PublicKey): Promise<BetData[]>;
export declare function getAllBetAccounts(program: Program<HorseRace>): Promise<BetData[]>;
export declare function getActiveBetAccountsForPool(program: Program<HorseRace>, poolPubkey: PublicKey): Promise<BetData[]>;
export declare function getBetAccountsForPool(program: Program<HorseRace>, poolPubkey: PublicKey): Promise<BetData[]>;
export declare function getAllBetDataByUser(program: Program<HorseRace>, user: PublicKey): Promise<BetData[]>;
