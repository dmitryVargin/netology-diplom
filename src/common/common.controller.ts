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
import { ID, RequestUser } from '../utils/types';
import { SupportRequestsClientService } from '../support-requests/support-request-client.service';
import { SupportRequestsService } from '../support-requests/support-requests.service';

import getIsEnabled from '../utils/getIsEnabled';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import {
  CreateSupportRequestDto,
  SendMessageDto,
} from '../support-requests/support-requests.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('common')
export class CommonController {
  constructor(
    private readonly hotelRoomsService: HotelRoomsService,
    private readonly supportRequestsClientService: SupportRequestsClientService,
    private readonly supportRequestsService: SupportRequestsService,
  ) {}

  // Работает
  @Get('hotel-rooms')
  getHotelRooms(@Query() data, @Request() req) {
    return this.hotelRoomsService.search({
      ...data,
      isEnabled: getIsEnabled(req.user),
    });
  }

  // Работает
  @Get('hotel-rooms/:id')
  getHotelRoomById(@Param('id') id) {
    return this.hotelRoomsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('support-requests/:id/messages')
  @Roles('client', 'manager')
  async getSupportRequestMessagesById(
    @Param('id') id,
    @Request() { user }: { user: RequestUser },
  ) {
    return this.supportRequestsService.getMessages(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('support-requests/:id/messages')
  @Roles('client', 'manager')
  sendSupportRequestMessageById(
    @Body() { text }: Pick<SendMessageDto, 'text'>,
    @Request() { user }: { user: RequestUser },
    @Param() { id },
  ) {
    return this.supportRequestsService.sendMessage({
      author: user.id,
      supportRequest: id,
      text,
    });
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('support-requests/:id/messages/read')
  @Roles('client', 'manager')
  async messagesRead(@Body() body: { createdBefore: string }, @Param() params) {
    const { createdBefore } = body;
    const id = params.id;
    return await this.supportRequestsClientService.markMessagesAsRead({
      id,
      createdBefore,
    });
  }
}
