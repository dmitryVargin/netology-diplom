import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';

import { SupportRequestsService } from '../support-requests/support-requests.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestSchema,
} from '../support-requests/schemas/support-requests.schemas';
import {
  Message,
  MessageSchema,
} from '../support-requests/schemas/messages.schemas';
import { UsersService } from '../users/users.service';
import { UIdService } from '../auth/uid.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    // SupportRequestsModule,
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [SupportRequestsService, ChatGateway, UIdService, JwtService],
  exports: [SupportRequestsService, ChatGateway, UIdService, JwtService],
})
export class ChatModule {}
