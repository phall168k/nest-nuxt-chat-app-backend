import { ApiProperty } from '@nestjs/swagger';

export class UserSelectOptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;
}
