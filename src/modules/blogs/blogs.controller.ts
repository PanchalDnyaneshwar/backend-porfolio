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
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Public()
  @Get()
  async getPublicBlogs(@Query() query: QueryBlogDto) {
    return this.blogsService.findAll(query, true);
  }

  @Get('admin')
  async getAdminBlogs(@Query() query: QueryBlogDto) {
    return this.blogsService.findAll(query, false);
  }

  @Public()
  @Get('slug/:slug')
  async getBlogBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug, true);
  }

  @Get(':id')
  async getBlogById(@Param('id', MongoIdValidationPipe) id: string) {
    return this.blogsService.findOneById(id);
  }

  @Post()
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Put(':id')
  async updateBlog(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  async deleteBlog(@Param('id', MongoIdValidationPipe) id: string) {
    return this.blogsService.remove(id);
  }
}