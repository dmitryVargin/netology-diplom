import { Injectable } from '@nestjs/common';
import {
  CreateSupportRequestDto,
  ISupportRequestClientService,
  MarkMessagesAsReadDto,
} from './support-requests.interface';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-requests.schemas';
import { ID } from '../utils/types';
import { Message, MessageDocument } from './schemas/messages.schemas';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from '../hotels/schemas/hotel.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class SupportRequestsClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private MessageModel: Model<MessageDocument>,
  ) {}

  async createSupportRequest({
    text,
    user,
  }: CreateSupportRequestDto): Promise<SupportRequest> {
    const newSupportRequest = new this.SupportRequestModel({
      user,
      isActive: true,
    });

    const savedSupportRequest = await newSupportRequest.save();
    console.log(898, savedSupportRequest);
    const newMessage = await new this.MessageModel({
      text,
      author: user,
      sentAt: new Date(),
    });
    console.log('newMessage', newMessage);
    const savedMessage = await newMessage.save();
    console.log('savedMessage', savedMessage);
    const messages = [{ _id: savedMessage._id }];
    console.log('messages', messages);
    const updated = await this.SupportRequestModel.findOneAndUpdate(
      { _id: savedSupportRequest._id },
      {
        messages,
      },
    );

    console.log('updated savedSupportRequest', updated);

    return updated;
  }

  async getUnreadCount(supportRequestId: ID): Promise<Message[]> {
    const supportRequest = await this.SupportRequestModel.find({
      _id: supportRequestId,
      messages: [{ $match: { readAt: { $exists: false } } }],
    })
      .select('-__v')
      .exec();
    // @ts-ignore
    return supportRequest;
  }

  // @ts-ignore
  async markMessagesAsRead({ id, createdBefore }) {
    const answer = await this.SupportRequestModel.find({
      _id: id,
    }).exec();
    let messages = answer[0].messages;
    // @ts-ignore
    messages = messages.map((mess) => mess.id);
    await this.MessageModel.updateMany(
      {
        _id: { $in: messages },
        readAt: { $exists: false },
      },
      { readAt: createdBefore },
    );
    return {
      success: true,
    };
  }
}
