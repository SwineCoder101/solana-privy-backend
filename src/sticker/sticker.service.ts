import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class StickerService {
  constructor(private readonly httpService: HttpService) {}
  async fetchFile(botId: string, fileId: string): Promise<string> {
    const filePathUrl = `https://api.telegram.org/bot${botId}/getFile`;
    const filePathResponse = await firstValueFrom(
      this.httpService.post(filePathUrl, { file_id: fileId }),
    );

    const filePath = filePathResponse.data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${botId}/${filePath}`;

    const fileResponse = await firstValueFrom(
      this.httpService.get(fileUrl, { responseType: 'arraybuffer' }),
    );

    const fileBuffer = fileResponse.data;
    const fileString = Buffer.from(fileBuffer).toString('utf-8');

    return fileString;
  }
}
