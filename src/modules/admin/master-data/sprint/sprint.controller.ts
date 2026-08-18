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
import { CreateSprintRequestDto } from './dto/create-sprint-request.dto';
import { SprintResponseDto } from './dto/sprint-response.dto';
import { SprintSelectOptionResponseDto } from './dto/sprint-select-option-response.dto';
import { UpdateSprintRequestDto } from './dto/update-sprint-request.dto';
import { SprintEntity, SprintStatus } from './entities/sprint.entity';
import { SprintService } from './sprint.service';

@ApiTags('Sprint')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({ path: 'admin/master-data/sprints', version: '1' })
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post()
  @ApiOperation({ summary: 'Create a sprint' })
  @ApiOkResponse({ description: 'Sprint created', type: SprintResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public create(
    @Body() dto: CreateSprintRequestDto,
    @CurrentUser() user: UserResponseDto,
  ): Promise<SprintResponseDto> {
    return this.sprintService.create(dto, user.id);
  }

  @Get()
  @ApiPaginatedResponse(SprintResponseDto)
  @ApiQuery({
    name: 'filter.status',
    required: false,
    enum: SprintStatus,
    example: SprintStatus.IN_PROGRESS,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<SprintEntity, SprintResponseDto>> {
    return this.sprintService.list(query);
  }

  @Get('select-options')
  @ApiOperation({ summary: 'Get sprint select options' })
  @ApiOkResponse({
    description: 'Sprint select options',
    type: SprintSelectOptionResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public selectOptions(): Promise<SprintSelectOptionResponseDto[]> {
    return this.sprintService.selectOptions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a sprint by id' })
  @ApiOkResponse({ description: 'Sprint found', type: SprintResponseDto })
  @ApiNotFoundResponse({ description: 'Sprint not found' })
  public findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SprintResponseDto> {
    return this.sprintService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a sprint by id' })
  @ApiOkResponse({ description: 'Sprint updated', type: SprintResponseDto })
  @ApiNotFoundResponse({ description: 'Sprint not found' })
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSprintRequestDto,
  ): Promise<SprintResponseDto> {
    return this.sprintService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sprint by id' })
  @ApiOkResponse({ description: 'Sprint deleted' })
  @ApiNotFoundResponse({ description: 'Sprint not found' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.sprintService.remove(id);
  }
}
