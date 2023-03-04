import { Injectable } from '@nestjs/common';
import {
  GetChatListParams,
  ISupportRequestService,
  SendMessageDto,
} from './support-requests.interface';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-requests.schemas';
import { ID } from '../utils/types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/messages.schemas';

@Injectable()
export class SupportRequestsService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequestDocument>
  ) {}

  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
    return Promise.resolve([]);
  }

  async getMessages(supportRequest: ID): Promise<Message[]> {
    // return this.SupportRequestModel.findById(ID).select('-__v');
    return Promise.resolve([]);
  }

  sendMessage(data: SendMessageDto): Promise<Message> {
    return Promise.resolve(undefined);
  }

  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void
  ): () => void {
    return function () {};
  }
}
