import { Module } from '@nestjs/common';
import { SupportRequestsService } from './support-requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestSchema,
} from './schemas/support-requests.schemas';
import { SupportRequestsEmployeeService } from './support-request-employee.service';
import { SupportRequestsClientService } from './support-request-client.service';
import { Message, MessageSchema } from './schemas/messages.schemas';
import { UsersModule } from '../users/users.module';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { MessageGateway } from './message.gateway';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    EventEmitterModule.forRoot(),
  ],

  providers: [
    SupportRequestsService,
    SupportRequestsEmployeeService,
    SupportRequestsClientService,
    MessageGateway,
    ChatGateway,
  ],
  exports: [
    SupportRequestsService,
    SupportRequestsEmployeeService,
    SupportRequestsClientService,
  ],
})
export class SupportRequestsModule {}
