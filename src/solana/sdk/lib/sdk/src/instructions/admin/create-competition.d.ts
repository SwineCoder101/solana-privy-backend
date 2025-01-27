import { Program, web3 } from '@coral-xyz/anchor';
import { TransactionInstruction } from '@solana/web3.js';
import { HorseRace } from '../../../../target/types/horse_race';
export declare function createCompetition(program: Program<HorseRace>, authority: web3.PublicKey, competitionHash: web3.PublicKey, competitionPubkey: web3.PublicKey, tokenA: web3.PublicKey, priceFeedId: string, adminPubkeys: web3.PublicKey[], houseCutFactor: number, minPayoutRatio: number, interval: number, startTime: number, endTime: number): Promise<TransactionInstruction>;
