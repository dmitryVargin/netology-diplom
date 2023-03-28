import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ISupportRequestEmployeeService,
  MarkMessagesAsReadDto,
} from './support-requests.interface';
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
  async closeRequest(supportRequestId: string): Promise<void> {
    const updated = this.supportRequestModel.findOneAndUpdate(
      { _id: supportRequestId },
      { isActive: false },
    );
    if (!updated) {
      throw new NotFoundException();
    }
  }

  async getUnreadCount(supportRequestId: string): Promise<number> {
    const supportRequest = await this.supportRequestModel
      .find({
        _id: supportRequestId,
        messages: [{ $match: { readAt: { $exists: false } } }],
      })
      .exec();
    return supportRequest.length;
  }

  async markMessagesAsRead({
    supportRequest,
    createdBefore,
    user,
  }: MarkMessagesAsReadDto) {
    const answer = await this.supportRequestModel
      .findOne({
        _id: supportRequest,
      })
      .exec();

    if (!answer) {
      throw new NotFoundException();
    }

    await this.messageModel.updateMany(
      {
        _id: { $in: answer.messages },
        author: user,
        sentAt: {
          $lt: createdBefore,
        },
        readAt: { $exists: false },
      },
      { readAt: createdBefore },
    );

    return {
      success: true,
    } as const;
  }
}
