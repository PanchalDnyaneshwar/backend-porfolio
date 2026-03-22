import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MESSAGES } from '../../common/constants/messages.constants';
import { getPagination } from '../../common/utils/pagination.util';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { QueryNewsletterDto } from './dto/query-newsletter.dto';
import { Newsletter, NewsletterDocument } from './schemas/newsletter.schema';
import { Model } from 'mongoose';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(Newsletter.name)
    private readonly newsletterModel: Model<NewsletterDocument>,
  ) {}

  async subscribe(subscribeDto: SubscribeNewsletterDto) {
    const email = subscribeDto.email.toLowerCase().trim();

    const existing = await this.newsletterModel.findOne({ email }).lean().exec();

    if (existing) {
      throw new ConflictException(MESSAGES.NEWSLETTER.ALREADY_EXISTS);
    }

    const subscriber = await this.newsletterModel.create({ email });

    return {
      message: MESSAGES.NEWSLETTER.SUBSCRIBED,
      data: subscriber,
    };
  }

  async findAll(query: QueryNewsletterDto) {
    const { page = 1, limit = 10, search } = query;
    const { skip } = getPagination(page, limit);

    const filter: Record<string, any> = {};

    if (search) {
      filter.email = { $regex: search, $options: 'i' };
    }

    const [subscribers, total] = await Promise.all([
      this.newsletterModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      this.newsletterModel.countDocuments(filter),
    ]);

    return {
      message: MESSAGES.NEWSLETTER.FETCHED,
      data: subscribers,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  }
}