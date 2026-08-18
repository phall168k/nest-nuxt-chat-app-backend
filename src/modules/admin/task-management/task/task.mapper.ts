import { SprintMapper } from '../../master-data/sprint/sprint.mapper';
import { UserMapper } from '../../system/user/user.mapper';
import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskRequestDto } from './dto/update-task-request.dto';
import { TaskEntity } from './entities/task.entity';

export class TaskMapper {
  public static async toDto(entity: TaskEntity): Promise<TaskResponseDto> {
    const dto = new TaskResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.startDate = entity.startDate;
    dto.endDate = entity.endDate;
    dto.status = entity.status;
    dto.createdByUserId = entity.createdByUserId;
    dto.assignToUserId = entity.assignToUserId;
    dto.reportToUserId = entity.reportToUserId;
    dto.sprintId = entity.sprintId;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;

    if (entity.createdByUser) {
      dto.createdByUser = await UserMapper.toDto(entity.createdByUser);
    }
    if (entity.assignToUser) {
      dto.assignToUser = await UserMapper.toDto(entity.assignToUser);
    }
    if (entity.reportToUser) {
      dto.reportToUser = await UserMapper.toDto(entity.reportToUser);
    }
    if (entity.sprint) {
      dto.sprint = await SprintMapper.toDto(entity.sprint);
    }

    return dto;
  }

  public static toCreateEntity(
    dto: CreateTaskRequestDto,
    createdByUserId: string,
  ): TaskEntity {
    return new TaskEntity({ ...dto, createdByUserId });
  }

  public static toUpdateEntity(
    entity: TaskEntity,
    dto: UpdateTaskRequestDto,
  ): TaskEntity {
    Object.assign(entity, dto);
    return entity;
  }
}
