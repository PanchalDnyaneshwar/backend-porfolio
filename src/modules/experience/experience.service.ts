import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPagination } from '../../common/utils/pagination.util';
import { MESSAGES } from '../../common/constants/messages.constants';
import { Experience, ExperienceDocument } from './schemas/experience.schema';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { QueryExperienceDto } from './dto/query-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<ExperienceDocument>,
  ) {}

  private normalizeStringArray(values?: string[]): string[] {
    if (!values || !Array.isArray(values)) {
      return [];
    }

    return [...new Set(values.map((item) => item.trim()).filter(Boolean))];
  }

  private validateDates(
    startDate?: string | Date,
    endDate?: string | Date,
    currentlyWorking?: boolean,
  ) {
    if (currentlyWorking && endDate) {
      throw new BadRequestException(
        'End date should not be provided when currently working is true',
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        throw new BadRequestException('Start date cannot be after end date');
      }
    }
  }

  async create(createExperienceDto: CreateExperienceDto) {
    this.validateDates(
      createExperienceDto.startDate,
      createExperienceDto.endDate,
      createExperienceDto.currentlyWorking,
    );

    const experience = await this.experienceModel.create({
      ...createExperienceDto,
      technologies: this.normalizeStringArray(createExperienceDto.technologies),
      endDate: createExperienceDto.currentlyWorking
        ? undefined
        : createExperienceDto.endDate,
    });

    return {
      message: MESSAGES.EXPERIENCE.CREATED,
      data: experience,
    };
  }

  async findAll(query: QueryExperienceDto, isPublic = false) {
    const { page = 1, limit = 10, search } = query;
    const { skip } = getPagination(page, limit);

    const filter: Record<string, any> = {};

    if (isPublic) {
      filter.isActive = true;
    }

    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { technologies: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.experienceModel
        .find(filter)
        .sort({ sortOrder: 1, startDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      this.experienceModel.countDocuments(filter),
    ]);

    return {
      message: MESSAGES.EXPERIENCE.FETCHED,
      data: items,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  }

  async findOne(id: string) {
    const experience = await this.experienceModel.findById(id).lean().exec();

    if (!experience) {
      throw new NotFoundException(MESSAGES.EXPERIENCE.NOT_FOUND);
    }

    return {
      message: MESSAGES.EXPERIENCE.FETCHED,
      data: experience,
    };
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto) {
    const existingExperience = await this.experienceModel.findById(id).exec();

    if (!existingExperience) {
      throw new NotFoundException(MESSAGES.EXPERIENCE.NOT_FOUND);
    }

    const nextStartDate =
      updateExperienceDto.startDate || existingExperience.startDate;
    const nextEndDate =
      typeof updateExperienceDto.currentlyWorking === 'boolean'
        ? updateExperienceDto.currentlyWorking
          ? undefined
          : updateExperienceDto.endDate || existingExperience.endDate
        : updateExperienceDto.endDate || existingExperience.endDate;

    const nextCurrentlyWorking =
      typeof updateExperienceDto.currentlyWorking === 'boolean'
        ? updateExperienceDto.currentlyWorking
        : existingExperience.currentlyWorking;

    this.validateDates(nextStartDate, nextEndDate, nextCurrentlyWorking);

    const updatedExperience = await this.experienceModel
      .findByIdAndUpdate(
        id,
        {
          ...updateExperienceDto,
          technologies: updateExperienceDto.technologies
            ? this.normalizeStringArray(updateExperienceDto.technologies)
            : existingExperience.technologies,
          endDate: nextCurrentlyWorking ? undefined : nextEndDate,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    return {
      message: MESSAGES.EXPERIENCE.UPDATED,
      data: updatedExperience,
    };
  }

  async remove(id: string) {
    const experience = await this.experienceModel.findByIdAndDelete(id).exec();

    if (!experience) {
      throw new NotFoundException(MESSAGES.EXPERIENCE.NOT_FOUND);
    }

    return {
      message: MESSAGES.EXPERIENCE.DELETED,
      data: { id },
    };
  }
}