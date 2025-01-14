import { Module } from '@nestjs/common';
import { StickerService } from './sticker.service';
import { StickerController } from './sticker.controller';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [StickerController],
  providers: [StickerService],
})
export class StickerModule {}
