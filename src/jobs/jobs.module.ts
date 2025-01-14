import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, PrismaService],
})
export class JobsModule {}
