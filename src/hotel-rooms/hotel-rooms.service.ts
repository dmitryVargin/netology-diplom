import { Injectable } from '@nestjs/common';
import { HotelRoomService, SearchRoomsParams } from './hotel-rooms.interface';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import { ID } from '../utils/types';
import mongoose, { Model, Schema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HotelRoomsService implements HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async create({
    description,
    hotel,
    images,
    isEnabled,
  }: Pick<HotelRoom, 'hotel' | 'isEnabled'> &
    Partial<Pick<HotelRoom, 'images' | 'description'>>): Promise<HotelRoom> {
    const createdRoom = new this.hotelRoomModel({
      description,
      hotel,
      images,
      isEnabled,
    });
    const savedRoom = await createdRoom.save();
    return savedRoom;
  }

  async findById(id: ID): Promise<HotelRoom> {
    return this.hotelRoomModel.findById(id).select('-__v');
  }

  async search({
    limit = 100,
    offset = 0,
    hotel,
    isEnabled,
  }: SearchRoomsParams): Promise<HotelRoom[]> {
    return this.hotelRoomModel
      .find({
        hotel,
        isEnabled,
      })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom> {
    return this.hotelRoomModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
  }
}
