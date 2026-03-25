import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './schemas/media.schema';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
    CloudinaryModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
