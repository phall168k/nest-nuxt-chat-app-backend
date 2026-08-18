import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { ApiPaginatedResponse } from 'src/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from 'src/common/paginations/paginated-response.type';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { UserResponseDto } from '../../system/user/dto/user-repsonse.dto';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { ProjectSelectOptionResponseDto } from './dto/project-select-option-response.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { ProjectEntity, ProjectStatus } from './entities/project.entity';
import { ProjectService } from './project.service';

@ApiTags('Project')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({ path: 'admin/master-data/projects', version: '1' })
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  @ApiOkResponse({ description: 'Project created', type: ProjectResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public create(
    @Body() dto: CreateProjectRequestDto,
    @CurrentUser() user: UserResponseDto,
  ): Promise<ProjectResponseDto> {
    return this.projectService.create(dto, user.id);
  }

  @Get()
  @ApiPaginatedResponse(ProjectResponseDto)
  @ApiQuery({
    name: 'filter.status',
    required: false,
    enum: ProjectStatus,
    example: ProjectStatus.IN_PROGRESS,
    description:
      'Filter by one status. Use $in:Status 1,Status 2 for multiple statuses.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<ProjectEntity, ProjectResponseDto>> {
    return this.projectService.list(query);
  }

  @Get('select-options')
  @ApiOperation({ summary: 'Get project select options' })
  @ApiOkResponse({
    description: 'Project select options',
    type: ProjectSelectOptionResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public selectOptions(): Promise<ProjectSelectOptionResponseDto[]> {
    return this.projectService.selectOptions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a project by id' })
  @ApiOkResponse({ description: 'Project found', type: ProjectResponseDto })
  @ApiNotFoundResponse({ description: 'Project not found' })
  public findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProjectResponseDto> {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a project by id' })
  @ApiOkResponse({ description: 'Project updated', type: ProjectResponseDto })
  @ApiNotFoundResponse({ description: 'Project not found' })
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectRequestDto,
  ): Promise<ProjectResponseDto> {
    return this.projectService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project by id' })
  @ApiOkResponse({ description: 'Project deleted' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.projectService.remove(id);
  }
}
