import { UserMapper } from '../../system/user/user.mapper';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { ProjectSelectOptionResponseDto } from './dto/project-select-option-response.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { ProjectEntity } from './entities/project.entity';

export class ProjectMapper {
  public static toSelectOptionDto(
    entity: ProjectEntity,
  ): ProjectSelectOptionResponseDto {
    const dto = new ProjectSelectOptionResponseDto();
    dto.id = entity.id;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;
    return dto;
  }

  public static async toDto(
    entity: ProjectEntity,
  ): Promise<ProjectResponseDto> {
    const dto = new ProjectResponseDto();
    dto.id = entity.id;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;
    dto.status = entity.status;
    dto.sprintCount = entity.sprintCount ?? 0;
    dto.createdByUserId = entity.createdByUserId;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;

    if (entity.createdByUser) {
      dto.createdByUser = await UserMapper.toDto(entity.createdByUser);
    }

    return dto;
  }

  public static toCreateEntity(
    dto: CreateProjectRequestDto,
    createdByUserId: string,
  ): ProjectEntity {
    return new ProjectEntity({ ...dto, createdByUserId });
  }

  public static toUpdateEntity(
    entity: ProjectEntity,
    dto: UpdateProjectRequestDto,
  ): ProjectEntity {
    Object.assign(entity, dto);
    return entity;
  }
}
