import { HorseRace } from "./utils";
import { PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
export * from "./instructions/admin";
export * from "./states";
export * from "./utils";
export declare const IDL: HorseRace;
export declare const HORSE_RACE_PROGRAM_ID: PublicKey;
export declare const HORSE_RACE_PROGRAM: Program<HorseRace>;
