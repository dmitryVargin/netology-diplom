import { Injectable } from '@nestjs/common';
import {
  CreateSupportRequestDto,
  CreateSupportRequestResponse,
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
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async createSupportRequest({
    text,
    user,
  }: CreateSupportRequestDto): Promise<CreateSupportRequestResponse> {
    const messageSentAt = new Date();
    const message = new this.messageModel({
      author: user,
      text,
      sentAt: messageSentAt,
    });
    await message.save();
    const supportRequest = new this.supportRequestModel({
      user,
      messages: [message],
    });
    const created = await supportRequest.save();

    return {
      id: created._id,
      createdAt: messageSentAt,
      isActive: true,
      hasNewMessages: false,
    };
  }

  async getUnreadCount(supportRequestId: ID): Promise<Message[]> {
    const supportRequest = await this.supportRequestModel
      .find({
        _id: supportRequestId,
        messages: [{ $match: { readAt: { $exists: false } } }],
      })
      .select('-__v')
      .exec();
    // @ts-ignore
    return supportRequest;
  }

  // Работает
  // @ts-ignore
  async markMessagesAsRead({ id, createdBefore }) {
    const answer = await this.supportRequestModel
      .findOne({
        _id: id,
      })
      .exec();

    await this.messageModel.updateMany(
      {
        _id: { $in: answer.messages },
        sentAt: {
          $lt: createdBefore,
        },
        readAt: { $exists: false },
      },
      { readAt: createdBefore },
    );

    return {
      success: true,
    };
  }
}
