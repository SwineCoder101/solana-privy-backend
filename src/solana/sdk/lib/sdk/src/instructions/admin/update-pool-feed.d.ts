import { Program } from '@coral-xyz/anchor';
import { HorseRace } from '../../../../target/types/horse_race';
import { Keypair, PublicKey, TransactionSignature } from '@solana/web3.js';
export declare function updateFeed(program: Program<HorseRace>, authority: Keypair, poolKey: PublicKey, priceFeedId: string, priceFeedAccount: PublicKey): Promise<TransactionSignature>;
