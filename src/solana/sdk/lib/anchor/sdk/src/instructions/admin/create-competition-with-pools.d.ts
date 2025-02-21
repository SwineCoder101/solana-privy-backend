import { Program, web3 } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { HorseRace } from '../../../../target/types/horse_race';
export type CompetitionPoolResponse = {
    poolKeys: web3.PublicKey[];
    competitionTx: web3.VersionedTransaction;
    poolTxs: web3.VersionedTransaction[];
};
export type CompetitionPoolParams = {
    admin: PublicKey;
    tokenA: PublicKey;
    priceFeedId: string;
    adminKeys: PublicKey[];
    houseCutFactor: number;
    minPayoutRatio: number;
    interval: number;
    startTime: number;
    endTime: number;
    treasury: PublicKey;
};
export declare function createCompetitionWithPoolsEntry(program: Program<HorseRace>, params: CompetitionPoolParams): Promise<{
    competitionTx: web3.VersionedTransaction;
    poolKeys: web3.PublicKey[];
    poolTxs: web3.VersionedTransaction[];
}>;
export declare function createCompetitionWithPools(program: Program<HorseRace>, admin: PublicKey, competitionHash: PublicKey, tokenA: PublicKey, priceFeedId: string, adminKeys: PublicKey[], houseCutFactor: number, minPayoutRatio: number, interval: number, startTime: number, endTime: number): Promise<CompetitionPoolResponse>;
