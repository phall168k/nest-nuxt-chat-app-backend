import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/admin/system/user/dto/user-repsonse.dto';
import { TaskResponseDto } from '../../task/dto/task-response.dto';

export class NotificationResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  senderId: string;

  @ApiProperty({ type: UserResponseDto })
  sender: UserResponseDto;

  @ApiProperty({ format: 'uuid' })
  receiverId: string;

  @ApiProperty({ type: UserResponseDto })
  receiver: UserResponseDto;

  @ApiProperty({ format: 'uuid' })
  taskId: string;

  @ApiProperty({ type: TaskResponseDto })
  task: TaskResponseDto;

  @ApiProperty({ maxLength: 250 })
  subject: string;

  @ApiProperty({ default: false })
  isRed: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
