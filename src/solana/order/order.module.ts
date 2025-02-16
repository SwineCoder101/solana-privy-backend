import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrivyModule } from '../../privy/privy.module';
import { ProgramModule } from '../program/program.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [PrivyModule, ProgramModule, AdminModule],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
