import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from '../reservations/reservations.service';
import { SupportRequestsService } from '../support-requests/support-requests.service';
import { UsersService } from '../users/users.service';
import { ID } from '../utils/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('manager')
export class ManagerController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly supportRequestsService: SupportRequestsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('reservations/:id')
  @Roles('manager')
  get(@Param('id') id: ID) {
    return this.reservationsService.findByUserId(id);
  }

  @Delete('reservations/:id')
  @Roles('manager')
  delete(@Param('id') id: ID) {
    return this.reservationsService.removeReservation(id);
  }

  @Get('users')
  @Roles('manager')
  getUsers(@Query() data) {
    return this.usersService.findAll(data);
  }

  @Get('support-request')
  @Roles('manager')
  getSupportRequest(@Query() data) {
    return this.supportRequestsService.findSupportRequests(data);
  }
}
