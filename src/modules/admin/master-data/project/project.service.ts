import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator } from 'nestjs-paginate';
import { BasePaginationCrudService } from 'src/common/services/base-pagination-crud.service';
import { handleError } from 'src/common/utils/handle-error.util';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { ProjectEntity } from './entities/project.entity';
import { ProjectMapper } from './project.mapper';

@Injectable()
export class ProjectService extends BasePaginationCrudService<
  ProjectEntity,
  ProjectResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'nameEn',
    'nameKh',
    'status',
    'createdAt',
    'updatedAt',
  ];
  protected FILTER_COLUMNS = ['nameEn', 'nameKh', 'status', 'createdByUserId'];
  protected SEARCHABLE_COLUMNS = ['nameEn', 'nameKh', 'status'];
  protected RELATIONSIP_FIELDS = ['createdByUser'];

  protected buildFilterableColumns(): Record<string, FilterOperator[]> {
    return {
      nameEn: [FilterOperator.EQ],
      nameKh: [FilterOperator.EQ],
      status: [FilterOperator.EQ, FilterOperator.IN],
      createdByUserId: [FilterOperator.EQ],
    };
  }

  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<ProjectEntity> {
    return this.projectRepository;
  }

  protected getMapperReponseEntityField(
    entity: ProjectEntity,
  ): Promise<ProjectResponseDto> {
    return ProjectMapper.toDto(entity);
  }

  public async create(
    dto: CreateProjectRequestDto,
    createdByUserId: string,
  ): Promise<ProjectResponseDto> {
    try {
      const entity = ProjectMapper.toCreateEntity(dto, createdByUserId);
      return ProjectMapper.toDto(await this.projectRepository.save(entity));
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<ProjectResponseDto> {
    try {
      const entity = await this.projectRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Project not found');
      return ProjectMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: string,
    dto: UpdateProjectRequestDto,
  ): Promise<ProjectResponseDto> {
    try {
      let entity = await this.projectRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Project not found');
      entity = ProjectMapper.toUpdateEntity(entity, dto);
      return ProjectMapper.toDto(await this.projectRepository.save(entity));
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.projectRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Project not found');
      await this.projectRepository.delete(id);
    } catch (error) {
      handleError(error);
    }
  }
}
