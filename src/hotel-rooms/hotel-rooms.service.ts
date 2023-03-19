import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateHotelRoomParams,
  HotelRoomByIdResponse,
  HotelRoomCreateUpdateResponse,
  HotelRoomSearchResponse,
  HotelRoomService,
  SearchHotelRoomParams,
  UpdateHotelRoomParams,
} from './hotel-rooms.interface';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import { ID, WithId } from '../utils/types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../utils/constants';
import { Hotel, HotelDocument } from '../hotels/schemas/hotel.schema';
import { hotelProjection } from '../hotels/hotels.service';

@Injectable()
export class HotelRoomsService implements HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(
    params: CreateHotelRoomParams,
  ): Promise<HotelRoomCreateUpdateResponse> {
    const createdRoom = new this.hotelRoomModel({
      hotel: params.hotelId,
      description: params.description,
      images: params.images,
      isEnabled: true,
    });

    const {
      _id,
      hotel: hotelId,
      description,
      images,
    } = await createdRoom.save();

    const hotel = (await this.hotelModel
      .findById(hotelId, hotelProjection)
      .exec()) as WithId<Hotel>;

    return { id: _id, hotel, description, images, isEnabled: true };
  }

  async search({
    limit = LIMIT_DEFAULT,
    offset = OFFSET_DEFAULT,
    hotel,
    isEnabled,
  }: SearchHotelRoomParams): Promise<HotelRoomSearchResponse[]> {
    const hotelRoom = await this.hotelRoomModel
      .find({
        hotel,
        isEnabled,
      })
      .skip(offset)
      .limit(limit);

    const foundHotel = (await this.hotelModel.findById(hotel, {
      _id: 0,
      id: '$_id',
      title: 1,
    })) as WithId<Pick<Hotel, 'title'>>;

    return hotelRoom.map((hotelRoom) => ({
      id: hotelRoom.id,
      description: hotelRoom.description,
      images: hotelRoom.images,
      hotel: foundHotel,
    }));
  }

  async findById(hotelRoomId: ID): Promise<HotelRoomByIdResponse> {
    try {
      // TODO откуда тут null вообще
      const { _id, description, images, hotel } =
        (await this.hotelRoomModel.findById(hotelRoomId)) as HotelRoomDocument;

      const foundHotel = (await this.hotelModel.findById(hotel, {
        _id: 0,
        id: '$_id',
        title: 1,
        description: 1,
      })) as WithId<Hotel>;

      return { id: _id, description, images, hotel: foundHotel };
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async update(
    hotelRoomId: ID,
    params: UpdateHotelRoomParams,
  ): Promise<HotelRoomCreateUpdateResponse> {
    try {
      const {
        description,
        images,
        isEnabled,
        hotel: hotelId,
      } = (await this.hotelRoomModel.findByIdAndUpdate(
        hotelRoomId,
        {
          description: params.description,
          hotel: params.hotelId,
          images: params.images,
          isEnabled: params.isEnabled,
        },
        {
          new: true,
        },
      )) as HotelRoomDocument;

      const hotel = (await this.hotelModel
        .findById(hotelId, hotelProjection)
        .exec()) as WithId<Hotel>;

      return { id: hotelRoomId, hotel, description, images, isEnabled };
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
