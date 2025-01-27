import { Program, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { HorseRace } from "../../../target/types/horse_race";
export type CompetitionData = {
    tokenA: string;
    priceFeedId: string;
    admin: string[];
    houseCutFactor: number;
    minPayoutRatio: number;
    interval: number;
    startTime: number;
    endTime: number;
};
export type CompetitionProgramData = {
    tokenA: PublicKey;
    priceFeedId: string;
    admin: PublicKey[];
    houseCutFactor: BN | number;
    minPayoutRatio: BN | number;
    interval: BN | number;
    startTime: BN | number;
    endTime: BN | number;
};
export declare function convertCompetitionToProgramData(competitionData: CompetitionData): CompetitionProgramData;
export declare function convertProgramToCompetitionData(programData: CompetitionProgramData): CompetitionData;
export declare const findCompetitonAddress: (competitionHash: PublicKey, programId?: string) => PublicKey;
export declare function getCompetitionData(competitionHash: PublicKey, program: Program<HorseRace>): Promise<CompetitionData>;
export declare function getCompetitionAccount(program: Program<HorseRace>, competitionPubkey: PublicKey): Promise<{
    tokenA: PublicKey;
    priceFeedId: string;
    houseCutFactor: number;
    minPayoutRatio: number;
    admin: PublicKey[];
    interval: BN;
    startTime: BN;
    endTime: BN;
}>;
export declare function getAllCompetitions(program: Program<HorseRace>): Promise<CompetitionData[]>;
export declare function getAllLiveCompetitions(program: Program<HorseRace>): Promise<CompetitionData[]>;
