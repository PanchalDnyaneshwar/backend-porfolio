import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { emptyStringToUndefined } from '../../../common/transformers/empty-string-to-undefined';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  shortDescription: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl({}, { message: 'Thumbnail URL must be valid' })
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl({}, { message: 'Live URL must be valid' })
  liveUrl?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl({}, { message: 'GitHub URL must be valid' })
  githubUrl?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
