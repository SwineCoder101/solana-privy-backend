import { Injectable } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { PrivyService } from '../../privy/privy.service';
import { ProgramService } from '../program/program.service';
import { createBet } from '@solana-sdk/instructions/user/create-bet';
import { cancelBet } from '@solana-sdk/instructions/user/cancel-bet';

@Injectable()
export class OrderService {
  constructor(
    private privyService: PrivyService,
    private programService: ProgramService,
  ) {}

  async createBet(
    userId: string,
    params: {
      amount: number;
      lowerBoundPrice: number;
      upperBoundPrice: number;
      poolKey: PublicKey;
      competitionKey: PublicKey;
    },
  ) {
    const delegatedWallet = await this.privyService.getDelegatedWallet(userId);

    const transaction = await createBet(
      this.programService.getProgram() as any,
      new PublicKey(delegatedWallet.address),
      params.amount,
      params.lowerBoundPrice,
      params.upperBoundPrice,
      params.poolKey,
      params.competitionKey,
    );

    return this.privyService.executeDelegatedActionWithWallet(
      delegatedWallet,
      transaction,
    );
  }

  async cancelBet(
    userId: string,
    params: {
      poolKey: PublicKey;
      betHash: PublicKey;
    },
  ) {
    const delegatedWallet = await this.privyService.getDelegatedWallet(userId);

    const transaction = await cancelBet(
      this.programService.getProgram() as any,
      new PublicKey(delegatedWallet.address),
      params.poolKey,
      params.betHash,
    );

    return this.privyService.executeDelegatedActionWithWallet(
      delegatedWallet,
      transaction,
    );
  }
}
