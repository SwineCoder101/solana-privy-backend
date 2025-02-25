import { Program } from '@coral-xyz/anchor';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { HorseRace } from '../../../../target/types/horse_race';
export type CreatePoolResponse = {
    poolKey: PublicKey;
    ix: TransactionInstruction;
};
export declare function createPool(program: Program<HorseRace>, admin: PublicKey, competitionKey: PublicKey, startTime: number, endTime: number, poolHash: PublicKey): Promise<CreatePoolResponse>;
