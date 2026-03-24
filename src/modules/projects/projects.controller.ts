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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get()
  async getPublicProjects(@Query() query: QueryProjectDto) {
    return this.projectsService.findAll(query, true);
  }

  @Get('admin')
  async getAdminProjects(@Query() query: QueryProjectDto) {
    return this.projectsService.findAll(query, false);
  }

  @Public()
  @Get('slug/:slug')
  async getProjectBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug, true);
  }

  @Get(':id')
  async getProjectById(@Param('id', MongoIdValidationPipe) id: string) {
    return this.projectsService.findOneById(id);
  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Put(':id')
  async updateProject(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  async deleteProject(@Param('id', MongoIdValidationPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
