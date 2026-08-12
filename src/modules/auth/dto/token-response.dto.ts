import { ApiProperty } from "@nestjs/swagger";

export class TokenResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    tokenType: string;

    @ApiProperty()
    expiredIn: any;
}