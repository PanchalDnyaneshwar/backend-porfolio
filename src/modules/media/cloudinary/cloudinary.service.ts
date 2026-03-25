import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}

  getConfig() {
    return {
      cloudName: this.configService.get<string>('cloudinary.cloudName'),
      apiKey: this.configService.get<string>('cloudinary.apiKey'),
      apiSecret: this.configService.get<string>('cloudinary.apiSecret'),
      folder: this.configService.get<string>('cloudinary.folder'),
    };
  }

  isConfigured() {
    const { cloudName, apiKey, apiSecret } = this.getConfig();
    return Boolean(cloudName && apiKey && apiSecret);
  }

  private configureClient() {
    const config = this.getConfig();

    if (!config.cloudName || !config.apiKey || !config.apiSecret) {
      throw new ServiceUnavailableException(
        'Cloudinary is not configured. Please set CLOUDINARY_* env values.',
      );
    }

    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });

    return config;
  }

  async uploadFile(file: Express.Multer.File, options?: { folder?: string }) {
    const config = this.configureClient();
    const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    try {
      return await cloudinary.uploader.upload(dataUri, {
        folder: options?.folder || config.folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        filename_override: file.originalname.replace(/\.[^.]+$/, ''),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        (error as Error)?.message || 'Failed to upload file to Cloudinary.',
      );
    }
  }

  async deleteFile(publicId: string, resourceType?: string) {
    this.configureClient();

    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType === 'raw' ? 'raw' : 'image',
      });
    } catch (error) {
      throw new InternalServerErrorException(
        (error as Error)?.message || 'Failed to delete file from Cloudinary.',
      );
    }
  }

  getStatus() {
    const config = this.getConfig();

    return {
      configured: this.isConfigured(),
      folder: config.folder || 'portfolio',
      supportsDocuments: true,
      supportsImages: true,
    };
  }
}
