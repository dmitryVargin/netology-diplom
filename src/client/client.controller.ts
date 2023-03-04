import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HotelsService } from '../hotels/hotels.service';
import { HotelRoomsService } from '../hotel-rooms/hotel-rooms.service';
import { UsersService } from '../users/users.service';
import { ReservationsService } from '../reservations/reservations.service';
import { SupportRequestsService } from '../support-requests/support-requests.service';
import { ID } from '../utils/types';
import { SupportRequestsClientService } from '../support-requests/support-request-client.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('client')
export class ClientController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly supportRequestsClientService: SupportRequestsClientService,
    private readonly supportRequestsService: SupportRequestsService,
    private readonly usersService: UsersService
  ) {}

  @Post('reservations')
  @Roles('client')
  addReservation(@Body() data) {
    return this.reservationsService.addReservation(data);
  }

  @Get('reservations')
  @Roles('client')
  getReservations(@Query() params) {
    return this.reservationsService.getReservations(params);
  }

  @Delete('reservations/:id')
  @Roles('client')
  removeReservation(@Param('id') id: ID) {
    return this.reservationsService.removeReservation(id);
  }
  @Post('support-request')
  @Roles('client')
  createSupportReuest(@Body() data) {
    return this.supportRequestsClientService.createSupportRequest(data);
  }
  @Get('support-request')
  @Roles('client')
  getSupportRequest(@Query() data) {
    return this.supportRequestsService.findSupportRequests(data);
  }
}
