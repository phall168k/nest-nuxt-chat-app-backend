import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../entities/project.entity';
import { UserResponseDto } from 'src/modules/admin/system/user/dto/user-repsonse.dto';

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameKh: string;

  @ApiPropertyOptional({ enum: ProjectStatus, nullable: true })
  status?: ProjectStatus | null;

  @ApiProperty()
  createdByUserId: string;

  @ApiProperty()
  createdByUser: UserResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
