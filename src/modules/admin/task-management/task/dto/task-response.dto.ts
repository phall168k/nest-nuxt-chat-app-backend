import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SprintResponseDto } from 'src/modules/admin/master-data/sprint/dto/sprint-response.dto';
import { UserResponseDto } from 'src/modules/admin/system/user/dto/user-repsonse.dto';
import { TaskStatus } from '../entities/task.entity';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiProperty({ type: String, format: 'date' })
  startDate: string;

  @ApiProperty({ type: String, format: 'date' })
  endDate: string;

  @ApiPropertyOptional({ enum: TaskStatus, nullable: true })
  status?: TaskStatus | null;

  @ApiProperty({ format: 'uuid' })
  createdByUserId: string;

  @ApiProperty({ type: UserResponseDto })
  createdByUser: UserResponseDto;

  @ApiProperty({ format: 'uuid' })
  assignToUserId: string;

  @ApiProperty({ type: UserResponseDto })
  assignToUser: UserResponseDto;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  reportToUserId?: string | null;

  @ApiPropertyOptional({ type: UserResponseDto, nullable: true })
  reportToUser?: UserResponseDto | null;

  @ApiProperty({ format: 'uuid' })
  sprintId: string;

  @ApiProperty({ type: SprintResponseDto })
  sprint: SprintResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
