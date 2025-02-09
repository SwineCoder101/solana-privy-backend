import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { updateCompetitionInstruction } from '@solana-sdk/instructions/admin';
import {
  CompetitionPoolParams,
  createCompetitionWithPoolsEntry,
} from '@solana-sdk/instructions/admin/create-competition-with-pools';
import { PublicKey } from '@solana/web3.js';
import { PrivyService } from '../../privy/privy.service';
import { AdminService } from '../admin/admin.service';
import { ProgramService } from '../program/program.service';

@Injectable()
export class CompetitionService {
  constructor(
    private configService: ConfigService,
    private privyService: PrivyService,
    private programService: ProgramService,
    private adminService: AdminService,
  ) {}

  async createCompetitionWithPools(params: CompetitionPoolParams) {
    const { competitionTx, poolKeys, poolTxs } =
      await createCompetitionWithPoolsEntry(
        this.programService.getProgram() as any,
        params,
      );

    const competitionTxHash =
      await this.adminService.executeTransaction(competitionTx);

    const poolTxHashes = await Promise.all(
      poolTxs.map((tx) => this.adminService.signAndSendTransaction(tx)),
    );

    await Promise.all(
      poolTxHashes.map((sig) => this.adminService.confirmTransaction(sig)),
    );

    return {
      competitionTxHash,
      poolTxHashes,
      poolKeys,
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
    },
  ) {
    const delegatedWallet = await this.privyService.getDelegatedWallet(userId);

    const transaction = await updateCompetitionInstruction(
      this.programService.getProgram() as any,
      params.competitionKey,
      params.tokenA,
      params.priceFeedId,
      params.adminKeys,
      params.houseCutFactor,
      params.minPayoutRatio,
      params.interval,
      params.startTime,
      params.endTime,
    );

    return this.privyService.executeDelegatedActionWithWallet(
      delegatedWallet,
      transaction,
    );
  }
}
