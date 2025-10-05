import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User as ReqUser } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.auth.login(dto.email, dto.password);

    // keep cookie (browser-friendly)
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set true on HTTPS in prod
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    // OPTIONALLY also expose as a header for convenience
    // res.setHeader('Authorization', `Bearer ${token}`);

    return { user, token, message: 'Logged in' }; // 👈 now you’ll see it in Body
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // Clear cookie to "logout"
    res.clearCookie('access_token', { path: '/' });
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@ReqUser() user: any) {
    return { message: 'OK', user };
  }
}
