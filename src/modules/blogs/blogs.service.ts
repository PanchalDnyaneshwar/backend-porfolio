import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGES } from '../../common/constants/messages.constants';
import { getPagination } from '../../common/utils/pagination.util';
import { sanitizeHtml } from '../../common/utils/sanitize-html.util';
import { generateSlug } from '../../common/utils/slug.util';
import { calculateReadTime } from '../../common/utils/read-time.util';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>,
  ) {}

  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const existing = await this.blogModel.findOne({ slug }).lean().exec();

    if (existing && existing._id.toString() !== excludeId) {
      throw new ConflictException(MESSAGES.BLOG.SLUG_EXISTS);
    }
  }

  private normalizeTags(tags?: string[]) {
    if (!tags || !Array.isArray(tags)) {
      return [];
    }

    return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
  }

  async create(createBlogDto: CreateBlogDto) {
    const slug = generateSlug(createBlogDto.slug || createBlogDto.title);
    await this.ensureUniqueSlug(slug);

    const shouldPublish = createBlogDto.isPublished === true;

    const blog = await this.blogModel.create({
      ...createBlogDto,
      content: sanitizeHtml(createBlogDto.content) || '',
      slug,
      tags: this.normalizeTags(createBlogDto.tags),
      readTime:
        createBlogDto.readTime ||
        calculateReadTime(sanitizeHtml(createBlogDto.content) || ''),
      publishedAt: shouldPublish
        ? createBlogDto.publishedAt
          ? new Date(createBlogDto.publishedAt)
          : new Date()
        : undefined,
    });

    return {
      message: MESSAGES.BLOG.CREATED,
      data: blog,
    };
  }

  async findAll(query: QueryBlogDto, isPublic = false) {
    const { page = 1, limit = 10, category, tag, search, isPublished } = query;

    const { skip } = getPagination(page, limit);
    const filter: Record<string, any> = {};
    if (isPublic) {
      filter.isPublished = true;
    } else if (typeof isPublished !== 'undefined') {
      filter.isPublished = isPublished === 'true';
    }

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const [blogs, total] = await Promise.all([
      this.blogModel
        .find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      this.blogModel.countDocuments(filter),
    ]);

    return {
      message: MESSAGES.BLOG.FETCHED,
      data: blogs,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  }

  async findBySlug(slug: string, isPublic = false) {
    const filter: Record<string, any> = { slug };

    if (isPublic) {
      filter.isPublished = true;
    }

    const blog = await this.blogModel.findOne(filter).lean().exec();

    if (!blog) {
      throw new NotFoundException(MESSAGES.BLOG.NOT_FOUND);
    }

    return {
      message: MESSAGES.BLOG.DETAIL_FETCHED,
      data: blog,
    };
  }

  async findOneById(id: string) {
    const blog = await this.blogModel.findById(id).lean().exec();

    if (!blog) {
      throw new NotFoundException(MESSAGES.BLOG.NOT_FOUND);
    }

    return {
      message: MESSAGES.BLOG.DETAIL_FETCHED,
      data: blog,
    };
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const existingBlog = await this.blogModel.findById(id).exec();

    if (!existingBlog) {
      throw new NotFoundException(MESSAGES.BLOG.NOT_FOUND);
    }

    let nextSlug = existingBlog.slug;

    if (updateBlogDto.slug || updateBlogDto.title) {
      nextSlug = generateSlug(
        updateBlogDto.slug || updateBlogDto.title || existingBlog.title,
      );
      await this.ensureUniqueSlug(nextSlug, id);
    }

    const nextPublishedAt =
      updateBlogDto.isPublished === true && !existingBlog.publishedAt
        ? new Date()
        : updateBlogDto.publishedAt
          ? new Date(updateBlogDto.publishedAt)
          : existingBlog.publishedAt;

    const updatedBlog = await this.blogModel
      .findByIdAndUpdate(
        id,
        {
          ...updateBlogDto,
          content: updateBlogDto.content
            ? sanitizeHtml(updateBlogDto.content)
            : existingBlog.content,
          slug: nextSlug,
          tags: updateBlogDto.tags
            ? this.normalizeTags(updateBlogDto.tags)
            : existingBlog.tags,
          readTime:
            updateBlogDto.readTime ||
            (updateBlogDto.content
              ? calculateReadTime(sanitizeHtml(updateBlogDto.content) || '')
              : existingBlog.readTime),
          publishedAt: nextPublishedAt,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    return {
      message: MESSAGES.BLOG.UPDATED,
      data: updatedBlog,
    };
  }

  async remove(id: string) {
    const blog = await this.blogModel.findByIdAndDelete(id).exec();

    if (!blog) {
      throw new NotFoundException(MESSAGES.BLOG.NOT_FOUND);
    }

    return {
      message: MESSAGES.BLOG.DELETED,
      data: { id },
    };
  }
}
