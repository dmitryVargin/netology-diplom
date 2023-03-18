import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { HotelsService } from '../hotels/hotels.service';
import { HotelRoomsService } from '../hotel-rooms/hotel-rooms.service';
import { ID } from '../utils/types';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

import { editFileName, imageFileFilter } from '../configs/image.upload.config';
import { HotelRoom } from '../hotel-rooms/schemas/hotel-room.schema';
import { UpdateHotelParams } from '../hotels/hotels.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly hotelRoomsService: HotelRoomsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('hotels')
  @Roles('admin')
  getHotels(@Query() params) {
    return this.hotelsService.search(params);
  }
  @Get('hotels/:id')
  @Roles('admin')
  getHotelById(@Param() { id }) {
    return this.hotelsService.findById(id);
  }

  @Post('hotels')
  @Roles('admin')
  createHotel(@Body() data) {
    return this.hotelsService.create(data);
  }

  @Put('hotels/:id')
  @Roles('admin')
  updateHotel(@Param('id') hotelId: ID, @Body() data: UpdateHotelParams) {
    return this.hotelsService.update(hotelId, data);
  }

  @Post('hotel-rooms')
  @Roles('admin')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './rooms-imgs',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  createHotelRoom(
    @UploadedFiles() files,
    @Body()
    {
      description,
      hotelId,
    }: Partial<Pick<HotelRoom, 'description'>> & { hotelId: ID },
  ) {
    const images = files.map((file) => file.path);
    const isEnabled = true;
    return this.hotelRoomsService.create({
      description,
      hotel: hotelId,
      images,
      isEnabled,
    });
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
