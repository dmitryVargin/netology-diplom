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
import { ID, PaginationQuery } from '../utils/types';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/messages.schemas';
import { SearchHotelParams } from '../hotels/hotels.interface';
import { Hotel } from '../hotels/schemas/hotel.schema';
import { Subject } from 'rxjs';

@Injectable()
export class SupportRequestsService implements ISupportRequestService {
  private messagesSubject = new Subject<{ requestId: string; message: any }>();
  constructor(
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private MessageModel: Model<MessageDocument>,
  ) {}

  get messages() {
    return this.messagesSubject.asObservable();
  }

  async findSupportRequests({
    limit,
    offset,
    isActive,
  }: GetChatListParams & PaginationQuery): Promise<SupportRequest[]> {
    return await this.SupportRequestModel.find({ isActive })
      .skip(offset)
      .limit(limit)
      .select('-__v')
      .exec();
  }

  async getMessages(supportRequestId: ID): Promise<Message[]> {
    // @ts-ignore
    return await this.SupportRequestModel.findById(supportRequestId)
      .select('-__v')
      .exec();
  }

  async sendMessage({
    text,
    author,
    supportRequest,
  }: SendMessageDto): Promise<any> {
    const newMessage = await new this.MessageModel({
      text,
      author: author,
      sentAt: new Date(),
    });
    console.log('newMessage', newMessage);
    const savedMessage = await newMessage.save();

    const messages = [{ _id: savedMessage._id }];
    console.log('messages', messages);
    const updated = await this.SupportRequestModel.findOneAndUpdate(
      { _id: supportRequest },
      {
        messages,
      },
    );

    console.log('updated SupportRequestModel', updated);

    this.messagesSubject.next({
      requestId: supportRequest as string,
      message: updated,
    });

    return updated;
  }

  // TODO Сокеты
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    return function () {};
  }
}
