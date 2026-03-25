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
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { MongoIdValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';
import { QueryEmailLogDto } from './dto/query-email-log.dto';
import { StripMongoFieldsPipe } from '../../common/pipes/strip-mongo-fields.pipe';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() sendMailDto: SendMailDto) {
    return this.mailService.sendMail(sendMailDto);
  }

  @Get('templates')
  async getTemplates() {
    return this.mailService.getTemplates();
  }

  @Post('templates')
  async createTemplate(
    @Body(new StripMongoFieldsPipe()) dto: CreateEmailTemplateDto,
  ) {
    return this.mailService.createTemplate(dto);
  }

  @Put('templates/:id')
  async updateTemplate(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body(new StripMongoFieldsPipe()) dto: UpdateEmailTemplateDto,
  ) {
    return this.mailService.updateTemplate(id, dto);
  }

  @Delete('templates/:id')
  async deleteTemplate(@Param('id', MongoIdValidationPipe) id: string) {
    return this.mailService.deleteTemplate(id);
  }

  @Get('logs')
  async getLogs(@Query() query: QueryEmailLogDto) {
    return this.mailService.getLogs(query);
  }

  @Get('status')
  async getStatus() {
    return this.mailService.getStatus();
  }
}
