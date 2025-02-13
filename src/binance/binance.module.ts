import { Module } from '@nestjs/common';
import { BinancePriceService } from './binance-price.service';
import { BinanceController } from './binance.controller';
import { PriceAggregatorService } from './price-aggregator.service';

@Module({
  providers: [BinancePriceService, PriceAggregatorService],
  controllers: [BinanceController],
  exports: [BinancePriceService, PriceAggregatorService],
})
export class BinanceModule {}
