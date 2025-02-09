import { Module } from '@nestjs/common';
import { SettlementController } from './settlement.controller';
import { SettlementService } from './settlement.service';
import { ProgramModule } from '../program/program.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [ProgramModule, AdminModule],
  controllers: [SettlementController],
  providers: [SettlementService],
  exports: [SettlementService],
})
export class SettlementModule {}
