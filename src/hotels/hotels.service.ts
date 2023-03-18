import { Injectable } from '@nestjs/common';
import {
  IHotelService,
  SearchHotelParams,
  CreateHotelParams,
  UpdateHotelParams,
} from './hotels.interface';
import { ID } from '../utils/types';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(data: CreateHotelParams): Promise<Hotel> {
    const hotel = new this.hotelModel(data);
    const savedHotel = await hotel.save();
    const answer = await this.hotelModel.aggregate([
      { $match: { _id: savedHotel._id } },
      { $project: { _id: 0, id: '$_id', title: 1, description: 1 } },
    ]);
    return answer[0];
  }

  async findById(id: ID): Promise<Hotel> {
    return this.hotelModel.findById(id).select('-__v');
  }

  async search({
    limit = 100,
    offset = 0,
    title,
  }: SearchHotelParams): Promise<Hotel[]> {
    const aggregation: PipelineStage[] = [
      { $project: { _id: 0, id: '$_id', title: 1, description: 1 } },
    ];
    if (title) {
      aggregation.unshift({ $match: { title } });
    }

    return await this.hotelModel
      .aggregate(aggregation)
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async update(
    id: ID,
    { title, description }: UpdateHotelParams,
  ): Promise<Hotel> {
    const updatedHotel = await this.hotelModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
      },
      { upsert: true },
    );
    const ans = await this.hotelModel.aggregate([
      { $match: { _id: updatedHotel._id } },
      { $project: { _id: 0, id: '$_id', title: 1, description: 1 } },
    ]);
    return ans[0];
  }
}
