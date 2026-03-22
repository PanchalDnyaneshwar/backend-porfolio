import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGES } from '../../common/constants/messages.constants';
import { CreateSettingsDto } from './dto/create-settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Settings, SettingsDocument } from './schemas/settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
  ) {}

  async create(createSettingsDto: CreateSettingsDto) {
    const existing = await this.settingsModel.findOne().exec();

    if (existing) {
      const updated = await this.settingsModel
        .findByIdAndUpdate(existing._id, createSettingsDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      return {
        message: MESSAGES.SETTINGS.UPDATED,
        data: updated,
      };
    }

    const settings = await this.settingsModel.create(createSettingsDto);

    return {
      message: MESSAGES.SETTINGS.CREATED,
      data: settings,
    };
  }

  async findPublic() {
    const settings = await this.settingsModel.findOne().lean().exec();

    if (!settings) {
      throw new NotFoundException(MESSAGES.SETTINGS.NOT_FOUND);
    }

    return {
      message: MESSAGES.SETTINGS.FETCHED,
      data: settings,
    };
  }

  async findAdmin() {
    const settings = await this.settingsModel.findOne().lean().exec();

    if (!settings) {
      throw new NotFoundException(MESSAGES.SETTINGS.NOT_FOUND);
    }

    return {
      message: MESSAGES.SETTINGS.FETCHED,
      data: settings,
    };
  }

  async update(updateSettingsDto: UpdateSettingsDto) {
    const settings = await this.settingsModel.findOne().exec();

    if (!settings) {
      throw new NotFoundException(MESSAGES.SETTINGS.NOT_FOUND);
    }

    const updated = await this.settingsModel
      .findByIdAndUpdate(settings._id, updateSettingsDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    return {
      message: MESSAGES.SETTINGS.UPDATED,
      data: updated,
    };
  }
}