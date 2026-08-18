import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskRequestDto {
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

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  assignToUserId: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  reportToUserId?: string | null;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  sprintId: string;
}
