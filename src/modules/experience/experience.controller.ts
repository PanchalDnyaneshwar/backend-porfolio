import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { MongoIdValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { QueryExperienceDto } from './dto/query-experience.dto';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Public()
  @Get()
  async getPublicExperience(@Query() query: QueryExperienceDto) {
    return this.experienceService.findAll(query, true);
  }

  @Get('admin')
  async getAdminExperience(@Query() query: QueryExperienceDto) {
    return this.experienceService.findAll(query, false);
  }

  @Get(':id')
  async getExperienceById(@Param('id', MongoIdValidationPipe) id: string) {
    return this.experienceService.findOne(id);
  }

  @Post()
  async createExperience(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.create(createExperienceDto);
  }

  @Put(':id')
  async updateExperience(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experienceService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  async deleteExperience(@Param('id', MongoIdValidationPipe) id: string) {
    return this.experienceService.remove(id);
  }
}
