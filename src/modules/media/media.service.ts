import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGES } from '../../common/constants/messages.constants';
import { getPagination } from '../../common/utils/pagination.util';
import { UploadMediaDto } from './dto/upload-media.dto';
import { UploadMediaFileDto } from './dto/upload-media-file.dto';
import { QueryMediaDto } from './dto/query-media.dto';
import { Media, MediaDocument } from './schemas/media.schema';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name)
    private readonly mediaModel: Model<MediaDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(uploadMediaDto: UploadMediaDto) {
    const media = await this.mediaModel.create(uploadMediaDto);

    return {
      message: MESSAGES.MEDIA.UPLOADED,
      data: media,
    };
  }

  async uploadFile(file: Express.Multer.File, payload: UploadMediaFileDto) {
    if (!file) {
      throw new BadRequestException('A file is required for upload.');
    }

    const upload = await this.cloudinaryService.uploadFile(file);
    const media = await this.mediaModel.create({
      url: upload.secure_url,
      alt: payload.alt?.trim(),
      type: payload.type?.trim() || this.resolveMediaType(file),
      publicId: upload.public_id,
      fileName: file.originalname,
      format: upload.format || this.getExtension(file.originalname),
      bytes: upload.bytes,
      resourceType: upload.resource_type,
    });

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
        { fileName: { $regex: search, $options: 'i' } },
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

    if (media.publicId) {
      await this.cloudinaryService.deleteFile(media.publicId, media.resourceType);
    }

    return {
      message: MESSAGES.MEDIA.DELETED,
      data: { id },
    };
  }

  getStatus() {
    return {
      message: 'Media service status fetched successfully',
      data: this.cloudinaryService.getStatus(),
    };
  }

  private resolveMediaType(file: Express.Multer.File) {
    if (file.mimetype.startsWith('image/')) {
      return 'image';
    }

    if (file.mimetype === 'application/pdf') {
      return 'pdf';
    }

    return 'document';
  }

  private getExtension(fileName: string) {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() : undefined;
  }
}
