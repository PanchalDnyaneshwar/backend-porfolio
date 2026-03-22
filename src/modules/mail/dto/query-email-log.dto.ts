import { IsOptional, IsString } from 'class-validator';

export class QueryEmailLogDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
