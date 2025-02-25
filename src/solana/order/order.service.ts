import { Injectable, Logger } from '@nestjs/common';
import {
  cancelAllBetsForUserOnPoolEntry,
  CancelBetParams,
} from '@solana-sdk/instructions/user/cancel-bet';
import { createBet } from '@solana-sdk/instructions/user/create-bet';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { PrivyService } from '../../privy/privy.service';
import { ProgramService } from '../program/program.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

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
      leverageMultiplier: number;
    },
  ) {
    const delegatedWallet = await this.privyService.getDelegatedWallet(userId);
    this.logger.log('Delegated wallet: ', delegatedWallet.address);

    try {
      const transaction = await createBet(
        this.programService.getProgram() as any,
        new PublicKey(delegatedWallet.address),
        params.amount * LAMPORTS_PER_SOL,
        params.lowerBoundPrice,
        params.upperBoundPrice,
        params.leverageMultiplier,
        params.poolKey,
        params.competitionKey,
      );

      const txHash = await this.privyService.executeDelegatedActionWithWallet(
        delegatedWallet,
        transaction,
      );
      return { txHash };
    } catch (error) {
      this.logger.error('Error creating bet: ', error);
      throw error;
    }
  }

  async cancelBet(userId: string, params: CancelBetParams) {
    const delegatedWallet = await this.privyService.getDelegatedWallet(userId);

    const { txs, bets } = await cancelAllBetsForUserOnPoolEntry(
      this.programService.getProgram() as any,
      params,
    );

    const signatures = await Promise.all(
      txs.map((tx) =>
        this.privyService.executeDelegatedActionWithWallet(delegatedWallet, tx),
      ),
    );

    return { signatures, bets };
  }
}

export interface CancelBetResponse {
  txHash: string;
}
