import { PartialType } from '@nestjs/swagger';
import { CreateSprintRequestDto } from './create-sprint-request.dto';

export class UpdateSprintRequestDto extends PartialType(
  CreateSprintRequestDto,
) {}
