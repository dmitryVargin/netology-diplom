import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Message } from './messages.schemas';

export type SupportRequestDocument = SupportRequest & Document;

@Schema({ timestamps: true })
export class SupportRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Message',
  })
  messages: Message[];
  @Prop()
  isActive: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
