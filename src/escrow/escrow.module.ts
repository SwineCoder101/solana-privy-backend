import { Module } from '@nestjs/common';
import { EscrowService } from './escrow.service';
import { EscrowController } from './escrow.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EscrowController],
  providers: [EscrowService, PrismaService],
})
export class EscrowModule {}
