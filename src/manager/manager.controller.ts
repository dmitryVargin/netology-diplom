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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { ManagerReservationSearchOptions } from '../reservations/reservations.interface';
import { SearchUserParams } from '../users/users.interface';
import { GetChatListParams } from '../support-requests/support-requests.interface';

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
  get(
    @Query() params: ManagerReservationSearchOptions,
    @Param('id') userId: string,
  ) {
    return this.reservationsService.getReservationsNew({ userId });
  }

  @Delete('reservations/:id')
  @Roles('manager')
  delete(@Param('id') id: string) {
    return this.reservationsService.removeReservation(id);
  }

  @Get('users')
  @Roles('manager')
  getUsers(@Query() params: SearchUserParams) {
    return this.usersService.findAll(params);
  }

  @Get('support-request')
  @Roles('manager')
  getSupportRequest(@Query() params: GetChatListParams) {
    return this.supportRequestsService.findSupportRequests(params);
  }
}
