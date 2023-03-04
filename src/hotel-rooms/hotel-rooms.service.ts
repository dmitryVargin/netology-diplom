import { Injectable } from '@nestjs/common';
import { HotelRoomService, SearchRoomsParams } from './hotel-rooms.interface';
import { HotelRoom } from './schemas/hotel-room.schema';
import { ID } from '../utils/types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HotelRoomsService implements HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private HotelRoomModel: Model<HotelRoom>
  ) {}

  async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    const hotelRoom = new this.HotelRoomModel(data);
    return hotelRoom.save();
  }

  async findById(id: ID): Promise<HotelRoom> {
    return this.HotelRoomModel.findById(id).select('-__v');
  }

  search({
    limit,
    offset,
    hotel,
    isEnabled,
  }: SearchRoomsParams): Promise<HotelRoom[]> {
    console.log('HotelRoomModel search', isEnabled);
    return this.HotelRoomModel.find({
      hotel,
      ...(isEnabled && { isEnabled }),
    })
      .skip(offset)
      .limit(limit)
      .select('-__v')
      .exec();
  }

  async update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom> {
    return this.HotelRoomModel.findOneAndUpdate({ _id: id }, data);
  }
}
