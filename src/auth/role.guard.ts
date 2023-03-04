import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log(6777, roles);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log('reques123t', request);
    const user = request.user;
    console.log('user654', user);
    return roles.includes(user?.role);
  }
}
