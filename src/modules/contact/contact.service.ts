import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGES } from '../../common/constants/messages.constants';
import { getPagination } from '../../common/utils/pagination.util';
import {
  ContactMessage,
  ContactMessageDocument,
} from './schemas/contact-message.schema';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { QueryContactMessageDto } from './dto/query-contact-message.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactMessage.name)
    private readonly contactMessageModel: Model<ContactMessageDocument>,
    private readonly mailService: MailService,
  ) {}

  async create(createContactMessageDto: CreateContactMessageDto) {
    const message = await this.contactMessageModel.create(
      createContactMessageDto,
    );
    await this.mailService.sendContactNotification({
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
    });

    return {
      message: MESSAGES.CONTACT.CREATED,
      data: message,
    };
  }

  async findAll(query: QueryContactMessageDto) {
    const { page = 1, limit = 10, isRead, search } = query;
    const { skip } = getPagination(page, limit);

    const filter: Record<string, any> = {};

    if (typeof isRead !== 'undefined') {
      filter.isRead = isRead === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [messages, total] = await Promise.all([
      this.contactMessageModel
        .find(filter)
        .sort({ isRead: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      this.contactMessageModel.countDocuments(filter),
    ]);

    return {
      message: MESSAGES.CONTACT.FETCHED,
      data: messages,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  }

  async findOne(id: string) {
    const message = await this.contactMessageModel.findById(id).lean().exec();

    if (!message) {
      throw new NotFoundException(MESSAGES.CONTACT.NOT_FOUND);
    }

    return {
      message: MESSAGES.CONTACT.FETCHED,
      data: message,
    };
  }

  async update(id: string, updateDto: UpdateContactMessageDto) {
    const message = await this.contactMessageModel
      .findByIdAndUpdate(id, updateDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!message) {
      throw new NotFoundException(MESSAGES.CONTACT.NOT_FOUND);
    }

    return {
      message: MESSAGES.CONTACT.UPDATED,
      data: message,
    };
  }

  async remove(id: string) {
    const message = await this.contactMessageModel.findByIdAndDelete(id).exec();

    if (!message) {
      throw new NotFoundException(MESSAGES.CONTACT.NOT_FOUND);
    }

    return {
      message: MESSAGES.CONTACT.DELETED,
      data: { id },
    };
  }
}
