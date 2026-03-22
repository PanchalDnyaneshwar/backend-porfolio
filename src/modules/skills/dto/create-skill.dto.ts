import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export enum SkillCategory {
  LANGUAGES = 'LANGUAGES',
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASES = 'DATABASES',
  TOOLS = 'TOOLS',
  DEVOPS = 'DEVOPS',
  OTHER = 'OTHER',
}

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @IsEnum(SkillCategory)
  category: SkillCategory;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  level?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}