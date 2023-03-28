import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IHotelService,
  SearchHotelParams,
  CreateHotelParams,
  UpdateHotelParams,
} from './hotels.interface';
import { WithId } from '../utils/types';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import getNonEmptyFields from '../utils/getNonEmptyFields';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../utils/constants';
import { IsDefined, IsNumber, IsString } from 'class-validator';

export const hotelProjection = {
  title: 1,
  description: 1,
} as const;

class CreateUserDto {
  @IsNumber()
  @IsDefined()
  offset?: number;
  @IsNumber()
  @IsDefined()
  limit?: number;
  @IsString()
  @IsDefined()
  title?: string;
}

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(params: CreateHotelParams): Promise<WithId<Hotel>> {
    const hotel = new this.hotelModel(params);
    const { id, title, description } = await hotel.save();
    return { id, title, description };
  }

  search({
    limit = LIMIT_DEFAULT,
    offset = OFFSET_DEFAULT,
    title,
  }: CreateUserDto): Promise<WithId<Hotel>[]> {
    return this.hotelModel
      .find<WithId<Hotel>>(getNonEmptyFields({ title }), hotelProjection)
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findById(hotelId: string): Promise<WithId<Hotel>> {
    const hotel = await this.hotelModel.findById<WithId<Hotel>>(
      hotelId,
      hotelProjection,
    );

    if (!hotel) {
      throw new NotFoundException();
    }
    return hotel;
  }

  async update(
    hotelId: string,
    { title, description }: UpdateHotelParams,
  ): Promise<WithId<Hotel>> {
    const updatedHotel = await this.hotelModel
      .findByIdAndUpdate<WithId<Hotel>>(
        hotelId,
        {
          title,
          description,
        },
        { new: true, select: hotelProjection },
      )
      .exec();

    if (!updatedHotel) {
      throw new NotFoundException();
    }
    return updatedHotel;
  }
}
