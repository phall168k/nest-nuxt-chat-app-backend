import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    status: boolean;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiPropertyOptional({ type: String, nullable: true })
    lastMessage?: string | null;

    @ApiPropertyOptional({ type: Date, nullable: true })
    lastMessageAt?: Date | null;

    @ApiPropertyOptional({ type: Number, default: 0 })
    unreadCount?: number;
}
