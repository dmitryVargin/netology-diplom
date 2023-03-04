import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { HotelRoomsService } from '../hotel-rooms/hotel-rooms.service';
import { ID } from '../utils/types';
import { SupportRequestsClientService } from '../support-requests/support-request-client.service';
import { SupportRequestsService } from '../support-requests/support-requests.service';

import getIsEnabled from '../utils/getIsEnabled';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';

@UseGuards(RolesGuard)
@Controller('common')
export class CommonController {
  constructor(
    private readonly hotelRoomsService: HotelRoomsService,
    private readonly supportRequestsClientService: SupportRequestsClientService,
    private readonly supportRequestsService: SupportRequestsService
  ) {}
  @Get('hotel-rooms')
  getHotelRooms(@Query() data, @Request() req) {
    return this.hotelRoomsService.search({
      ...data,
      isEnabled: getIsEnabled(req.user),
    });
  }

  @Get('hotel-rooms/:id')
  getHotelRoomById(@Param('id') id) {
    return this.hotelRoomsService.findById(id);
  }

  @Get('support-requests/:id/messages')
  @Roles('client', 'manager')
  async getSupportRequestMessagesById(@Param('id') id) {
    return this.supportRequestsService.getMessages(id);
  }

  @Post('support-requests/:id/messages')
  @Roles('client', 'manager')
  sendSupportRequestMessageById(@Body() data) {
    return this.supportRequestsService.sendMessage(data);
  }

  @Post('support-requests/:id/messages/read')
  @Roles('client', 'manager')
  sendReadActionToSupportRequestMessageById(@Param('id') id) {
    return this.supportRequestsClientService.markMessagesAsRead(id);
  }
}
