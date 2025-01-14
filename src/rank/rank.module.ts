import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [],
  providers: [RankService, PrismaService],
  exports: [RankService],
})
export class RankModule {}
