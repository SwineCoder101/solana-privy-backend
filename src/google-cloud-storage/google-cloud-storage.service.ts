import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class GoogleCloudStorageService {

  private storage: Storage;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    // For local development, use the key file
    if (process.env.NODE_ENV === 'development') {
      this.storage = new Storage({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'local-dev-key.json'
      });
    } else {
      // For production, use default credentials
      this.storage = new Storage();
    }

    this.bucketName = this.configService.get<string>('PROFILEPHOTOS_BUCKET');
  }

  async uploadFile(
    file: Buffer,
    mimetype: string,
    key: string
  ): Promise<string> {
    try {
      // Explicitly specify the bucket
      const bucket = this.storage.bucket(this.bucketName);

      // More robust error handling
      const [bucketExists] = await bucket.exists();
      if (!bucketExists) {
        throw new Error(`Bucket ${this.bucketName} does not exist`);
      }

      const gcsFile = bucket.file(key);

      await gcsFile.save(file, {
        metadata: {
          contentType: mimetype
        }
      });

      // Construct public URL
      return `https://storage.googleapis.com/${this.bucketName}/${key}`;
    } catch (error) {
      console.error('Detailed upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}
