import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGES } from '../../common/constants/messages.constants';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const existing = await this.profileModel.findOne().exec();

    if (existing) {
      const updated = await this.profileModel
        .findByIdAndUpdate(existing._id, createProfileDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      return {
        message: MESSAGES.PROFILE.UPDATED,
        data: updated,
      };
    }

    const profile = await this.profileModel.create(createProfileDto);

    return {
      message: MESSAGES.PROFILE.CREATED,
      data: profile,
    };
  }

  async findPublic() {
    const profile = await this.profileModel.findOne().lean().exec();

    if (!profile) {
      throw new NotFoundException(MESSAGES.PROFILE.NOT_FOUND);
    }

    return {
      message: MESSAGES.PROFILE.FETCHED,
      data: profile,
    };
  }

  async findAdmin() {
    const profile = await this.profileModel.findOne().lean().exec();

    if (!profile) {
      throw new NotFoundException(MESSAGES.PROFILE.NOT_FOUND);
    }

    return {
      message: MESSAGES.PROFILE.FETCHED,
      data: profile,
    };
  }

  async update(updateProfileDto: UpdateProfileDto) {
    const profile = await this.profileModel.findOne().exec();

    if (!profile) {
      throw new NotFoundException(MESSAGES.PROFILE.NOT_FOUND);
    }

    const updated = await this.profileModel
      .findByIdAndUpdate(profile._id, updateProfileDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    return {
      message: MESSAGES.PROFILE.UPDATED,
      data: updated,
    };
  }
}
