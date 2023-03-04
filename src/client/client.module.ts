import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { UsersModule } from '../users/users.module';
import { SupportRequestsModule } from '../support-requests/support-requests.module';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [UsersModule, SupportRequestsModule, ReservationsModule],
  controllers: [ClientController],
})
export class ClientModule {}
