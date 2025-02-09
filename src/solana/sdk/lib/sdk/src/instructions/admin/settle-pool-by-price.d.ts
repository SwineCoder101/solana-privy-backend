import { Program } from "@coral-xyz/anchor";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";
import { HorseRace } from "../../utils";
export declare function settlePoolByPrice(program: Program<HorseRace>, admin: PublicKey, poolKey: PublicKey, lowerBoundPrice: number, upperBoundPrice: number): Promise<VersionedTransaction>;
