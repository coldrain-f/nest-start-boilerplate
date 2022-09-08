import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { SignupRequestDto } from './dto/signup.request.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('signup')
  signup(@Body() signupRequestDto: SignupRequestDto) {
    return this.usersService.signup(signupRequestDto);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.jwtLogin(loginRequestDto);
  }
}
