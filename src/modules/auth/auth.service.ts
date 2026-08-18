import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../admin/system/user/user.service';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { handleError } from 'src/common/utils/handle-error.util';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { PasswordHash } from 'src/common/utils/password-hash.util';
import { UserMapper } from '../admin/system/user/user.mapper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    public async signUp(dto: SignUpRequestDto): Promise<SignUpResponseDto>{
        try {
            const user = await this.userService.create(dto);
            return user;
        } catch (error) {
            handleError(error);
        }
    }

    public async signIn(dto: SignInRequestDto): Promise<SignInResponseDto> {
        try {
            const user = await this.userService.findOneByUsername(dto.username);
            if (!user) throw new UnauthorizedException('Unauthorized');
            const isMatched = PasswordHash.verify(dto.password, user.password);
            if (!isMatched) throw new UnauthorizedException('Unauthorized');
            const payload = {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            const token = await this.jwtService.sign(payload);
            return {
                users: await UserMapper.toDto(user),
                token: {
                    accessToken: token,
                    tokenType: 'Barrer',
                    expiredIn: '1d',
                },
            };
        } catch (error) {
            handleError(error);
        }
    }
}
