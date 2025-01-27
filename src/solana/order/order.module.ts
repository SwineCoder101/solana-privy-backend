import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { PrivyModule } from '../../privy/privy.module';
import { ProgramModule } from '../program/program.module';

@Module({
  imports: [PrivyModule, ProgramModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {} 