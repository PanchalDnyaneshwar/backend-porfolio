import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SendMailDto } from './dto/send-mail.dto';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { QueryEmailLogDto } from './dto/query-email-log.dto';
import {
  EmailTemplate,
  EmailTemplateDocument,
} from './schemas/email-template.schema';
import { EmailLog, EmailLogDocument } from './schemas/email-log.schema';
import { getPagination } from '../../common/utils/pagination.util';
import { MESSAGES } from '../../common/constants/messages.constants';
import { sanitizeHtml } from '../../common/utils/sanitize-html.util';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(EmailTemplate.name)
    private readonly templateModel: Model<EmailTemplateDocument>,
    @InjectModel(EmailLog.name)
    private readonly logModel: Model<EmailLogDocument>,
  ) {
    this.transporter = this.createTransporter();
  }

  private createTransporter() {
    const host = this.configService.get<string>('smtpHost')?.trim();
    const port = Number(this.configService.get<number>('smtpPort') || 587);
    const user = this.configService.get<string>('smtpUser')?.trim();
    const pass = this.configService.get<string>('smtpPass')?.trim();
    const secure = this.configService.get<boolean>('smtpSecure') || false;

    if (!host || !user || !pass) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  private ensureTransporter() {
    if (!this.transporter) {
      this.transporter = this.createTransporter();
    }

    if (!this.transporter) {
      throw new ServiceUnavailableException(
        'SMTP is not configured. Please set SMTP_* env values.',
      );
    }

    return this.transporter;
  }

  async sendMail(payload: SendMailDto) {
    const transporter = this.ensureTransporter();
    const from =
      this.configService.get<string>('smtpFrom') ||
      this.configService.get<string>('smtpUser');
    const sanitizedHtml = sanitizeHtml(payload.html);

    if (!from) {
      throw new ServiceUnavailableException(
        'SMTP_FROM or SMTP_USER must be configured.',
      );
    }

    try {
      await transporter.sendMail({
        from,
        to: payload.to,
        subject: payload.subject,
        text: payload.message,
        html: sanitizedHtml,
        replyTo: payload.replyTo,
      });
      await this.logModel.create({
        to: payload.to,
        subject: payload.subject,
        message: payload.message,
        html: sanitizedHtml,
        status: 'SENT',
      });
    } catch (error) {
      this.logger.error('SMTP send failed', error as Error);
      await this.logModel.create({
        to: payload.to,
        subject: payload.subject,
        message: payload.message,
        html: sanitizedHtml,
        status: 'FAILED',
        error: (error as Error)?.message ?? 'Unknown error',
      });
      throw new ServiceUnavailableException(
        'Failed to send email. Please verify SMTP settings.',
      );
    }

    return {
      message: MESSAGES.MAIL.SENT,
      data: { to: payload.to },
    };
  }

  async sendContactNotification(payload: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const from =
      this.configService.get<string>('smtpFrom') ||
      this.configService.get<string>('smtpUser');
    const to = this.configService.get<string>('smtpNotifyTo') || from;

    if (!from || !to) {
      return;
    }

    try {
      const transporter = this.ensureTransporter();
      await transporter.sendMail({
        from,
        to,
        subject: `New contact message: ${payload.subject}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
        replyTo: payload.email,
      });
    } catch (error) {
      this.logger.warn('Failed to send contact notification');
    }
  }

  async createTemplate(dto: CreateEmailTemplateDto) {
    const template = await this.templateModel.create({
      ...dto,
      html: sanitizeHtml(dto.html) || '',
    });
    return {
      message: MESSAGES.MAIL.TEMPLATE_CREATED,
      data: template,
    };
  }

  async getTemplates() {
    const templates = await this.templateModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return {
      message: MESSAGES.MAIL.TEMPLATE_FETCHED,
      data: templates,
    };
  }

  async updateTemplate(id: string, dto: UpdateEmailTemplateDto) {
    const template = await this.templateModel
      .findByIdAndUpdate(
        id,
        {
          ...dto,
          html: dto.html ? sanitizeHtml(dto.html) : dto.html,
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!template) {
      throw new NotFoundException(MESSAGES.MAIL.TEMPLATE_NOT_FOUND);
    }

    return {
      message: MESSAGES.MAIL.TEMPLATE_UPDATED,
      data: template,
    };
  }

  async deleteTemplate(id: string) {
    const template = await this.templateModel.findByIdAndDelete(id).exec();
    if (!template) {
      throw new NotFoundException(MESSAGES.MAIL.TEMPLATE_NOT_FOUND);
    }

    return {
      message: MESSAGES.MAIL.TEMPLATE_DELETED,
      data: { id },
    };
  }

  async getLogs(query: QueryEmailLogDto) {
    const { page = '1', limit = '10' } = query;
    const { skip } = getPagination(Number(page), Number(limit));

    const [logs, total] = await Promise.all([
      this.logModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      this.logModel.countDocuments(),
    ]);

    return {
      message: MESSAGES.MAIL.LOG_FETCHED,
      data: logs,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  }
}
