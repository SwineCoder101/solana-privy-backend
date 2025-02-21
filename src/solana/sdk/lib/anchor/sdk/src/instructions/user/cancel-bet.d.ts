import { Program } from '@coral-xyz/anchor';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { BetData } from '../..';
import { HorseRace } from '../../../../target/types/horse_race';
export type CancelBetParams = {
    user: PublicKey;
    poolKey: PublicKey;
};
export declare function cancelAllBetsForUserOnPoolEntry(program: Program<HorseRace>, params: CancelBetParams): Promise<{
    txs: VersionedTransaction[];
    bets: BetData[];
}>;
export declare function cancelBetByKey(program: Program<HorseRace>, betKey: PublicKey, user: PublicKey, poolKey: PublicKey): Promise<VersionedTransaction>;
export declare function cancelBet(program: Program<HorseRace>, user: PublicKey, poolKey: PublicKey, betHash: PublicKey): Promise<VersionedTransaction>;
