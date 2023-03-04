import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('login', req.user);
    return this.authService.login(req.user);
  }

  // "passwordHash": "hash1",
  // {
  //   "email": "qwe123@mail.ru",
  //   "passwordHash": "$2a$10$ZliHmxzGeqVSsBSmclOaxOWd/u.f7AhFsnaLjRhn2tRshJmPN2R92",
  //   "name": "Vasya",
  //   "role": "admin",
  //   "_id": "63e91b90d7335ef788bf8b74",
  //   "__v": 0
  // }

  @Post('register')
  async register(@Body() data) {
    const oldUser = await this.userService.findByEmail(data.email);
    if (oldUser) {
      throw new BadRequestException('Такой пользователь уже зарегистрирован');
    }
    return this.userService.create(data);
  }
  // @Post('logout')
  // async logout(@Body() data) {
  //   const oldUser = await this.userService.findByEmail(data.email);
  //   if (oldUser) {
  //     throw new BadRequestException('Такой пользователь уже зарегистрирован');
  //   }
  //   return this.userService.create(data);
  // }

  // POST /api/auth/logout
  // POST /api/client/register
}
