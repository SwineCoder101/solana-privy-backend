import { Module } from '@nestjs/common';
import { BinanceClientService } from './binance-client.service';
import { BinanceController } from './binance.controller';

@Module({
  providers: [BinanceClientService],
  controllers: [BinanceController],
  exports: [BinanceClientService],
})
export class BinanceModule {}
