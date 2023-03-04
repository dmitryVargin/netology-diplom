import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema({ timestamps: true })
export class Hotel {
  @Prop({ type: String, required: true, index: true })
  title: string;
  @Prop()
  description: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
