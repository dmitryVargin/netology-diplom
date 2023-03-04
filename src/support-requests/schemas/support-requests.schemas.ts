import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Hotel } from '../../hotels/schemas/hotel.schema';
import { User } from '../../users/schemas/user.schema';
import { Message } from './messages.schemas';

export type SupportRequestDocument = Hotel & Document;

@Schema({ timestamps: true })
export class SupportRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop()
  description: string;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Message',
  })
  messages: Message[];
  @Prop()
  isActive: true;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
