import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { StickerModule } from './sticker/sticker.module';
import { SearchModule } from './search/search.module';
import { ReferralModule } from './referral/referral.module';
import { PrismaService } from './prisma.service';
import { JobsModule } from './jobs/jobs.module';
import { S3Module } from './s3/s3.module';
import { S3Service } from './s3/s3.service';
import { RankModule } from './rank/rank.module';
import { GoogleCloudStorageModule } from './google-cloud-storage/google-cloud-storage.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    StickerModule,
    CacheModule.register({
      ttl: 600, // Cache for 10 minutes
      max: 100, // Store up to 100 items
      isGlobal: true,
    }),
    SearchModule,
    ReferralModule,
    JobsModule,
    S3Module,
    RankModule,
    GoogleCloudStorageModule,
    AuthModule,
    JwtModule.register({
      secret: 'your-secret-key', // Replace with your actual secret key
  }),

  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, S3Service],
})
export class AppModule {}
