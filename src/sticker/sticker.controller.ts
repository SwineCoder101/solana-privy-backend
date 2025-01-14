import { Controller, Get, Query, Inject } from '@nestjs/common';
import { StickerService } from './sticker.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@ApiTags('sticker')
@Controller('sticker')
export class StickerController {
  constructor(
    private readonly stickerService: StickerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('fetch-file')
  @ApiOperation({ summary: 'Fetch file from Telegram' })
  @ApiQuery({ name: 'bot_id', required: true, type: String })
  @ApiQuery({ name: 'file_id', required: true, type: String })
  async fetchFile(
    @Query('bot_id') botId: string,
    @Query('file_id') fileId: string,
  ): Promise<string> {
    const cacheKey = `${botId}_${fileId}`;
    const cachedResponse = await this.cacheManager.get<string>(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    const fileData = await this.stickerService.fetchFile(botId, fileId);
    await this.cacheManager.set(cacheKey, fileData);

    return fileData;
  }
}
