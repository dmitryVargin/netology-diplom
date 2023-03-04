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
import { HotelsService } from '../hotels/hotels.service';
import { HotelRoomsService } from '../hotel-rooms/hotel-rooms.service';
import { ID } from '../utils/types';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly hotelRoomsService: HotelRoomsService,
    private readonly usersService: UsersService
  ) {}

  @Get('hotels')
  @Roles('admin')
  getHotels(@Query() params) {
    return this.hotelsService.search(params);
  }

  @Post('hotels')
  @Roles('admin')
  createHotel(@Body() data) {
    return this.hotelsService.create(data);
  }

  @Put('hotels/:id')
  @Roles('admin')
  updateHotel(@Param('id') id: ID, @Body() data) {
    return this.hotelsService.update(id, data);
  }

  @Post('hotel-rooms')
  @Roles('admin')
  createHotelRoom(@Body() data) {
    return this.hotelRoomsService.create(data);
  }

  @Put('hotel-rooms/:id')
  @Roles('admin')
  updateHotelRoom(@Param('id') id: ID, @Body() data) {
    return this.hotelRoomsService.update(id, data);
  }

  @Roles('admin')
  @Get('users')
  getUsers(@Query() data) {
    return this.usersService.findAll(data);
  }

  @Roles('admin')
  @Post('users')
  createUser(@Body() data) {
    return this.usersService.create(data);
  }
}
