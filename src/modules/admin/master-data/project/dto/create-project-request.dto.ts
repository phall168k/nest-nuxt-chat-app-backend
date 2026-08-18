import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameKh: string;

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
