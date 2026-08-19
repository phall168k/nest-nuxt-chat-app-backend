import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskRequestDto } from './create-task-request.dto';
import { IsUUID } from 'class-validator';

export class UpdateTaskRequestDto extends PartialType(CreateTaskRequestDto) {
}
