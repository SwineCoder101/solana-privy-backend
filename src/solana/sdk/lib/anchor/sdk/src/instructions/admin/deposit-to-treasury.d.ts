import { Program, web3, BN } from '@coral-xyz/anchor';
import { TransactionInstruction } from '@solana/web3.js';
import { HorseRace } from '../../types/horse_race';
export interface DepositToTreasuryParams {
    amount: BN;
    depositor?: web3.PublicKey;
}
export declare function depositToTreasury(program: Program<HorseRace>, params: DepositToTreasuryParams): Promise<TransactionInstruction>;
