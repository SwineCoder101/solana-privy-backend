import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PublicKey } from '@solana/web3.js';
import { PrivyService } from '../../privy/privy.service';
import { ProgramService } from '../program/program.service';
import { 
  updateCompetitionInstruction,
  HorseRace 
} from '../sdk';
import { createCompetitionWithPools } from '../sdk/lib/sdk/src/instructions/admin/create-competition-with-pools';

@Injectable()
export class CompetitionService {
  constructor(
    private configService: ConfigService,
    private privyService: PrivyService,
    private programService: ProgramService,
  ) {}

  async createCompetitionWithPools(
    userId: string,
    params: {
      competitionHash: PublicKey;
      tokenA: PublicKey;
      priceFeedId: string;
      adminKeys: PublicKey[];
      houseCutFactor: number;
      minPayoutRatio: number;
      interval: number;
      startTime: number;
      endTime: number;
      treasury: PublicKey;
    }
  ) {
    const admin = new PublicKey(this.configService.get('SOLANA_PUBLIC_PROGRAM_ID'));
    
    const response = await createCompetitionWithPools(
      this.programService.getProgram(),
      admin,
      params.competitionHash,
      params.tokenA,
      params.priceFeedId,
      params.adminKeys,
      params.houseCutFactor,
      params.minPayoutRatio,
      params.interval,
      params.startTime,
      params.endTime,
      params.treasury
    );

    // Execute each transaction using Privy
    const competitionTxHash = await this.privyService.executeDelegatedAction(
      userId,
      response.competitionTx
    );

    const poolTxHashes = await Promise.all(
      response.poolTxs.map(tx => 
        this.privyService.executeDelegatedAction(userId, tx)
      )
    );

    return {
      competitionTxHash,
      poolTxHashes,
      poolKeys: response.poolKeys
    };
  }

  async updateCompetition(
    userId: string,
    params: {
      competitionKey: PublicKey;
      tokenA: PublicKey;
      priceFeedId: string;
      adminKeys: PublicKey[];
      houseCutFactor: number;
      minPayoutRatio: number;
      interval: number;
      startTime: number;
      endTime: number;
    }
  ) {
    const delegatedWallet = await this.privyService.getDelegatedWallet(userId);

    const transaction = await updateCompetitionInstruction(
      this.programService.getProgram(),
      params.competitionKey,
      params.tokenA,
      params.priceFeedId,
      params.adminKeys,
      params.houseCutFactor,
      params.minPayoutRatio,
      params.interval,
      params.startTime,
      params.endTime
    );

    return this.privyService.executeDelegatedActionWithWallet(delegatedWallet, transaction);
  }
} 