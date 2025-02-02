// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ReferralModule } from 'src/referral/referral.module';
import { PrismaService } from 'src/prisma.service';
import { JobsModule } from 'src/jobs/jobs.module';
import { S3Module } from 'src/s3/s3.module';
import { RankModule } from 'src/rank/rank.module';
import { GoogleCloudStorageModule } from 'src/google-cloud-storage/google-cloud-storage.module';
import { UserGateway } from './user.gateway';
@Module({
  imports: [
    ReferralModule,
    JobsModule,
    S3Module,
    RankModule,
    GoogleCloudStorageModule,
  ],
  providers: [UserService, PrismaService, UserGateway],
  controllers: [UserController],
})
export class UserModule {}
