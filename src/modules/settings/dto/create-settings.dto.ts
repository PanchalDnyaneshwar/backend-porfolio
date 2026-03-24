import {
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsUrl({}, { message: 'Logo URL must be valid' })
  logo?: string;

  @IsOptional()
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
