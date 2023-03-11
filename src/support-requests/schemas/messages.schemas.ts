import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { User } from '../../users/schemas/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;
  @Prop({ required: true })
  sentAt: Date;
  @Prop({ required: true })
  text: string;
  @Prop()
  readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
