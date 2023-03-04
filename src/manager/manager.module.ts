import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { UsersModule } from '../users/users.module';
import { SupportRequestsModule } from '../support-requests/support-requests.module';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [UsersModule, SupportRequestsModule, ReservationsModule],
  controllers: [ManagerController],
})
export class ManagerModule {}
