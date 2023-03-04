import { Injectable } from '@nestjs/common';
import {
  ISupportRequestEmployeeService,
  MarkMessagesAsReadDto,
} from './support-requests.interface';
import { ID } from '../utils/types';
import { Message } from './schemas/messages.schemas';

@Injectable()
export class SupportRequestsEmployeeService
  implements ISupportRequestEmployeeService
{
  closeRequest(supportRequest: ID): Promise<void> {
    return Promise.resolve(undefined);
  }

  getUnreadCount(supportRequest: ID): Promise<Message[]> {
    return Promise.resolve([]);
  }

  markMessagesAsRead(params: MarkMessagesAsReadDto) {}
}
