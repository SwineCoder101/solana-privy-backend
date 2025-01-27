import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { PrivyModule } from '../../privy/privy.module';
import { ProgramModule } from '../program/program.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [PrivyModule, ProgramModule, OrderModule],
  providers: [CompetitionService],
  exports: [CompetitionService],
})
export class CompetitionModule {} 