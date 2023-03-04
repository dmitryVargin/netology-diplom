import { Injectable } from '@nestjs/common';
import {
  CreateSupportRequestDto,
  ISupportRequestClientService,
  MarkMessagesAsReadDto,
} from './support-requests.interface';
import { SupportRequest } from './schemas/support-requests.schemas';
import { ID } from '../utils/types';
import { Message } from './schemas/messages.schemas';

@Injectable()
export class SupportRequestsClientService
  implements ISupportRequestClientService
{
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {
    return Promise.resolve(undefined);
  }

  getUnreadCount(supportRequest: ID): Promise<Message[]> {
    return Promise.resolve([]);
  }

  markMessagesAsRead(params: MarkMessagesAsReadDto) {}
}
