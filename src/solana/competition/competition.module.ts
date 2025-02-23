import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';
import { ProgramModule } from '../program/program.module';
import { AdminModule } from '../admin/admin.module';
import { SettlementModule } from '../settlement/settlement.module';

@Module({
  imports: [ProgramModule, AdminModule, SettlementModule],
  providers: [CompetitionService],
  controllers: [CompetitionController],
  exports: [CompetitionService],
})
export class CompetitionModule {}
