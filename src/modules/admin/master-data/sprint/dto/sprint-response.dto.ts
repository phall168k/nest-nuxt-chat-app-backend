import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/admin/system/user/dto/user-repsonse.dto';
import { SprintStatus } from '../entities/sprint.entity';
import { ProjectResponseDto } from '../../project/dto/project-response.dto';

export class SprintResponseDto {
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

  @ApiPropertyOptional({ enum: SprintStatus, nullable: true })
  status?: SprintStatus | null;

  @ApiProperty({ format: 'uuid' })
  projectId: string;

  @ApiProperty({ type: ProjectResponseDto })
  project: ProjectResponseDto;

  @ApiProperty()
  createdByUserId: string;

  @ApiProperty({ type: UserResponseDto })
  createdByUser: UserResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
