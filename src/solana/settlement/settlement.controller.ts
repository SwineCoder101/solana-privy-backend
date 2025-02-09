import { Body, Controller, Post } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { SettlementService } from './settlement.service';
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
  constructor(private readonly settlementService: SettlementService) {}

  @Post('settle-by-price')
  async settlePoolByPrice(@Body() dto: SettlePoolByPriceDto) {
    return this.settlementService.settlePoolByPrice(
      new PublicKey(dto.poolKey),
      dto.lowerBoundPrice,
      dto.upperBoundPrice,
    );
  }
}
