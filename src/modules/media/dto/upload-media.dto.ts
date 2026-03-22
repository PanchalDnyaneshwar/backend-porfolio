import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class UploadMediaDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Media URL must be valid' })
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  alt?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  publicId?: string;
}