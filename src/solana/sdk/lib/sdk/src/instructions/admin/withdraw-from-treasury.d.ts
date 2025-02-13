import { Program, web3, BN } from '@coral-xyz/anchor';
import { HorseRace } from '../../types/horse_race';
import { TransactionInstruction } from '@solana/web3.js';
export interface WithdrawFromTreasuryParams {
    amount: BN;
    recipient: web3.PublicKey;
    pool: web3.PublicKey;
    authority?: web3.PublicKey;
}
export declare function withdrawFromTreasury(program: Program<HorseRace>, params: WithdrawFromTreasuryParams): Promise<TransactionInstruction>;
