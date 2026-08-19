import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class NotificationRedRequestDto {
    @ApiProperty()
    @IsUUID()
    id: string[];
}