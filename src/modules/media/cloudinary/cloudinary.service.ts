import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
}
