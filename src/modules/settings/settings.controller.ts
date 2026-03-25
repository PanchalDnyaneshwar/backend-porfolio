import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { SettingsService } from './settings.service';
import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { StripMongoFieldsPipe } from '../../common/pipes/strip-mongo-fields.pipe';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  async getPublicSettings() {
    return this.settingsService.findPublic();
  }

  @Get('admin')
  async getAdminSettings() {
    return this.settingsService.findAdmin();
  }

  @Post()
  async createSettings(
    @Body(new StripMongoFieldsPipe()) createSettingsDto: CreateSettingsDto,
  ) {
    return this.settingsService.create(createSettingsDto);
  }

  @Put()
  async updateSettings(
    @Body(new StripMongoFieldsPipe()) updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.settingsService.update(updateSettingsDto);
  }
}
