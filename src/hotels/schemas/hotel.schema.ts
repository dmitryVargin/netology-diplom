import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemeBaseOptions } from '../../utils/constants';

export type HotelDocument = Hotel & Document;

@Schema({
  timestamps: true,
  ...SchemeBaseOptions,
})
export class Hotel {
  @Prop({ type: String, required: true, index: true })
  title: string;
  @Prop()
  description: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
