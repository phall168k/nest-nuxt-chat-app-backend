import { IsUUID } from "class-validator";
import { UpdateTaskRequestDto } from "./update-task-request.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskSocketRequestDto extends UpdateTaskRequestDto {
    @ApiProperty()
    @IsUUID()
    id: string;
}