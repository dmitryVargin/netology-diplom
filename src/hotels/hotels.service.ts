import { Injectable } from '@nestjs/common';
import {
  IHotelService,
  SearchHotelParams,
  UpdateHotelParams,
} from './hotels.interface';
import { ID } from '../utils/types';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>
  ) {}
  async create(data: any): Promise<Hotel> {
    const hotel = new this.HotelModel(data);
    return hotel.save();
  }

  async findById(id: ID): Promise<Hotel> {
    return this.HotelModel.findById(id).select('-__v');
  }

  async search({ limit, offset, title }: SearchHotelParams): Promise<Hotel[]> {
    return await this.HotelModel.find({ title })
      .skip(offset)
      .limit(limit)
      .select('-__v')
      .exec();
  }

  async update(id: ID, data: UpdateHotelParams): Promise<Hotel> {
    return this.HotelModel.findOneAndUpdate({ _id: id }, data);
  }
}
