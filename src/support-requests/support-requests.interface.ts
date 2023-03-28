import { SearchParams } from '../utils/types';
import { SupportRequest } from './schemas/support-requests.schemas';
import { Message } from './schemas/messages.schemas';

export type CreateSupportRequestDto = {
  user: string;
  text: string;
};

export type SendMessageDto = {
  author: string;
  supportRequest: string;
  text: string;
};
export type MarkMessagesAsReadDto = {
  user: string;
  supportRequest: string;
  createdBefore: Date;
};

export type GetChatListParams = SearchParams & {
  user: string | null;
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
  getMessages(supportRequest: string): Promise<Message[]>;
  subscribe(handler: (supportRequest: string, message: Message) => void): void;
}

export interface ISupportRequestClientService {
  createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<CreateSupportRequestResponse>;
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<{ success: true }>;
  getUnreadCount(supportRequest: string): Promise<number>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<{ success: true }>;
  getUnreadCount(supportRequest: string): Promise<number>;
  closeRequest(supportRequest: string): Promise<void>;
}
