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
import { InjectModel, Prop } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/messages.schemas';
import { Subject } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class SupportRequestsService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>, // private eventEmitter: EventEmitter2, // private chatGateway: ChatGateway,
  ) {
    // this.subscribe(async (supportRequest: ID, message: Message) => {
    //   this.chatGateway.server.emit('message', {
    //     chatId: supportRequest,
    //     message,
    //   });
    // });
  }

  async findSupportRequests({
    limit = 100,
    offset = 0,
    isActive,
    user,
  }: GetChatListParams & SearchParams): Promise<SupportRequest[]> {
    return await this.supportRequestModel
      .find({ user: user, isActive })
      .skip(offset)
      .limit(limit)
      .select('-__v')
      .exec();
  }

  async getMessages(supportRequestId: ID): Promise<Message[]> {
    const supportRequestModel = await this.supportRequestModel.findById(
      supportRequestId,
    );

    return this.messageModel.find({
      _id: supportRequestModel.messages,
    });
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
    await message.save();
    supportRequestModel.messages.push(message);
    await supportRequestModel.save();
    // this.eventEmitter.emit('message', supportRequest, message);
    return message;
  }

  //@ts-ignore
  subscribe(handler: (supportRequest: ID, message: Message) => void) {
    // this.eventEmitter.on('message', handler);
  }
}
