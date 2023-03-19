import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context) {
    const allowAny = this.reflector.get<string[]>(
      'allow-any',
      context.getHandler(),
    );

    if (user) return user;
    if (allowAny) return;
    throw new UnauthorizedException();
  }
}
