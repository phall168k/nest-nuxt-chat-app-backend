import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  senderId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  receiverId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  taskId: string;

  @ApiProperty({ maxLength: 250 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  subject: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isRed?: boolean;
}
