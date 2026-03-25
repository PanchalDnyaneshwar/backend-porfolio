import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MongoIdValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';
import { UploadMediaFileDto } from './dto/upload-media-file.dto';
import { multerFileFilter, multerLimits } from './multer/multer.config';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  async createMedia(@Body() uploadMediaDto: UploadMediaDto) {
    return this.mediaService.create(uploadMediaDto);
  }

  @Get('admin')
  async getMedia(@Query() query: QueryMediaDto) {
    return this.mediaService.findAll(query);
  }

  @Get('status')
  async getStatus() {
    return this.mediaService.getStatus();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: multerLimits,
      fileFilter: multerFileFilter,
    }),
  )
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UploadMediaFileDto,
  ) {
    return this.mediaService.uploadFile(file, payload);
  }

  @Delete(':id')
  async deleteMedia(@Param('id', MongoIdValidationPipe) id: string) {
    return this.mediaService.remove(id);
  }
}
