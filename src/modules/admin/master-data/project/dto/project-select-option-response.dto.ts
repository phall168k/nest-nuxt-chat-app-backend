import { ApiProperty } from '@nestjs/swagger';

export class ProjectSelectOptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameKh: string;
}
