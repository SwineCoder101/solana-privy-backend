import { Module } from '@nestjs/common';
import { GoogleCloudStorageService } from './google-cloud-storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [GoogleCloudStorageService],
  exports: [GoogleCloudStorageService],
})
export class GoogleCloudStorageModule {}
