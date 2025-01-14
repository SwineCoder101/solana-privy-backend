import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [],
  imports: [],
  providers: [ReferralService, PrismaService],
  exports: [ReferralService],
})
export class ReferralModule {}
