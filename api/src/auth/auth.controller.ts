import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@CurrentUser() user: AuthUser) {
    return this.authService.getMe(user);
  }

  @Post('esqueci-senha')
  esqueciSenha(@Body() body: EsqueciSenhaDto) {
    return this.authService.esqueciSenha(body);
  }

  @Post('redefinir-senha')
  redefinirSenha(@Body() body: RedefinirSenhaDto) {
    return this.authService.redefinirSenha(body);
  }
}
