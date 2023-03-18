import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { UIdService } from './uid.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly uIdService: UIdService,
    private readonly userService: UsersService,
  ) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const payload = this.uIdService.getUser(bearerToken);
      return new Promise((resolve, reject) => {
        return this.userService.findByEmail(payload.email).then((user) => {
          if (
            user &&
            (payload.role === 'manager' || payload.role === 'client')
          ) {
            resolve(user);
          } else {
            reject(false);
          }
        });
      });
    } catch (ex) {
      return false;
    }
  }
}
