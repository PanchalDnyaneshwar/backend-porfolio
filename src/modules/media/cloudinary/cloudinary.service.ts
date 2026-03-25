import {
  Injectable,
  Logger,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {}

  getConfig() {
    return {
      cloudName: this.normalizeCloudName(
        this.configService.get<string>('cloudinary.cloudName'),
      ),
      apiKey: this.configService.get<string>('cloudinary.apiKey')?.trim() || '',
      apiSecret: this.configService.get<string>('cloudinary.apiSecret')?.trim() || '',
      folder: this.normalizeFolder(this.configService.get<string>('cloudinary.folder')),
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
        'Cloudinary is not configured. Please set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      );
    }

    if (!this.isValidCloudName(config.cloudName)) {
      throw new ServiceUnavailableException(
        `Invalid Cloudinary cloud name "${config.cloudName}". Please use the exact cloud name from your Cloudinary dashboard or set CLOUDINARY_URL.`,
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
    const folder = this.normalizeFolder(options?.folder || config.folder);

    try {
      await this.ensureFolderExists(folder);

      return await cloudinary.uploader.upload(dataUri, {
        folder,
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
      configured: this.isConfigured() && this.isValidCloudName(config.cloudName),
      cloudName: config.cloudName || null,
      folder: config.folder || 'portfolio',
      supportsDocuments: true,
      supportsImages: true,
    };
  }

  private normalizeCloudName(value?: string) {
    const normalized = value?.trim() || '';

    if (!normalized) {
      return '';
    }

    if (normalized.includes('cloudinary://')) {
      try {
        const url = new URL(normalized);
        return url.hostname.trim();
      } catch {
        return normalized;
      }
    }

    return normalized
      .replace(/^https?:\/\//, '')
      .replace(/\.cloudinary\.com.*$/i, '')
      .replace(/^res\./i, '')
      .trim();
  }

  private normalizeFolder(value?: string) {
    return (value?.trim() || 'portfolio')
      .replace(/^\/+|\/+$/g, '')
      .replace(/\/{2,}/g, '/');
  }

  private isValidCloudName(value?: string) {
    if (!value) {
      return false;
    }

    return /^[a-z0-9-]+$/i.test(value);
  }

  private async ensureFolderExists(folder: string) {
    if (!folder || folder.includes('/')) {
      return;
    }

    try {
      await cloudinary.api.create_folder(folder);
    } catch (error) {
      const message = (error as { message?: string; error?: { message?: string } })?.error
        ?.message || (error as { message?: string })?.message || '';

      if (/already exists/i.test(message)) {
        return;
      }

      this.logger.warn(`Cloudinary folder check failed for "${folder}": ${message}`);
    }
  }
}
