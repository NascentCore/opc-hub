import { Controller, Post, Get, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

import { IsEmail, IsString, MinLength } from 'class-validator';

class LoginDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  email!: string;

  @IsString()
  @MinLength(6, { message: '密码长度不能少于6位' })
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto.email, dto.password);
    return { data: result };
  }

  @Get('me')
  async me() {
    const result = await this.authService.getMe();
    return { data: result };
  }
}
