import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { HotelRoomsModule } from '../hotel-rooms/hotel-rooms.module';
import { SupportRequestsModule } from '../support-requests/support-requests.module';

@Module({
  imports: [HotelRoomsModule, SupportRequestsModule],
  controllers: [CommonController],
})
export class CommonModule {}
