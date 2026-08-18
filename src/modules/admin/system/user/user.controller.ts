import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { UserResponseDto } from './dto/user-repsonse.dto';
import { UserSelectOptionResponseDto } from './dto/user-select-option-response.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserEntity } from './entities/user.entity';
import { ApiPaginatedResponse } from 'src/common/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from 'src/common/paginations/paginated-response.type';

@ApiTags('User')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiConflictResponse({ description: 'User is already registered' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ description: 'User created', type: UserResponseDto })
  public create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }

  @Get()
  @ApiPaginatedResponse(UserResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<UserEntity, UserResponseDto>>{
    return this.userService.list(query);
  }

  @Get('select-options')
  @ApiOperation({ summary: 'Get user select options' })
  @ApiOkResponse({
    description: 'User select options',
    type: UserSelectOptionResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public selectOptions(): Promise<UserSelectOptionResponseDto[]> {
    return this.userService.selectOptions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by id' })
  @ApiOkResponse({ description: 'Find a user', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiOkResponse({ description: 'Update a user', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiOkResponse({ description: 'Delete a user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
