import { Injectable, Logger } from '@nestjs/common';
import { settlePoolByPrice } from '@solana-sdk/instructions/admin/settle-pool-by-price';
import { PublicKey } from '@solana/web3.js';
import { AdminService } from '../admin/admin.service';
import { ProgramService } from '../program/program.service';

@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);

  constructor(
    private readonly programService: ProgramService,
    private readonly adminService: AdminService,
  ) {}

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
