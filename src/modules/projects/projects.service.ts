import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGES } from '../../common/constants/messages.constants';
import { getPagination } from '../../common/utils/pagination.util';
import { generateSlug } from '../../common/utils/slug.util';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const existing = await this.projectModel.findOne({ slug }).lean().exec();

    if (existing && existing._id.toString() !== excludeId) {
      throw new ConflictException(MESSAGES.PROJECT.SLUG_EXISTS);
    }
  }

  private normalizeStringArray(values?: string[]): string[] {
    if (!values || !Array.isArray(values)) {
      return [];
    }

    return [...new Set(values.map((item) => item.trim()).filter(Boolean))];
  }

  async create(createProjectDto: CreateProjectDto) {
    const slug = generateSlug(createProjectDto.slug || createProjectDto.title);
    await this.ensureUniqueSlug(slug);

    const project = await this.projectModel.create({
      ...createProjectDto,
      slug,
      images: this.normalizeStringArray(createProjectDto.images),
      techStack: this.normalizeStringArray(createProjectDto.techStack),
    });

    return {
      message: MESSAGES.PROJECT.CREATED,
      data: project,
    };
  }

  async findAll(query: QueryProjectDto, isPublic = false) {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      featured,
      isPublished,
    } = query;

    const { skip } = getPagination(page, limit);
    const filter: Record<string, any> = {};

    if (isPublic) {
      filter.isPublished = true;
    } else if (typeof isPublished !== 'undefined') {
      filter.isPublished = isPublished === 'true';
    }

    if (typeof featured !== 'undefined') {
      filter.featured = featured === 'true';
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { fullDescription: { $regex: search, $options: 'i' } },
        { techStack: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    const [projects, total] = await Promise.all([
      this.projectModel
        .find(filter)
        .sort({ featured: -1, sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      this.projectModel.countDocuments(filter),
    ]);

    return {
      message: MESSAGES.PROJECT.FETCHED,
      data: projects,
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

    const project = await this.projectModel.findOne(filter).lean().exec();

    if (!project) {
      throw new NotFoundException(MESSAGES.PROJECT.NOT_FOUND);
    }

    return {
      message: MESSAGES.PROJECT.DETAIL_FETCHED,
      data: project,
    };
  }

  async findOneById(id: string) {
    const project = await this.projectModel.findById(id).lean().exec();

    if (!project) {
      throw new NotFoundException(MESSAGES.PROJECT.NOT_FOUND);
    }

    return {
      message: MESSAGES.PROJECT.DETAIL_FETCHED,
      data: project,
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const existingProject = await this.projectModel.findById(id).exec();

    if (!existingProject) {
      throw new NotFoundException(MESSAGES.PROJECT.NOT_FOUND);
    }

    let nextSlug = existingProject.slug;

    if (updateProjectDto.slug || updateProjectDto.title) {
      nextSlug = generateSlug(
        updateProjectDto.slug || updateProjectDto.title || existingProject.title,
      );
      await this.ensureUniqueSlug(nextSlug, id);
    }

    const updatedProject = await this.projectModel
      .findByIdAndUpdate(
        id,
        {
          ...updateProjectDto,
          slug: nextSlug,
          images: updateProjectDto.images
            ? this.normalizeStringArray(updateProjectDto.images)
            : existingProject.images,
          techStack: updateProjectDto.techStack
            ? this.normalizeStringArray(updateProjectDto.techStack)
            : existingProject.techStack,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    return {
      message: MESSAGES.PROJECT.UPDATED,
      data: updatedProject,
    };
  }

  async remove(id: string) {
    const project = await this.projectModel.findByIdAndDelete(id).exec();

    if (!project) {
      throw new NotFoundException(MESSAGES.PROJECT.NOT_FOUND);
    }

    return {
      message: MESSAGES.PROJECT.DELETED,
      data: { id },
    };
  }
}