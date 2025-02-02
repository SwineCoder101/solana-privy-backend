import { Program } from '@coral-xyz/anchor';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { HorseRace } from '../../../../target/types/horse_race';
export type CancelBetParams = {
    user: PublicKey;
    poolKey: PublicKey;
    betHash: PublicKey;
};
export declare function cancelBetEntry(program: Program<HorseRace>, params: CancelBetParams): Promise<VersionedTransaction>;
export declare function cancelBet(program: Program<HorseRace>, user: PublicKey, poolKey: PublicKey, betHash: PublicKey): Promise<VersionedTransaction>;
