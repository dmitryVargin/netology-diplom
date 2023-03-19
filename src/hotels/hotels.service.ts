import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IHotelService,
  SearchHotelParams,
  CreateHotelParams,
  UpdateHotelParams,
} from './hotels.interface';
import { ID, WithId } from '../utils/types';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import getNonEmptyFields from '../utils/getNonEmptyFields';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../utils/constants';

export const hotelSelection = {
  _id: 0,
  id: '$_id',
  title: 1,
  description: 1,
} as const;

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(params: CreateHotelParams): Promise<WithId<Hotel>> {
    const hotel = new this.hotelModel(params);
    const { _id, title, description } = await hotel.save();
    return { id: _id, title, description };
  }

  search({
    limit = LIMIT_DEFAULT,
    offset = OFFSET_DEFAULT,
    title,
  }: SearchHotelParams): Promise<WithId<Hotel>[]> {
    return this.hotelModel
      .find(getNonEmptyFields({ title }))
      .skip(offset)
      .limit(limit)
      .select(hotelSelection)
      .exec() as Promise<WithId<Hotel>[]>;
  }

  async findById(hotelId: ID): Promise<WithId<Hotel>> {
    try {
      return (await this.hotelModel
        .findById(hotelId)
        .select(hotelSelection)) as WithId<Hotel>;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async update(
    hotelId: ID,
    { title, description }: UpdateHotelParams,
  ): Promise<WithId<Hotel>> {
    try {
      return (await this.hotelModel
        .findByIdAndUpdate(
          hotelId,
          {
            title,
            description,
          },
          { new: true },
        )
        .select(hotelSelection)
        .exec()) as WithId<Hotel>;
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
