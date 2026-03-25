import {
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { emptyStringToUndefined } from '../../../common/transformers/empty-string-to-undefined';

class SeoDto {
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaKeywords?: string;
}

class ContactInfoDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl({}, { message: 'Map URL must be valid' })
  mapUrl?: string;
}

export class CreateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  siteTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  siteDescription?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl({}, { message: 'Logo URL must be valid' })
  logo?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl({}, { message: 'Favicon URL must be valid' })
  favicon?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SeoDto)
  seo?: SeoDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo?: ContactInfoDto;
}
