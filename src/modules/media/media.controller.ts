import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { MongoIdValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';

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

  @Delete(':id')
  async deleteMedia(@Param('id', MongoIdValidationPipe) id: string) {
    return this.mediaService.remove(id);
  }
}