import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HotelRoomsService } from '../hotel-rooms/hotel-rooms.service';
import { RequestUser } from '../utils/types';
import { SupportRequestsClientService } from '../support-requests/support-request-client.service';
import { SupportRequestsService } from '../support-requests/support-requests.service';

import getIsEnabled from '../utils/getIsEnabled';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { SendMessageDto } from '../support-requests/support-requests.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchHotelRoomParams } from '../hotel-rooms/hotel-rooms.interface';
import User from '../auth/user.decorator';
import { AllowAny } from '../auth/allow-any.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('common')
export class CommonController {
  constructor(
    private readonly hotelRoomsService: HotelRoomsService,
    private readonly supportRequestsClientService: SupportRequestsClientService,
    private readonly supportRequestsService: SupportRequestsService,
  ) {}

  @Get('hotel-rooms')
  @AllowAny()
  getHotelRooms(
    @Query() params: SearchHotelRoomParams,
    // TODO добавить @AllowAny и @User там где нужно
    @User() user?: RequestUser,
  ) {
    return this.hotelRoomsService.search({
      ...params,
      isEnabled: getIsEnabled(user),
    });
  }

  @Get('hotel-rooms/:id')
  getHotelRoomById(@Param('id') hotelRoomId: string) {
    return this.hotelRoomsService.findById(hotelRoomId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('support-requests/:id/messages')
  @Roles('client', 'manager')
  async getSupportRequestMessagesById(@Param('id') id: string) {
    return this.supportRequestsService.getMessages(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('support-requests/:id/messages/unread_count')
  @Roles('client', 'manager')
  async getMessagesUnreadCount(@Param('id') id: string) {
    return this.supportRequestsClientService.getUnreadCount(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('support-requests/:id/messages')
  @Roles('client', 'manager')
  sendSupportRequestMessageById(
    @Body() { text }: Pick<SendMessageDto, 'text'>,
    @User() user: RequestUser,
    @Param('id') supportRequestId: string,
  ) {
    return this.supportRequestsService.sendMessage({
      author: user.id,
      supportRequest: supportRequestId,
      text,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('support-requests/:id/messages/read')
  @Roles('client', 'manager')
  async messagesRead(
    @Body() { createdBefore }: { createdBefore: Date },
    @Param('id') supportRequestId: string,
    @User() user: RequestUser,
  ) {
    return await this.supportRequestsClientService.markMessagesAsRead({
      supportRequest: supportRequestId,
      createdBefore,
      user: user.id,
    });
  }
}
