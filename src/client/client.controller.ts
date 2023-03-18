import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

import { ReservationsService } from '../reservations/reservations.service';
import { SupportRequestsService } from '../support-requests/support-requests.service';
import { ID, RequestUser } from '../utils/types';
import { SupportRequestsClientService } from '../support-requests/support-request-client.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { CreateSupportRequestDto } from '../support-requests/support-requests.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('client')
export class ClientController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly supportRequestsClientService: SupportRequestsClientService,
    private readonly supportRequestsService: SupportRequestsService,
  ) {}

  @Post('reservations')
  @Roles('client')
  addReservation(@Body() data, @Request() req: { user: RequestUser }) {
    return this.reservationsService.addReservation({
      user: req.user.id,
      ...data,
    });
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
  createSupportRequest(
    @Body() { text }: Pick<CreateSupportRequestDto, 'text'>,
    @Request() req: { user: RequestUser },
  ) {
    const { user } = req;
    return this.supportRequestsClientService.createSupportRequest({
      user: user.id,
      text,
    });
  }

  @Get('support-request')
  @Roles('client')
  getSupportRequest(@Query() data, @Request() req: { user: RequestUser }) {
    const { user } = req;
    return this.supportRequestsService.findSupportRequests({
      user: user.id,
      ...data,
    });
  }
}
