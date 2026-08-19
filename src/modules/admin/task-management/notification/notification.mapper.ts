import { UserMapper } from '../../system/user/user.mapper';
import { TaskMapper } from '../task/task.mapper';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntity } from './entities/notification.entity';

export class NotificationMapper {
  public static async toDto(
    entity: NotificationEntity,
  ): Promise<NotificationResponseDto> {
    const dto = new NotificationResponseDto();
    dto.id = entity.id;
    dto.senderId = entity.senderId;
    dto.receiverId = entity.receiverId;
    dto.taskId = entity.taskId;
    dto.subject = entity.subject;
    dto.isRed = entity.isRed;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;

    if (entity.sender) dto.sender = await UserMapper.toDto(entity.sender);
    if (entity.receiver) dto.receiver = await UserMapper.toDto(entity.receiver);
    if (entity.task) dto.task = await TaskMapper.toDto(entity.task);

    return dto;
  }

  public static toCreateEntity(dto: CreateNotificationDto): NotificationEntity {
    return new NotificationEntity(dto);
  }

  public static toUpdateEntity(
    entity: NotificationEntity,
    dto: UpdateNotificationDto,
  ): NotificationEntity {
    Object.assign(entity, dto);
    return entity;
  }
}
