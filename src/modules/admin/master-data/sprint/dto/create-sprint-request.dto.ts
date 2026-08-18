import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { SprintStatus } from '../entities/sprint.entity';

export class CreateSprintRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: String, format: 'date', example: '2026-08-18' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: String, format: 'date', example: '2026-08-31' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ enum: SprintStatus })
  @IsOptional()
  @IsEnum(SprintStatus)
  status?: SprintStatus;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  projectId: string;
}
