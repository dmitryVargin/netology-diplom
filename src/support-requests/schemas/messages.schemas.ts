import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Hotel } from '../../hotels/schemas/hotel.schema';
import { User } from '../../users/schemas/user.schema';

export type MessageDocument = Hotel & Document;

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
