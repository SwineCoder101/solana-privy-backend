import { Controller, Post, Body, Logger } from '@nestjs/common';
import { EscrowService } from './escrow.service';
import {
  DeployEscrowDto,
  FundEscrowDto,
  CompleteWorkDto,
  BuyerApproveDto,
  BuyerDisputeDto,
  ArbitratorDecisionDto,
  ClaimFeesDto,
  ReleaseEscrowDto,
  BroadcastMessageDto,
} from './dto/escrow.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Escrow')
@Controller('escrow')
export class EscrowController {
  private readonly logger = new Logger(EscrowController.name);

  constructor(private readonly escrowService: EscrowService) {}

  @Post('prepare-deploy')
  @ApiOperation({ summary: 'Prepare deploy transaction for escrow contract' })
  @ApiBody({ type: DeployEscrowDto })
  @ApiResponse({
    status: 201,
    description: 'Deploy transaction prepared successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async prepareDeployTransaction(@Body() deployData: DeployEscrowDto) {
    this.logger.log(
      `Preparing deploy transaction for buyer: ${deployData.buyerAddress}`,
    );
    return await this.escrowService.prepareDeployTransaction(deployData);
  }

  @Post('prepare-fund')
  @ApiOperation({ summary: 'Prepare fund transaction for escrow contract' })
  @ApiBody({ type: FundEscrowDto })
  @ApiResponse({
    status: 201,
    description: 'Fund transaction prepared successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Escrow contract not found.' })
  async prepareFundTransaction(@Body() fundData: FundEscrowDto) {
    this.logger.log(
      `Preparing fund transaction for contract: ${fundData.contractAddress}`,
    );
    return await this.escrowService.prepareFundTransaction(fundData);
  }

  @Post('prepare-complete-work')
  @ApiOperation({ summary: 'Prepare complete work transaction' })
  @ApiBody({ type: CompleteWorkDto })
  @ApiResponse({
    status: 201,
    description: 'Complete work transaction prepared successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Escrow contract not found.' })
  async prepareCompleteWorkTransaction(@Body() completeData: CompleteWorkDto) {
    this.logger.log(
      `Preparing complete work transaction for contract: ${completeData.contractAddress}`,
    );
    return await this.escrowService.prepareCompleteWorkTransaction(
      completeData,
    );
  }

  @Post('prepare-buyer-approve')
  @ApiOperation({ summary: 'Prepare buyer approve transaction' })
  @ApiBody({ type: BuyerApproveDto })
  @ApiResponse({
    status: 201,
    description: 'Buyer approve transaction prepared successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Escrow contract not found.' })
  async prepareBuyerApproveTransaction(@Body() approveData: BuyerApproveDto) {
    this.logger.log(
      `Preparing buyer approve transaction for contract: ${approveData.contractAddress}`,
    );
    return await this.escrowService.prepareBuyerApproveTransaction(approveData);
  }

  @Post('prepare-buyer-dispute')
  @ApiOperation({ summary: 'Prepare buyer dispute transaction' })
  @ApiBody({ type: BuyerDisputeDto })
  @ApiResponse({
    status: 201,
    description: 'Buyer dispute transaction prepared successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Escrow contract not found.' })
  async prepareBuyerDisputeTransaction(@Body() disputeData: BuyerDisputeDto) {
    this.logger.log(
      `Preparing buyer dispute transaction for contract: ${disputeData.contractAddress}`,
    );
    return await this.escrowService.prepareBuyerDisputeTransaction(disputeData);
  }

  @Post('prepare-arbitrator-decision')
  @ApiOperation({ summary: 'Prepare arbitrator decision transaction' })
  @ApiBody({ type: ArbitratorDecisionDto })
  @ApiResponse({
    status: 201,
    description: 'Arbitrator decision transaction prepared successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Escrow contract not found.' })
  async prepareArbitratorDecisionTransaction(
    @Body() decisionData: ArbitratorDecisionDto,
  ) {
    this.logger.log(
      `Preparing arbitrator decision transaction for contract: ${decisionData.contractAddress}`,
    );
    return await this.escrowService.prepareArbitratorDecisionTransaction(
      decisionData,
    );
  }

  @Post('prepare-claim-fees')
  @ApiOperation({ summary: 'Prepare claim fees transaction' })
  @ApiBody({ type: ClaimFeesDto })
  @ApiResponse({
    status: 201,
    description: 'Claim fees transaction prepared successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Escrow contract not found.' })
  async prepareClaimFeesTransaction(@Body() claimData: ClaimFeesDto) {
    this.logger.log(
      `Preparing claim fees transaction for contract: ${claimData.contractAddress}`,
    );
    return await this.escrowService.prepareClaimFeesTransaction(claimData);
  }

  @Post('prepare-release-escrow')
  @ApiOperation({ summary: 'Prepare release escrow transaction' })
  @ApiBody({ type: ReleaseEscrowDto })
  @ApiResponse({
    status: 201,
    description: 'Release escrow transaction prepared successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Escrow contract not found.' })
  async prepareReleaseEscrowTransaction(@Body() releaseData: ReleaseEscrowDto) {
    this.logger.log(
      `Preparing release escrow transaction for contract: ${releaseData.contractAddress}`,
    );
    return await this.escrowService.prepareReleaseEscrowTransaction(
      releaseData,
    );
  }

  @Post('broadcast')
  @ApiOperation({ summary: 'Broadcast signed message' })
  @ApiBody({ type: BroadcastMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message broadcasted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async broadcastSignedMessage(@Body() broadcastData: BroadcastMessageDto) {
    this.logger.log(
      `Broadcasting signed message for contract: ${broadcastData.contractAddress}`,
    );
    return await this.escrowService.broadcastSignedMessage(
      broadcastData.signedMessage,
      broadcastData.contractAddress,
    );
  }

  @Post('arbitrator-claim-and-release')
  @ApiOperation({
    summary: 'Arbitrator claim fees and release funds to seller',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        contractAddress: { type: 'string' },
        arbitratorAddress: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Claim and release transactions prepared successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Escrow contract not found.' })
  async arbitratorClaimAndRelease(
    @Body('contractAddress') contractAddress: string,
    @Body('arbitratorAddress') arbitratorAddress: string,
  ) {
    this.logger.log(
      `Arbitrator claiming fees and releasing funds for contract: ${contractAddress}`,
    );
    return await this.escrowService.arbitratorClaimAndRelease(
      contractAddress,
      arbitratorAddress,
    );
  }
}
