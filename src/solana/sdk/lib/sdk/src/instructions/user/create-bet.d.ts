import { Program } from '@coral-xyz/anchor';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { HorseRace } from '../../../../target/types/horse_race';
export type CreateBetParams = {
    user: PublicKey;
    amount: number;
    lowerBoundPrice: number;
    upperBoundPrice: number;
    startTime?: number;
    endTime?: number;
    competitionKey: PublicKey;
    poolKey?: PublicKey;
};
export declare function createBetEntry(program: Program<HorseRace>, params: CreateBetParams): Promise<VersionedTransaction>;
export declare function createBet(program: Program<HorseRace>, user: PublicKey, amount: number, lowerBoundPrice: number, upperBoundPrice: number, poolKey: PublicKey, competitionKey: PublicKey): Promise<VersionedTransaction>;
