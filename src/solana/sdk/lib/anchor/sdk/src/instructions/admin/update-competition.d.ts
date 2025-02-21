import { Program, web3 } from "@coral-xyz/anchor";
import { HorseRace } from "../../../../target/types/horse_race";
export declare function updateCompetitionInstruction(program: Program<HorseRace>, competitionPubkey: web3.PublicKey, tokenA: web3.PublicKey, priceFeedId: string, adminPubkeys: web3.PublicKey[], houseCutFactor: number, minPayoutRatio: number, interval: number, startTime: number, endTime: number, authority: web3.PublicKey): Promise<web3.TransactionInstruction>;
