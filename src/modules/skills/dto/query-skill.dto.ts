import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { SkillCategory } from './create-skill.dto';

export class QuerySkillDto extends PaginationDto {
  @IsOptional()
  @IsEnum(SkillCategory)
  category?: SkillCategory;

  @IsOptional()
  @IsString()
  search?: string;
}
