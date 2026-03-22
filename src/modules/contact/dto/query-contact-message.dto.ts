import { IsBooleanString, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryContactMessageDto extends PaginationDto {
  @IsOptional()
  @IsBooleanString()
  isRead?: string;

  @IsOptional()
  @IsString()
  search?: string;
}