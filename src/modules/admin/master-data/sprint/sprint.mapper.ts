import { UserMapper } from '../../system/user/user.mapper';
import { ProjectMapper } from '../project/project.mapper';
import { CreateSprintRequestDto } from './dto/create-sprint-request.dto';
import { SprintResponseDto } from './dto/sprint-response.dto';
import { UpdateSprintRequestDto } from './dto/update-sprint-request.dto';
import { SprintEntity } from './entities/sprint.entity';

export class SprintMapper {
  public static async toDto(entity: SprintEntity): Promise<SprintResponseDto> {
    const dto = new SprintResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.startDate = entity.startDate;
    dto.endDate = entity.endDate;
    dto.status = entity.status;
    dto.projectId = entity.projectId;
    dto.createdByUserId = entity.createdByUserId;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;

    if (entity.createdByUser) {
      dto.createdByUser = await UserMapper.toDto(entity.createdByUser);
    }

    if (entity.project) {
      dto.project = await ProjectMapper.toDto(entity.project);
    }

    return dto;
  }

  public static toCreateEntity(
    dto: CreateSprintRequestDto,
    createdByUserId: string,
  ): SprintEntity {
    return new SprintEntity({ ...dto, createdByUserId });
  }

  public static toUpdateEntity(
    entity: SprintEntity,
    dto: UpdateSprintRequestDto,
  ): SprintEntity {
    Object.assign(entity, dto);
    return entity;
  }
}
