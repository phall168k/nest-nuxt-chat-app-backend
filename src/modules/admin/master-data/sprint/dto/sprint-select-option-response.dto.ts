import { ApiProperty } from '@nestjs/swagger';

export class SprintSelectOptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
