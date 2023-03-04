import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isCorrectPassword = compareSync(pass, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Wrong password');
    }
    const { name, passwordHash, ...data } = user;
    return data;
  }

  async login(user: Pick<UserDocument, '_id' | 'email' | 'name'>) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
