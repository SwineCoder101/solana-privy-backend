import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(
    file: Buffer,
    mimetype: string,
    key: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key: key,
      Body: file,
      ContentType: mimetype,
      // Remove ACL
    });

    await this.s3Client.send(command);

    // Construct the URL manually
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    const region = this.configService.get<string>('AWS_REGION');
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  }
}
