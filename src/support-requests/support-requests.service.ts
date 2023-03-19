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
import { ID, SearchParams } from '../utils/types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/messages.schemas';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { MessageGateway } from './message.gateway';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../utils/constants';

@Injectable()
export class SupportRequestsService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    private eventEmitter: EventEmitter2,
    private messageGateway: MessageGateway,
  ) {
    this.subscribe(async (supportRequest: ID, message: Message) => {
      this.messageGateway.server.emit('message', {
        chatId: supportRequest,
        message,
      });
    });
  }

  async findSupportRequests({
    limit = LIMIT_DEFAULT,
    offset = OFFSET_DEFAULT,
    isActive,
    user,
  }: GetChatListParams): Promise<SupportRequest[]> {
    return await this.supportRequestModel
      .find({ user: user, isActive })
      .skip(offset)
      .limit(limit)
      .select('-__v')
      .exec();
  }
  async findSupportRequest(supportRequestId: ID) {
    return this.supportRequestModel.findById(supportRequestId);
  }

  async getMessages(supportRequestId: ID): Promise<Message[]> {
    const supportRequestModel = (await this.supportRequestModel.findById(
      supportRequestId,
    )) as SupportRequestDocument;

    return this.messageModel.find({
      _id: supportRequestModel.messages,
    });
  }

  async sendMessage({
    text,
    author,
    supportRequest,
  }: SendMessageDto): Promise<any> {
    const supportRequestModel = (await this.supportRequestModel.findById(
      supportRequest,
    )) as SupportRequestDocument;
    const message = new this.messageModel({
      author,
      text,
      sentAt: new Date(),
    });
    await message.save();
    supportRequestModel.messages.push(message);
    await supportRequestModel.save();
    this.eventEmitter.emit('message', supportRequest, message);
    return message;
  }

  subscribe(handler: (supportRequest: ID, message: Message) => void) {
    this.eventEmitter.on('message', handler);
  }
}
