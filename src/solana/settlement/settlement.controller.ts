import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { SettlementConfig, SettlementService } from './settlement.service';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class SettlePoolByPriceDto {
  @IsString()
  poolKey: string;

  @IsNumber()
  @IsPositive()
  lowerBoundPrice: number;

  @IsNumber()
  @IsPositive()
  upperBoundPrice: number;
}

@Controller('settlement')
export class SettlementController {
  private readonly logger = new Logger(SettlementController.name);

  constructor(private readonly settlementService: SettlementService) {}

  @Post('settle-by-price')
  async settlePoolByPrice(@Body() dto: SettlePoolByPriceDto) {
    this.logger.log('Settling pool by price: ', dto);
    return this.settlementService.settlePool(
      new PublicKey(dto.poolKey),
      dto.lowerBoundPrice,
      dto.upperBoundPrice,
    );
  }

  @Post('initiate-settlement-automation')
  async initiateSettlementAutomation(@Body() dto: SettlementConfig) {
    this.logger.log('Initiating settlement automation: ', dto);
    return this.settlementService.initiateSettlementAutomation(dto);
  }

  @Post('stop-settlement-automation')
  async stopSettlementAutomation(@Body() dto: { competitionKey: string }) {
    this.logger.log('Stopping settlement automation: ', dto);
    return this.settlementService.stopSettlementAutomation(dto.competitionKey);
  }
}
