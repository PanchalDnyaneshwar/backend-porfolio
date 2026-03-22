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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { QuerySkillDto } from './dto/query-skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Public()
  @Get()
  async getPublicSkills(@Query() query: QuerySkillDto) {
    return this.skillsService.findAll(query, true);
  }

  @Get('admin')
  async getAdminSkills(@Query() query: QuerySkillDto) {
    return this.skillsService.findAll(query, false);
  }

  @Get(':id')
  async getSkillById(@Param('id', MongoIdValidationPipe) id: string) {
    return this.skillsService.findOne(id);
  }

  @Post()
  async createSkill(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Put(':id')
  async updateSkill(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  async deleteSkill(@Param('id', MongoIdValidationPipe) id: string) {
    return this.skillsService.remove(id);
  }
}