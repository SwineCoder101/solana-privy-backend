import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { updateCompetitionInstruction } from '@solana-sdk/instructions/admin';
import {
  CompetitionPoolParams,
  createCompetitionWithPoolsEntry,
} from '@solana-sdk/instructions/admin/create-competition-with-pools';
import { PublicKey } from '@solana/web3.js';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class CompetitionService implements OnModuleInit {
  private readonly logger = new Logger(CompetitionService.name);

  constructor(private readonly adminService: AdminService) {}
  onModuleInit() {
    this.logger.log('Initializing competition service');
  }

  async createCompetitionWithPools(params: CompetitionPoolParams) {
    try {
      this.logger.log('Creating competition with pools');
      this.logger.log(
        'Provider: ',
        this.adminService.getProgram().provider.connection.rpcEndpoint,
      );
      const { competitionTx, poolKeys, poolTxs } =
        await createCompetitionWithPoolsEntry(
          this.adminService.getProgram() as any,
          params,
        );
      this.logger.log('Competition tx: ', competitionTx);

      const competitionTxHash =
        await this.adminService.signSendAndConfirmTransaction(competitionTx);

      // const poolTxHashes = await Promise.all(
      //   poolTxs.map((tx) => this.adminService.signAndSendTransaction(tx)),
      // );

      const poolTxHashes = [];
      poolTxs.forEach(async (tx) => {
        const sig = await this.adminService.signAndSendTransaction(tx);
        this.logger.log('Pool tx hash: ', sig);
        await this.adminService.confirmTransaction(sig);
        poolTxHashes.push(sig);
      });

      // this.logger.log('Competition tx hash: ', competitionTxHash);
      // this.logger.log('Pool tx hashes: ', poolTxHashes);

      // await Promise.all(
      //   poolTxHashes.map((sig) => this.adminService.confirmTransaction(sig)),
      // );

      return {
        competitionTxHash,
        poolTxHashes,
        poolKeys: poolKeys.map((key) => key.toBase58()),
      };
    } catch (e) {
      this.logger.error(e);
    }
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
    const transaction = await updateCompetitionInstruction(
      this.adminService.getProgram() as any,
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

    return transaction;
  }
}
