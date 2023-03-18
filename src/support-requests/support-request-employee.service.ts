import { Injectable } from '@nestjs/common';
import { ISupportRequestEmployeeService } from './support-requests.interface';
import { ID } from '../utils/types';
import { Message, MessageDocument } from './schemas/messages.schemas';
import { InjectModel } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support-requests.schemas';
import { Model } from 'mongoose';

@Injectable()
export class SupportRequestsEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}
  async closeRequest(supportRequestId: ID): Promise<void> {
    this.supportRequestModel.findOneAndUpdate(
      { _id: supportRequestId },
      { isActive: false },
    );
  }

  async getUnreadCount(supportRequestId: ID): Promise<number> {
    const supportRequest = await this.supportRequestModel
      .find({
        _id: supportRequestId,
        messages: [{ $match: { readAt: { $exists: false } } }],
      })
      .select('-__v')
      .exec();
    return supportRequest.length;
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
