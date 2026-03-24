import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGES } from '../../common/constants/messages.constants';
import { getPagination } from '../../common/utils/pagination.util';
import { UploadMediaDto } from './dto/upload-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';
import { Media, MediaDocument } from './schemas/media.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name)
    private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async create(uploadMediaDto: UploadMediaDto) {
    const media = await this.mediaModel.create(uploadMediaDto);

    return {
      message: MESSAGES.MEDIA.UPLOADED,
      data: media,
    };
  }

  async findAll(query: QueryMediaDto) {
    const { page = 1, limit = 10, type, search } = query;
    const { skip } = getPagination(page, limit);

    const filter: Record<string, any> = {};

    if (type) {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { alt: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.mediaModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      this.mediaModel.countDocuments(filter),
    ]);

    return {
      message: MESSAGES.MEDIA.FETCHED,
      data: items,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  }

  async remove(id: string) {
    const media = await this.mediaModel.findByIdAndDelete(id).exec();

    if (!media) {
      throw new NotFoundException(MESSAGES.MEDIA.NOT_FOUND);
    }

    return {
      message: MESSAGES.MEDIA.DELETED,
      data: { id },
    };
  }
}
