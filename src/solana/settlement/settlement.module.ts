import { Module } from '@nestjs/common';
import { SettlementController } from './settlement.controller';
import { SettlementService } from './settlement.service';
import { ProgramModule } from '../program/program.module';
import { AdminModule } from '../admin/admin.module';
import { BinanceClientService } from 'src/binance/binance-client.service';
import { BinanceModule } from 'src/binance/binance.module';
import { SchedulerRegistry } from '@nestjs/schedule';

@Module({
  imports: [ProgramModule, AdminModule, BinanceModule],
  controllers: [SettlementController],
  providers: [SettlementService, BinanceClientService, SchedulerRegistry],
  exports: [SettlementService],
})
export class SettlementModule {}
