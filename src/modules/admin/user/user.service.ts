import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { UserResponseDto } from './dto/user-repsonse.dto';
import { handleError } from 'src/common/utils/handle-error.util';
import { UserMapper } from './user.mapper';
import { PasswordHash } from 'src/common/utils/password-hash.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async create(dto: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      const user = await this.findOneByUsername(dto.username);
      if (user) throw new ConflictException('User is already registered');
      let entity = UserMapper.toCreateEntity({
        ...dto,
        password: await PasswordHash.hash(dto.password),
      });
      entity = await this.userRepository.save(entity);
      return UserMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAll(userId: string): Promise<UserResponseDto[]> {
    try {
      const entities = await this.userRepository.find({
        order: {
          createdAt: 'DESC',
        },
        where: {
          id: Not(userId),
        },
      });
      const items = Promise.all(
        entities.map((item) => UserMapper.toDto(item)),
      );
      return items;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<UserResponseDto> {
    try {
      const entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('User not found');
      return UserMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOneByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  public async update(id: string, dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    try {
      let entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('User not found');
      entity = UserMapper.toUpdateEntity(entity, dto);
      entity = await this.userRepository.save(entity);
      return UserMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.userRepository.findOneBy({ id });
      if (entity) throw new NotFoundException('User not found');
      await this.userRepository.delete(id);
    } catch (error) {
      handleError(error);
    }
  }

  public async updateStatus(userId: string, status: boolean): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) throw new NotFoundException('User not found');
      await this.userRepository.update({id: userId}, {status});
    } catch (error) {
      handleError(error);
    }
  }
}
