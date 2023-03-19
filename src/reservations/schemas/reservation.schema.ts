import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Hotel } from '../../hotels/schemas/hotel.schema';
import { User } from '../../users/schemas/user.schema';
import { HotelRoom } from '../../hotel-rooms/schemas/hotel-room.schema';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' })
  hotelId: Hotel;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'HotelRoom' })
  roomId: HotelRoom;
  @Prop({ required: true })
  dateStart: Date;
  @Prop({ required: true })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
