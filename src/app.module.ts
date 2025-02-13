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
import { PrivyModule } from './privy/privy.module';
import privyConfig from './privy/privy.config';
import { CompetitionModule } from './solana/competition/competition.module';
import { OrderModule } from './solana/order/order.module';
import { OracleModule } from './solana/oracle/oracle.module';
import { HealthModule } from './health/health.module';
import { AdminModule } from './solana/admin/admin.module';
import { SettlementModule } from './solana/settlement/settlement.module';
import { BinanceModule } from './binance/binance.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [privyConfig],
    }),
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
    PrivyModule,
    CompetitionModule,
    OrderModule,
    OracleModule,
    HealthModule,
    AdminModule,
    SettlementModule,
    BinanceModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3Service, PrismaService],
})
export class AppModule {}
