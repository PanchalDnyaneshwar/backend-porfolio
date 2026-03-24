import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPagination } from '../../common/utils/pagination.util';
import { MESSAGES } from '../../common/constants/messages.constants';
import { Skill, SkillDocument } from './schemas/skill.schema';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { QuerySkillDto } from './dto/query-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skill.name)
    private readonly skillModel: Model<SkillDocument>,
  ) {}

  private normalizeValue(value?: string): string | undefined {
    if (!value) return undefined;
    const normalized = value.trim();
    return normalized || undefined;
  }

  async create(createSkillDto: CreateSkillDto) {
    const skill = await this.skillModel.create({
      ...createSkillDto,
      name: createSkillDto.name.trim(),
      level: this.normalizeValue(createSkillDto.level),
      icon: this.normalizeValue(createSkillDto.icon),
    });

    return {
      message: MESSAGES.SKILL.CREATED,
      data: skill,
    };
  }

  async findAll(query: QuerySkillDto, isPublic = false) {
    const { page = 1, limit = 10, category, search } = query;
    const { skip } = getPagination(page, limit);

    const filter: Record<string, any> = {};

    if (isPublic) {
      filter.isActive = true;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { level: { $regex: search, $options: 'i' } },
      ];
    }

    const [skills, total] = await Promise.all([
      this.skillModel
        .find(filter)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      this.skillModel.countDocuments(filter),
    ]);

    return {
      message: MESSAGES.SKILL.FETCHED,
      data: skills,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  }

  async findOne(id: string) {
    const skill = await this.skillModel.findById(id).lean().exec();

    if (!skill) {
      throw new NotFoundException(MESSAGES.SKILL.NOT_FOUND);
    }

    return {
      message: MESSAGES.SKILL.FETCHED,
      data: skill,
    };
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    const existingSkill = await this.skillModel.findById(id).exec();

    if (!existingSkill) {
      throw new NotFoundException(MESSAGES.SKILL.NOT_FOUND);
    }

    const skill = await this.skillModel
      .findByIdAndUpdate(
        id,
        {
          ...updateSkillDto,
          ...(updateSkillDto.name ? { name: updateSkillDto.name.trim() } : {}),
          ...(typeof updateSkillDto.level !== 'undefined'
            ? { level: this.normalizeValue(updateSkillDto.level) }
            : {}),
          ...(typeof updateSkillDto.icon !== 'undefined'
            ? { icon: this.normalizeValue(updateSkillDto.icon) }
            : {}),
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    return {
      message: MESSAGES.SKILL.UPDATED,
      data: skill,
    };
  }

  async remove(id: string) {
    const skill = await this.skillModel.findByIdAndDelete(id).exec();

    if (!skill) {
      throw new NotFoundException(MESSAGES.SKILL.NOT_FOUND);
    }

    return {
      message: MESSAGES.SKILL.DELETED,
      data: { id },
    };
  }
}
