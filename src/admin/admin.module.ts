import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { HotelsModule } from '../hotels/hotels.module';
import { HotelRoomsModule } from '../hotel-rooms/hotel-rooms.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [HotelsModule, HotelRoomsModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
