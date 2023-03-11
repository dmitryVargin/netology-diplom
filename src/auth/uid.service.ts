import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UIdService {
  constructor(private readonly jwtService: JwtService) {}
  getUser(auth) {
    if (!auth) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
        },
        401,
      );
    }
    const jwt = auth.replace('Bearer ', '');
    const payload = this.jwtService.decode(jwt, { json: true }) as {
      email: string;
      name: string;
      role: string;
      id: string;
    };
    return payload;
  }
}
