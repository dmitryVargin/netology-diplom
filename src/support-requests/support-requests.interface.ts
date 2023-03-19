import { ID, SearchParams } from '../utils/types';
import { SupportRequest } from './schemas/support-requests.schemas';
import { Message } from './schemas/messages.schemas';

export type CreateSupportRequestDto = {
  user: ID;
  text: string;
};

export type SendMessageDto = {
  author: ID;
  supportRequest: ID;
  text: string;
};
export type MarkMessagesAsReadDto = {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
};

export type GetChatListParams = SearchParams & {
  user: ID | null;
  isActive: boolean;
};

export type CreateSupportRequestResponse = {
  id: string;
  createdAt: Date;
  isActive: boolean;
  hasNewMessages: boolean;
};

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  subscribe(handler: (supportRequest: ID, message: Message) => void): void;
}

export interface ISupportRequestClientService {
  createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<CreateSupportRequestResponse>;
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<{ success: true }>;
  getUnreadCount(supportRequest: ID): Promise<number>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<{ success: true }>;
  getUnreadCount(supportRequest: ID): Promise<number>;
  closeRequest(supportRequest: ID): Promise<void>;
}
