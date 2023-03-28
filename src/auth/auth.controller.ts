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
import { User, UserDocument } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: { user: Pick<UserDocument, '_id' | 'email' | 'name'> },
  ) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() data: User) {
    const oldUser = await this.userService.findByEmail(data.email);
    if (oldUser) {
      throw new BadRequestException('Такой пользователь уже зарегистрирован');
    }
    return this.userService.create(data);
  }
}
