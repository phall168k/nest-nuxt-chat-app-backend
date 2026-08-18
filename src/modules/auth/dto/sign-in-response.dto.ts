import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "src/modules/admin/system/user/dto/user-repsonse.dto";
import { TokenResponseDto } from "./token-response.dto";

export class SignInResponseDto {
    @ApiProperty()
    users: UserResponseDto;

    @ApiProperty()
    token: TokenResponseDto;
}