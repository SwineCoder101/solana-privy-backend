import { Injectable, Logger } from '@nestjs/common';
import { TonClient } from '@ton/ton';
import { EscrowContract } from './wrapper/FiverEscrow';
import { Address, Cell, toNano, beginCell } from '@ton/core';
import { PrismaService } from '..//prisma.service';
import {
  DeployEscrowDto,
  FundEscrowDto,
  CompleteWorkDto,
  BuyerApproveDto,
  BuyerDisputeDto,
  ArbitratorDecisionDto,
  ClaimFeesDto,
  ReleaseEscrowDto,
} from './dto/escrow.dto';
import { EscrowStatus } from '@prisma/client';

@Injectable()
export class EscrowService {
  private tonClient: TonClient;
  private readonly logger = new Logger(EscrowService.name);

  constructor(private prisma: PrismaService) {
    this.tonClient = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });
  }

  private async prepareTransaction(
    contractAddress: string,
    body: Cell,
    value: bigint,
  ) {
    return {
      to: Address.parse(contractAddress),
      value: value,
      body: body,
    };
  }

  async prepareDeployTransaction(deployData: DeployEscrowDto) {
    try {
      const escrowContract = EscrowContract.createFromConfig(
        {
          arbitratorAddresses: deployData.arbitratorAddresses.map((addr) =>
            Address.parse(addr),
          ),
          sellerAddress: Address.parse(deployData.sellerAddress),
          buyerAddress: Address.parse(deployData.buyerAddress),
          feePercentage: deployData.feePercentage,
          dealDuration: deployData.dealDuration,
        },
        Cell.fromBase64('... contract code ...'),
      );

      const deployAmount = toNano('0.1'); // Example amount

      const transaction = await this.prepareTransaction(
        escrowContract.address.toString(),
        new Cell(),
        deployAmount,
      );

      // Create escrow contract record in database
      await this.prisma.escrowContract.create({
        data: {
          contractAddress: escrowContract.address.toString(),
          status: EscrowStatus.CREATED,
          offer: {
            connect: {
              id: deployData.offerId,
            },
          },
          amount: 0, // Initial amount is 0
          currency: 'TON',
          feePercentage: deployData.feePercentage,
          dealDuration: deployData.dealDuration,
        },
      });

      return {
        transaction: transaction,
        contractAddress: escrowContract.address.toString(),
      };
    } catch (error) {
      this.logger.error(`Error preparing deploy transaction: ${error.message}`);
      throw error;
    }
  }

  async prepareFundTransaction(fundData: FundEscrowDto) {
    try {
      const body = beginCell()
        .storeUint(1, 32) // OP_FUND_ESCROW
        .storeUint(0, 64) // query_id
        .endCell();

      const transaction = await this.prepareTransaction(
        fundData.contractAddress,
        body,
        toNano(fundData.amount),
      );

      // Update escrow contract status in database
      await this.prisma.escrowContract.update({
        where: { contractAddress: fundData.contractAddress },
        data: {
          status: EscrowStatus.FUNDED,
          amount: parseFloat(fundData.amount),
        },
      });

      return { transaction };
    } catch (error) {
      this.logger.error(`Error preparing fund transaction: ${error.message}`);
      throw error;
    }
  }

  async prepareCompleteWorkTransaction(completeData: CompleteWorkDto) {
    try {
      const body = beginCell()
        .storeUint(2, 32) // OP_COMPLETE_WORK
        .storeUint(0, 64) // query_id
        .endCell();

      const transaction = await this.prepareTransaction(
        completeData.contractAddress,
        body,
        toNano('0.01'), // Minimum gas fee
      );

      // Update escrow contract status in database
      await this.prisma.escrowContract.update({
        where: { contractAddress: completeData.contractAddress },
        data: { status: EscrowStatus.WORK_COMPLETED },
      });

      return { transaction };
    } catch (error) {
      this.logger.error(
        `Error preparing complete work transaction: ${error.message}`,
      );
      throw error;
    }
  }

  async prepareBuyerApproveTransaction(approveData: BuyerApproveDto) {
    try {
      const body = beginCell()
        .storeUint(3, 32) // OP_BUYER_APPROVE
        .storeUint(0, 64) // query_id
        .endCell();

      const transaction = await this.prepareTransaction(
        approveData.contractAddress,
        body,
        toNano('0.01'), // Minimum gas fee
      );

      // Update escrow contract status in database
      await this.prisma.escrowContract.update({
        where: { contractAddress: approveData.contractAddress },
        data: { status: EscrowStatus.BUYER_APPROVED },
      });

      return { transaction };
    } catch (error) {
      this.logger.error(
        `Error preparing buyer approve transaction: ${error.message}`,
      );
      throw error;
    }
  }

  async prepareBuyerDisputeTransaction(disputeData: BuyerDisputeDto) {
    try {
      const body = beginCell()
        .storeUint(4, 32) // OP_BUYER_DISPUTE
        .storeUint(0, 64) // query_id
        .endCell();

      const transaction = await this.prepareTransaction(
        disputeData.contractAddress,
        body,
        toNano('0.01'), // Minimum gas fee
      );

      // Update escrow contract status in database
      await this.prisma.escrowContract.update({
        where: { contractAddress: disputeData.contractAddress },
        data: { status: EscrowStatus.DISPUTED },
      });

      return { transaction };
    } catch (error) {
      this.logger.error(
        `Error preparing buyer dispute transaction: ${error.message}`,
      );
      throw error;
    }
  }

  async prepareArbitratorDecisionTransaction(
    decisionData: ArbitratorDecisionDto,
  ) {
    try {
      const body = beginCell()
        .storeUint(5, 32) // OP_ARBITRATOR_DECISION
        .storeUint(0, 64) // query_id
        .storeUint(decisionData.sellerPercentage, 16)
        .endCell();

      const transaction = await this.prepareTransaction(
        decisionData.contractAddress,
        body,
        toNano('0.01'), // Minimum gas fee
      );

      // Update escrow contract status in database
      await this.prisma.escrowContract.update({
        where: { contractAddress: decisionData.contractAddress },
        data: { status: EscrowStatus.ARBITRATED },
      });

      return { transaction };
    } catch (error) {
      this.logger.error(
        `Error preparing arbitrator decision transaction: ${error.message}`,
      );
      throw error;
    }
  }

  async prepareClaimFeesTransaction(claimData: ClaimFeesDto) {
    try {
      const body = beginCell()
        .storeUint(6, 32) // OP_CLAIM_FEES
        .storeUint(0, 64) // query_id
        .endCell();

      const transaction = await this.prepareTransaction(
        claimData.contractAddress,
        body,
        toNano('0.01'), // Minimum gas fee
      );

      // Update escrow contract status in database
      await this.prisma.escrowContract.update({
        where: { contractAddress: claimData.contractAddress },
        data: { status: EscrowStatus.FEES_CLAIMED },
      });

      return { transaction };
    } catch (error) {
      this.logger.error(
        `Error preparing claim fees transaction: ${error.message}`,
      );
      throw error;
    }
  }

  async prepareReleaseEscrowTransaction(releaseData: ReleaseEscrowDto) {
    try {
      const body = beginCell()
        .storeUint(7, 32) // OP_RELEASE_ESCROW
        .storeUint(0, 64) // query_id
        .endCell();

      const transaction = await this.prepareTransaction(
        releaseData.contractAddress,
        body,
        toNano('0.01'), // Minimum gas fee
      );

      // Update escrow contract status in database
      await this.prisma.escrowContract.update({
        where: { contractAddress: releaseData.contractAddress },
        data: { status: EscrowStatus.RELEASED },
      });

      return { transaction };
    } catch (error) {
      this.logger.error(
        `Error preparing release escrow transaction: ${error.message}`,
      );
      throw error;
    }
  }

  async broadcastSignedMessage(signedMessage: string, contractAddress: string) {
    try {
      const cell = Cell.fromBase64(signedMessage);
      const address = Address.parse(contractAddress);

      await this.tonClient.sendExternalMessage({ address }, cell);

      this.logger.log('Transaction sent successfully');
      return { success: true };
    } catch (error) {
      this.logger.error(`Error sending transaction: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async arbitratorClaimAndRelease(
    contractAddress: string,
    arbitratorAddress: string,
  ) {
    try {
      const escrowContract = await this.prisma.escrowContract.findUnique({
        where: { contractAddress },
        include: { offer: true },
      });

      if (!escrowContract) {
        throw new Error('Escrow contract not found');
      }

      if (escrowContract.status !== EscrowStatus.WORK_COMPLETED) {
        throw new Error('Invalid escrow status for this operation');
      }

      // Fetch the job associated with the offer to get the arbitrator addresses
      const job = await this.prisma.job.findUnique({
        where: { id: escrowContract.offer.jobId },
        select: { arbitratorAddresses: true },
      });

      if (!job) {
        throw new Error('Associated job not found');
      }

      // Check if the arbitrator is valid
      if (!job.arbitratorAddresses.includes(arbitratorAddress)) {
        throw new Error('Invalid arbitrator address');
      }

      // Prepare claim fees transaction
      const claimFeesBody = beginCell()
        .storeUint(6, 32) // OP_CLAIM_FEES
        .storeUint(0, 64) // query_id
        .endCell();

      const claimFeesTransaction = await this.prepareTransaction(
        contractAddress,
        claimFeesBody,
        toNano('0.01'), // Minimum gas fee
      );

      // Prepare release escrow transaction
      const releaseEscrowBody = beginCell()
        .storeUint(7, 32) // OP_RELEASE_ESCROW
        .storeUint(0, 64) // query_id
        .endCell();

      const releaseEscrowTransaction = await this.prepareTransaction(
        contractAddress,
        releaseEscrowBody,
        toNano('0.01'), // Minimum gas fee
      );

      // Update escrow contract status in database
      await this.prisma.escrowContract.update({
        where: { contractAddress },
        data: { status: EscrowStatus.RELEASED },
      });

      return { claimFeesTransaction, releaseEscrowTransaction };
    } catch (error) {
      this.logger.error(
        `Error in arbitrator claim and release: ${error.message}`,
      );
      throw error;
    }
  }
}
