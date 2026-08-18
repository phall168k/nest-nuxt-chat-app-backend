import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, type PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { BasePaginationCrudService } from 'src/common/services/base-pagination-crud.service';
import { PaginatedResponse } from 'src/common/paginations/paginated-response.type';
import { handleError } from 'src/common/utils/handle-error.util';
import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskRequestDto } from './dto/update-task-request.dto';
import { TaskEntity } from './entities/task.entity';
import { TaskMapper } from './task.mapper';

@Injectable()
export class TaskService extends BasePaginationCrudService<
  TaskEntity,
  TaskResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'name',
    'startDate',
    'endDate',
    'status',
    'createdAt',
    'updatedAt',
  ];
  protected FILTER_COLUMNS = [
    'status',
    'createdByUserId',
    'assignToUserId',
    'reportToUserId',
    'sprintId',
    'sprint.projectId',
    'startDate',
    'endDate',
  ];
  protected SEARCHABLE_COLUMNS = ['name', 'description'];
  protected RELATIONSIP_FIELDS = [
    'createdByUser',
    'assignToUser',
    'reportToUser',
    'sprint.project',
  ];

  protected buildFilterableColumns(): Record<string, FilterOperator[]> {
    return {
      status: [FilterOperator.EQ, FilterOperator.IN],
      createdByUserId: [FilterOperator.EQ],
      assignToUserId: [FilterOperator.EQ, FilterOperator.IN],
      reportToUserId: [
        FilterOperator.EQ,
        FilterOperator.IN,
        FilterOperator.NULL,
      ],
      sprintId: [FilterOperator.EQ, FilterOperator.IN],
      'sprint.projectId': [FilterOperator.EQ],
      startDate: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
      endDate: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
    };
  }

  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<TaskEntity> {
    return this.taskRepository;
  }

  protected getMapperReponseEntityField(
    entity: TaskEntity,
  ): Promise<TaskResponseDto> {
    return TaskMapper.toDto(entity);
  }

  public list(
    query: PaginateQuery,
  ): Promise<PaginatedResponse<TaskEntity, TaskResponseDto>> {
    return super.list(this.normalizeDateRangeQuery(query));
  }

  public async create(
    dto: CreateTaskRequestDto,
    createdByUserId: string,
  ): Promise<TaskResponseDto> {
    try {
      this.validateDateRange(dto.startDate, dto.endDate);
      const entity = TaskMapper.toCreateEntity(dto, createdByUserId);
      const savedEntity = await this.taskRepository.save(entity);
      return this.findOne(savedEntity.id);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<TaskResponseDto> {
    try {
      const entity = await this.taskRepository.findOne({
        where: { id },
        relations: {
          createdByUser: true,
          assignToUser: true,
          reportToUser: true,
          sprint: { project: true },
        },
      });
      if (!entity) throw new NotFoundException('Task not found');
      return TaskMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: string,
    dto: UpdateTaskRequestDto,
  ): Promise<TaskResponseDto> {
    try {
      let entity = await this.taskRepository.findOne({
        where: { id },
        relations: {
          createdByUser: true,
          assignToUser: true,
          reportToUser: true,
          sprint: { project: true },
        },
      });
      if (!entity) throw new NotFoundException('Task not found');
      this.validateDateRange(
        dto.startDate ?? entity.startDate,
        dto.endDate ?? entity.endDate,
      );
      entity = TaskMapper.toUpdateEntity(entity, dto);
      const savedEntity = await this.taskRepository.save(entity);
      return this.findOne(savedEntity.id);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.taskRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Task not found');
      await this.taskRepository.delete(id);
    } catch (error) {
      handleError(error);
    }
  }

  private validateDateRange(startDate: string, endDate: string): void {
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      throw new BadRequestException('End date must be on or after start date');
    }
  }

  private normalizeDateRangeQuery(query: PaginateQuery): PaginateQuery {
    const startFilter = query.filter?.startDate;
    const endFilter = query.filter?.endDate;

    if (
      typeof startFilter !== 'string' ||
      typeof endFilter !== 'string' ||
      !startFilter.startsWith(`${FilterOperator.GTE}:`) ||
      !endFilter.startsWith(`${FilterOperator.LTE}:`)
    ) {
      return query;
    }

    const selectedStartDate = startFilter.slice(FilterOperator.GTE.length + 1);
    const selectedEndDate = endFilter.slice(FilterOperator.LTE.length + 1);
    this.validateDateRange(selectedStartDate, selectedEndDate);

    return {
      ...query,
      filter: {
        ...query.filter,
        startDate: `${FilterOperator.LTE}:${selectedEndDate}`,
        endDate: `${FilterOperator.GTE}:${selectedStartDate}`,
      },
    };
  }
}
