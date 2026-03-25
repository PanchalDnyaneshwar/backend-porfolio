import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { emptyStringToUndefined } from '../../../common/transformers/empty-string-to-undefined';

class SocialLinksDto {
  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl({}, { message: 'GitHub URL must be valid' })
  github?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl({}, { message: 'LinkedIn URL must be valid' })
  linkedin?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl({}, { message: 'Twitter URL must be valid' })
  twitter?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
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
  @Transform(emptyStringToUndefined)
  @IsUrl({}, { message: 'Profile image URL must be valid' })
  profileImage?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl({}, { message: 'Resume URL must be valid' })
  resumeUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;
}
