import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { UpdateUserRequestDto } from "./dto/update-user-request.dto";
import { UserResponseDto } from "./dto/user-repsonse.dto";
import { UserEntity } from "./entities/user.entity";

export class UserMapper {
    public static async toDto(entity: UserEntity): Promise<UserResponseDto> {
        const dto = new UserResponseDto();
        dto.id = entity.id;
        dto.username = entity.username;
        dto.fullName = entity.fullName;
        dto.status = entity.status;
        dto.isActive = entity.isActive;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        
        return dto;
    }

    public static toCreateEntity(dto: CreateUserRequestDto): UserEntity {
        const entity = new UserEntity();
        entity.username = dto.username;
        entity.password = dto.password;
        entity.fullName = dto.fullName;
        
        return entity;
    }

    public static toUpdateEntity(entity: UserEntity, dto: UpdateUserRequestDto): UserEntity {
        entity.username = dto.username;
        entity.fullName = dto.fullName;

        return entity;
    }
}