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
import { UserResponseDto } from 'src/modules/admin/system/user/dto/user-repsonse.dto';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { CreateTaskRequestDto } from './dto/create-task-request.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskRequestDto } from './dto/update-task-request.dto';
import { TaskEntity, TaskStatus } from './entities/task.entity';
import { TaskService } from './task.service';

@ApiTags('Task')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({ path: 'admin/task-management/tasks', version: '1' })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  @ApiOkResponse({ description: 'Task created', type: TaskResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public create(
    @Body() dto: CreateTaskRequestDto,
    @CurrentUser() user: UserResponseDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.create(dto, user.id);
  }

  @Get()
  @ApiPaginatedResponse(TaskResponseDto)
  @ApiQuery({
    name: 'filter.status',
    required: false,
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  @ApiQuery({
    name: 'filter.sprint.projectId',
    required: false,
    type: String,
    format: 'uuid',
    description: 'Filter tasks by project through their sprint',
  })
  @ApiQuery({
    name: 'filter.startDate',
    required: false,
    type: String,
    example: '$gte:2026-08-18',
    description: 'Selected range start date; paired with filter.endDate',
  })
  @ApiQuery({
    name: 'filter.endDate',
    required: false,
    type: String,
    example: '$lte:2026-08-19',
    description: 'Selected range end date; returns tasks overlapping the range',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<TaskEntity, TaskResponseDto>> {
    return this.taskService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a task by id' })
  @ApiOkResponse({ description: 'Task found', type: TaskResponseDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  public findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TaskResponseDto> {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task by id' })
  @ApiOkResponse({ description: 'Task updated', type: TaskResponseDto })
  @ApiNotFoundResponse({ description: 'Task not found' })
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskRequestDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by id' })
  @ApiOkResponse({ description: 'Task deleted' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.taskService.remove(id);
  }
}
