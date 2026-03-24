import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { MongoIdValidationPipe } from '../../common/pipes/mongo-id-validation.pipe';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { QueryContactMessageDto } from './dto/query-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  async createMessage(
    @Body() createContactMessageDto: CreateContactMessageDto,
  ) {
    return this.contactService.create(createContactMessageDto);
  }

  @Get('admin')
  async getMessages(@Query() query: QueryContactMessageDto) {
    return this.contactService.findAll(query);
  }

  @Get(':id')
  async getMessageById(@Param('id', MongoIdValidationPipe) id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id')
  async updateMessage(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateDto: UpdateContactMessageDto,
  ) {
    return this.contactService.update(id, updateDto);
  }

  @Delete(':id')
  async deleteMessage(@Param('id', MongoIdValidationPipe) id: string) {
    return this.contactService.remove(id);
  }
}
