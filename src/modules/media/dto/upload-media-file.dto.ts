import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadMediaFileDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  alt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  type?: string;
}
