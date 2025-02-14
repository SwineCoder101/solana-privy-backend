import { Program, web3 } from '@coral-xyz/anchor';
import { HorseRace } from '../../types/horse_race';
import { TransactionInstruction } from '@solana/web3.js';
export interface CreateTreasuryParams {
    maxAdmins: number;
    minSignatures: number;
    initialAdmins: web3.PublicKey[];
    payer?: web3.PublicKey;
}
export declare function createTreasury(program: Program<HorseRace>, params: CreateTreasuryParams): Promise<TransactionInstruction>;
