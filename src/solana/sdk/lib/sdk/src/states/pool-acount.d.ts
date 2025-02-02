import { Program, BN, ProgramAccount } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { HorseRace } from "../../../target/types/horse_race";
export type PoolData = {
    poolKey: string;
    poolHash: string;
    competitionKey: string;
    startTime: number;
    endTime: number;
    treasury: string;
};
export type PoolProgramData = {
    poolKey?: PublicKey;
    poolHash: PublicKey;
    competitionKey: PublicKey;
    startTime: BN | number;
    endTime: BN | number;
    treasury: PublicKey;
};
export declare function convertPoolToProgramData(poolData: PoolData): PoolProgramData;
export declare function convertProgramToPoolData(programData: ProgramAccount<PoolProgramData>): PoolData;
export declare const findPoolAddress: (programId: string, competitionKey: string, poolHash: string) => PublicKey;
export declare function getPoolData(program: Program<HorseRace>, poolPubkey: PublicKey): Promise<PoolData>;
export declare function getBalanceOfPool(program: Program<HorseRace>, poolPubkey: PublicKey): Promise<number>;
export declare function getPoolAccount(program: Program<HorseRace>, poolPubkey: PublicKey): Promise<{
    poolHash: PublicKey;
    competitionKey: PublicKey;
    startTime: BN;
    endTime: BN;
    treasury: PublicKey;
}>;
export declare function getPoolAccounts(program: Program<HorseRace>, poolPubkeys: PublicKey[]): Promise<({
    poolHash: PublicKey;
    competitionKey: PublicKey;
    startTime: BN;
    endTime: BN;
    treasury: PublicKey;
} | null)[]>;
export declare function getPoolBalance(poolPubkey: PublicKey, program: Program<HorseRace>): Promise<number>;
export declare function getPoolAccountsFromCompetition(program: Program<HorseRace>, competitionKey: PublicKey): Promise<ProgramAccount<{
    poolHash: PublicKey;
    competitionKey: PublicKey;
    startTime: BN;
    endTime: BN;
    treasury: PublicKey;
}>[]>;
export declare function getAllPoolDataByCompetition(program: Program<HorseRace>, competition: PublicKey): Promise<PoolData[]>;
export declare function getAllPoolDataByUser(program: Program<HorseRace>, user: PublicKey): Promise<PoolData[]>;
export declare function findPoolKeyFromStartEndTime(program: Program<HorseRace>, competitionKey: PublicKey, startTime: number, endTime: number): Promise<PublicKey>;
