import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinksDto {
  @IsOptional()
  @IsUrl({}, { message: 'GitHub URL must be valid' })
  github?: string;

  @IsOptional()
  @IsUrl({}, { message: 'LinkedIn URL must be valid' })
  linkedin?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Twitter URL must be valid' })
  twitter?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Portfolio URL must be valid' })
  portfolio?: string;
}

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  shortBio?: string;

  @IsOptional()
  @IsString()
  longBio?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Profile image URL must be valid' })
  profileImage?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Resume URL must be valid' })
  resumeUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;
}