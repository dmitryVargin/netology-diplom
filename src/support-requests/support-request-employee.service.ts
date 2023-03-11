import { Injectable } from '@nestjs/common';
import {
  ISupportRequestEmployeeService,
  MarkMessagesAsReadDto,
} from './support-requests.interface';
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
    private SupportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private MessageModel: Model<MessageDocument>,
  ) {}
  async closeRequest(supportRequestId: ID): Promise<void> {
    const supportRequest = await this.SupportRequestModel.findOneAndUpdate(
      { _id: supportRequestId },
      { isActive: false },
    );
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

  async markMessagesAsRead({ user, createdBefore }: MarkMessagesAsReadDto) {
    const answer = await this.SupportRequestModel.find({
      _id: user,
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
