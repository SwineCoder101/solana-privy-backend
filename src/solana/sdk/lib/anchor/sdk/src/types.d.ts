import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { HorseRace } from "../../target/types/horse_race";
export type SdkConfig = {
    connection: Connection;
    program: Program<HorseRace>;
    provider: AnchorProvider;
    url: string;
    idl: HorseRace;
    signer: string;
    debug: boolean;
    prioritizationFee?: number;
};
export type SdkConfigData = {
    url?: string;
    idl?: HorseRace;
    signer: string;
    debug?: boolean;
    prioritizationFee?: number;
    provider?: AnchorProvider;
    connection?: Connection;
};
