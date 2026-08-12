import { Body, Controller, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { SkipAuth } from './decorators/skip-auth.decorator';

@ApiTags('Auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-up')
    @SkipAuth()
    @ApiOperation({ summary: 'Sign up user' })
    @ApiOkResponse({ type: SignUpResponseDto })
    @ApiConflictResponse({ description: 'User already signed up' })
    public signUp(@Body() dto: SignUpRequestDto): Promise<SignUpResponseDto> {
        return this.authService.signUp(dto);
    }

    @Post('sign-in')
    @SkipAuth()
    @ApiOperation({ summary: 'Sign in user by user and password' })
    @ApiOkResponse({ type: SignInResponseDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    public signIn(@Body() dto: SignInRequestDto): Promise<SignInResponseDto> {
        return this.authService.signIn(dto);
    }
}
