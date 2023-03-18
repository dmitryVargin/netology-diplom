import { Injectable } from '@nestjs/common';
import {
  CreateSupportRequestDto,
  CreateSupportRequestResponse,
  ISupportRequestClientService,
} from './support-requests.interface';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-requests.schemas';
import { ID } from '../utils/types';
import { Message, MessageDocument } from './schemas/messages.schemas';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

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

  async getUnreadCount(supportRequestId: ID): Promise<number> {
    const supportRequest = await this.supportRequestModel.findById(
      supportRequestId,
    );
    const messages = await this.messageModel.find({
      _id: supportRequest.messages,
    });

    return messages.filter((message) => message?.readAt === undefined).length;
  }

  async markMessagesAsRead({ supportRequest, createdBefore }) {
    const answer = await this.supportRequestModel
      .findOne({
        _id: supportRequest,
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
