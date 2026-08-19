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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { ApiPaginatedResponse } from 'src/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from 'src/common/paginations/paginated-response.type';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntity } from './entities/notification.entity';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserEntity } from '../../system/user/entities/user.entity';

@ApiTags('Notification')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({ path: 'admin/task-management/notifications', version: '1' })
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  @ApiOkResponse({
    description: 'Notification created',
    type: NotificationResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public create(
    @Body() dto: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.create(dto);
  }

  @Get()
  @ApiPaginatedResponse(NotificationResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<NotificationEntity, NotificationResponseDto>> {
    return this.notificationService.list(query);
  }

  @Get('/receivers')
  @ApiOperation({ summary: 'Find notifications by receiver id' })
  @ApiOkResponse({
    description: 'Notification found',
    type: NotificationResponseDto,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  public findByReceiverId(
    @CurrentUser() user: UserEntity,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationService.findByReceiverId(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a notification by id' })
  @ApiOkResponse({
    description: 'Notification found',
    type: NotificationResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  public findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a notification by id' })
  @ApiOkResponse({
    description: 'Notification updated',
    type: NotificationResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNotificationDto,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification by id' })
  @ApiOkResponse({ description: 'Notification deleted' })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.notificationService.remove(id);
  }
}
