import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, type PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { PaginatedResponse } from 'src/common/paginations/paginated-response.type';
import { BasePaginationCrudService } from 'src/common/services/base-pagination-crud.service';
import { handleError } from 'src/common/utils/handle-error.util';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationMapper } from './notification.mapper';

@Injectable()
export class NotificationService extends BasePaginationCrudService<
  NotificationEntity,
  NotificationResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'subject',
    'isRed',
    'createdAt',
    'updatedAt',
  ];
  protected FILTER_COLUMNS = ['senderId', 'receiverId', 'taskId', 'isRed'];
  protected SEARCHABLE_COLUMNS = ['subject'];
  protected RELATIONSIP_FIELDS = [
    'sender',
    'receiver',
    'task.createdByUser',
    'task.assignToUser',
    'task.reportToUser',
    'task.sprint.project',
  ];

  protected buildFilterableColumns(): Record<string, FilterOperator[]> {
    return {
      senderId: [FilterOperator.EQ, FilterOperator.IN],
      receiverId: [FilterOperator.EQ, FilterOperator.IN],
      taskId: [FilterOperator.EQ, FilterOperator.IN],
      isRed: [FilterOperator.EQ],
    };
  }

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<NotificationEntity> {
    return this.notificationRepository;
  }

  protected getMapperReponseEntityField(
    entity: NotificationEntity,
  ): Promise<NotificationResponseDto> {
    return NotificationMapper.toDto(entity);
  }

  public list(
    query: PaginateQuery,
  ): Promise<PaginatedResponse<NotificationEntity, NotificationResponseDto>> {
    return super.list(query);
  }

  public async create(
    dto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    try {
      const entity = NotificationMapper.toCreateEntity(dto);
      const savedEntity = await this.notificationRepository.save(entity);
      return this.findOne(savedEntity.id);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<NotificationResponseDto> {
    try {
      const entity = await this.notificationRepository.findOne({
        where: { id },
        relations: {
          sender: true,
          receiver: true,
          task: {
            createdByUser: true,
            assignToUser: true,
            reportToUser: true,
            sprint: { project: true },
          },
        },
      });
      if (!entity) throw new NotFoundException('Notification not found');
      return NotificationMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findByReceiverId(receiverId: string): Promise<NotificationResponseDto[]> {
    try {
      const entities = await this.notificationRepository.find({
        relations: {
          sender: true,
          receiver: true,
          task: true,
        },
        where: {
          receiverId: receiverId,
        },
        order: {
          createdAt: 'DESC',
        },
        take: 10,
      });
      const items = Promise.all(
        entities.map((item) => NotificationMapper.toDto(item)),
      );
      return items;
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: string,
    dto: UpdateNotificationDto,
  ): Promise<NotificationResponseDto> {
    try {
      let entity = await this.notificationRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Notification not found');
      entity = NotificationMapper.toUpdateEntity(entity, dto);
      const savedEntity = await this.notificationRepository.save(entity);
      return this.findOne(savedEntity.id);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.notificationRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Notification not found');
      await this.notificationRepository.delete(id);
    } catch (error) {
      handleError(error);
    }
  }
}
