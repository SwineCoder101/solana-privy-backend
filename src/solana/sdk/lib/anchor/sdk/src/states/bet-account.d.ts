import { Program, BN, ProgramAccount } from "@coral-xyz/anchor";
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
    poolVaultKey: string;
    competition: string;
    status: BetStatus;
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
    leverageMultiplier: BN | number;
    createdAt: BN | number;
    updatedAt: BN | number;
    poolVaultKey: PublicKey;
};
export type StatusEnumProgram = {
    active: Record<string, never>;
} | {
    cancelled: Record<string, never>;
} | {
    settled: Record<string, never>;
};
export declare function convertBetToProgramData(betData: BetData): BetProgramData;
export declare function convertToBetStatus(status: StatusEnumProgram): BetStatus;
export declare function convertToBetProgramStatus(status: BetStatus): StatusEnumProgram;
export declare function convertProgramToBetData(account: ProgramAccount<BetProgramData>, accountPublicKey: PublicKey): Promise<BetData>;
export declare function getBetData(program: Program<HorseRace>, betPubkey: PublicKey): Promise<BetData>;
export declare function getBetsForUserAndPool(program: Program<HorseRace>, userPubkey: PublicKey, poolPubkey: PublicKey): Promise<BetData[]>;
export declare function getOwnerOfAccount(program: Program<HorseRace>, accountPubkey: PublicKey): Promise<PublicKey>;
export declare function getBetAccount(program: Program<HorseRace>, betPubkey: PublicKey): Promise<{
    user: PublicKey;
    amount: BN;
    competition: PublicKey;
    lowerBoundPrice: BN;
    upperBoundPrice: BN;
    poolKey: PublicKey;
    poolVaultKey: PublicKey;
    status: any;
    leverageMultiplier: BN;
    createdAt: BN;
    updatedAt: BN;
}>;
export declare function getBetAccountsForUser(program: Program<HorseRace>, userPubkey: PublicKey): Promise<BetData[]>;
export declare function getAllBetAccounts(program: Program<HorseRace>): Promise<BetData[]>;
export declare function getActiveBetAccountsForPool(program: Program<HorseRace>, poolPubkey: PublicKey): Promise<BetData[]>;
export declare function getActiveBetAccountsForUser(program: Program<HorseRace>, userPubkey: PublicKey): Promise<BetData[]>;
export declare function getCancelledBetAccountsForUser(program: Program<HorseRace>, userPubkey: PublicKey): Promise<BetData[]>;
export declare function getSettledBetAccountsForUser(program: Program<HorseRace>, userPubkey: PublicKey): Promise<BetData[]>;
export declare function getBetAccountsForPool(program: Program<HorseRace>, poolPubkey: PublicKey): Promise<BetData[]>;
export declare function getAllBetDataByUser(program: Program<HorseRace>, user: PublicKey): Promise<BetData[]>;
