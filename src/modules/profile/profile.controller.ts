import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get()
  async getPublicProfile() {
    return this.profileService.findPublic();
  }

  @Get('admin')
  async getAdminProfile() {
    return this.profileService.findAdmin();
  }

  @Post()
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Put()
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(updateProfileDto);
  }
}
