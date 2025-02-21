import { Injectable, Logger } from '@nestjs/common';
import { settlePoolByPrice } from '@solana-sdk/instructions/admin/settle-pool-by-price';
import { PublicKey } from '@solana/web3.js';
import { AdminService } from '../admin/admin.service';
import { ProgramService } from '../program/program.service';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PythService } from 'src/pyth/pyth.service';

export type SettlementConfig = {
  interval: number;
  startTime: number;
  endTime: number;
  competition: string;
  priceFeedId: string;
};
@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);
  private readonly settlementJobs = new Map<string, CronJob>();

  constructor(
    private readonly programService: ProgramService,
    private readonly adminService: AdminService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly pythService: PythService,
  ) {}

  async initiateSettlementAutomation(
    config: SettlementConfig,
    poolKey: PublicKey,
  ) {
    const { interval, startTime, endTime, competition } = config;
    const now = Date.now();

    if (now < startTime) {
      throw new Error('Settlement automation not started yet');
    }

    // Check if a job for this competition already exists
    if (this.settlementJobs.has(competition)) {
      throw new Error(
        `Settlement automation for competition ${competition} already exists`,
      );
    }

    // Build a unique job name for easier management
    const jobName = `settlementJob-${competition}`;
    // Convert the interval from milliseconds to seconds for the cron expression
    const seconds = Math.floor(interval / 1000);
    // Build a cron expression that runs every "seconds" seconds
    const cronExpression = `*/${seconds} * * * * *`;

    const job = new CronJob(cronExpression, async () => {
      const currentTime = Date.now();
      if (currentTime >= endTime) {
        this.logger.log(
          `Settlement automation for competition ${competition} ended.`,
        );
        job.stop();
        this.schedulerRegistry.deleteCronJob(jobName);
        this.settlementJobs.delete(competition);
        return;
      }

      try {
        const { lowerBoundPrice, upperBoundPrice } =
          await this.pythService.getPriceRange(priceFeedId, startTime, endTime);
        await this.settlePoolByPrice(poolKey, lowerBoundPrice, upperBoundPrice);
      } catch (error) {
        this.logger.error(`Error during settlement: ${error.message}`);
      }
    });

    // Register the job with SchedulerRegistry and store it in the map
    this.schedulerRegistry.addCronJob(jobName, job as any);
    job.start();
    this.settlementJobs.set(competition, job);
    this.logger.log(
      `Settlement automation started for competition ${competition} with cron expression ${cronExpression}`,
    );
  }

  async stopSettlementAutomation(competitionKey: string) {
    const job = this.settlementJobs.get(competitionKey);
    if (!job) {
      throw new Error(
        `No settlement automation job found for competition key ${competitionKey}`,
      );
    }

    job.stop();
    const jobName = `settlementJob-${competitionKey}`;
    this.schedulerRegistry.deleteCronJob(jobName);
    this.settlementJobs.delete(competitionKey);
    this.logger.log(
      `Settlement automation stopped for competition ${competitionKey}`,
    );
  }

  async settlePoolByPrice(
    poolKey: PublicKey,
    lowerBoundPrice: number,
    upperBoundPrice: number,
  ) {
    const program = this.programService.getProgram();
    const admin = this.adminService.getAdminPublicKey();

    try {
      const vtx = await settlePoolByPrice(
        program as any,
        admin,
        poolKey,
        lowerBoundPrice,
        upperBoundPrice,
      );

      const signature =
        await this.adminService.signSendAndConfirmTransaction(vtx);

      this.logger.log('Settled pool: ', poolKey.toBase58());

      return {
        signature,
      };
    } catch (error) {
      this.logger.error(
        `Failed to settle pool ${poolKey.toString()}: ${error.message}`,
      );
      throw error;
    }
  }
}
