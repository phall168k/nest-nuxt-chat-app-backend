import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { BasePaginationCrudService } from 'src/common/services/base-pagination-crud.service';
import { handleError } from 'src/common/utils/handle-error.util';
import { CreateSprintRequestDto } from './dto/create-sprint-request.dto';
import { SprintResponseDto } from './dto/sprint-response.dto';
import { SprintSelectOptionResponseDto } from './dto/sprint-select-option-response.dto';
import { UpdateSprintRequestDto } from './dto/update-sprint-request.dto';
import { SprintEntity } from './entities/sprint.entity';
import { SprintMapper } from './sprint.mapper';

@Injectable()
export class SprintService extends BasePaginationCrudService<
  SprintEntity,
  SprintResponseDto
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
    'projectId',
    'createdByUserId',
    'startDate',
    'endDate',
  ];
  protected SEARCHABLE_COLUMNS = ['name', 'description'];
  protected RELATIONSIP_FIELDS = ['project', 'createdByUser'];

  protected buildFilterableColumns(): Record<string, FilterOperator[]> {
    return {
      status: [FilterOperator.EQ, FilterOperator.IN],
      projectId: [FilterOperator.EQ],
      createdByUserId: [FilterOperator.EQ],
      startDate: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
      endDate: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
    };
  }

  constructor(
    @InjectRepository(SprintEntity)
    private readonly sprintRepository: Repository<SprintEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<SprintEntity> {
    return this.sprintRepository;
  }

  protected getMapperReponseEntityField(
    entity: SprintEntity,
  ): Promise<SprintResponseDto> {
    return SprintMapper.toDto(entity);
  }

  public async create(
    dto: CreateSprintRequestDto,
    createdByUserId: string,
  ): Promise<SprintResponseDto> {
    try {
      this.validateDateRange(dto.startDate, dto.endDate);
      const entity = SprintMapper.toCreateEntity(dto, createdByUserId);
      return SprintMapper.toDto(await this.sprintRepository.save(entity));
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<SprintResponseDto> {
    try {
      const entity = await this.sprintRepository.findOne({
        where: { id },
        relations: { project: true, createdByUser: true },
      });
      if (!entity) throw new NotFoundException('Sprint not found');
      return SprintMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async selectOptions(): Promise<SprintSelectOptionResponseDto[]> {
    try {
      const entities = await this.sprintRepository.find({
        select: { id: true, name: true },
        order: { name: 'ASC' },
      });
      return entities.map((entity) => SprintMapper.toSelectOptionDto(entity));
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: string,
    dto: UpdateSprintRequestDto,
  ): Promise<SprintResponseDto> {
    try {
      let entity = await this.sprintRepository.findOne({
        where: { id },
        relations: { project: true, createdByUser: true },
      });
      if (!entity) throw new NotFoundException('Sprint not found');
      this.validateDateRange(
        dto.startDate ?? entity.startDate,
        dto.endDate ?? entity.endDate,
      );
      entity = SprintMapper.toUpdateEntity(entity, dto);
      return SprintMapper.toDto(await this.sprintRepository.save(entity));
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.sprintRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Sprint not found');
      await this.sprintRepository.delete(id);
    } catch (error) {
      handleError(error);
    }
  }

  private validateDateRange(startDate: string, endDate: string): void {
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      throw new BadRequestException('End date must be on or after start date');
    }
  }
}
