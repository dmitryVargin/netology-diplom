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

import {
  CreateHotelParams,
  SearchHotelParams,
  UpdateHotelParams,
} from '../hotels/hotels.interface';

import {
  CreateHotelRoomParams,
  UpdateHotelRoomParams,
} from '../hotel-rooms/hotel-rooms.interface';
import { SearchUserParams } from '../users/users.interface';
import { User } from '../users/schemas/user.schema';

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
  getHotels(@Query() params: SearchHotelParams) {
    return this.hotelsService.search(params);
  }

  @Get('hotels/:id')
  @Roles('admin')
  getHotelById(@Param() { id }: { id: ID }) {
    return this.hotelsService.findById(id);
  }

  @Post('hotels')
  @Roles('admin')
  createHotel(@Body() data: CreateHotelParams) {
    return this.hotelsService.create(data);
  }

  @Put('hotels/:id')
  @Roles('admin')
  updateHotel(@Param('id') hotelId: string, @Body() data: UpdateHotelParams) {
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
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: CreateHotelRoomParams,
  ) {
    const images = files.map((file) => file.path);

    return this.hotelRoomsService.create({
      ...data,
      images,
    });
  }

  @Put('hotel-rooms/:id')
  @Roles('admin')
  updateHotelRoom(
    @Param('id') id: string,
    @Body() data: UpdateHotelRoomParams,
  ) {
    return this.hotelRoomsService.update(id, data);
  }

  @Roles('admin')
  @Get('users')
  getUsers(@Query() params: SearchUserParams) {
    return this.usersService.findAll(params);
  }

  @Roles('admin')
  @Post('users')
  createUser(@Body() data: Partial<User>) {
    return this.usersService.create(data);
  }
}
