import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Hotel } from '../../hotels/schemas/hotel.schema';
import { SchemeBaseOptions } from '../../utils/constants';

export type HotelRoomDocument = HotelRoom & Document;

@Schema({ timestamps: true, ...SchemeBaseOptions })
export class HotelRoom {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true })
  hotel: Hotel;
  @Prop()
  description: string;
  @Prop({ type: [String], default: [] })
  images: string[];
  @Prop({ default: true, required: true })
  isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
