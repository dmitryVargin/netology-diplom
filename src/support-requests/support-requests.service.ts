import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GetChatListParams,
  ISupportRequestService,
  SendMessageDto,
} from './support-requests.interface';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-requests.schemas';
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
    this.subscribe(async (supportRequest: string, message: Message) => {
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
      .exec();
  }
  async findSupportRequest(supportRequestId: string) {
    return this.supportRequestModel.findById(supportRequestId);
  }

  async getMessages(supportRequestId: string): Promise<Message[]> {
    const supportRequestModel = await this.supportRequestModel.findById(
      supportRequestId,
    );
    if (!supportRequestModel) {
      throw new NotFoundException();
    }

    const found = this.messageModel.find({
      _id: supportRequestModel.messages,
    });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async sendMessage({
    text,
    author,
    supportRequest,
  }: SendMessageDto): Promise<any> {
    const supportRequestModel = await this.supportRequestModel.findById(
      supportRequest,
    );
    const message = new this.messageModel({
      author,
      text,
      sentAt: new Date(),
    });

    if (!supportRequestModel) {
      throw new NotFoundException();
    }
    await message.save();
    supportRequestModel.messages.push(message);
    await supportRequestModel.save();
    this.eventEmitter.emit('message', supportRequest, message);
    return message;
  }

  subscribe(handler: (supportRequest: string, message: Message) => void) {
    this.eventEmitter.on('message', handler);
  }
}
