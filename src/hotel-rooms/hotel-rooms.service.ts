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
import { WithId } from '../utils/types';
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

    const hotel = await this.hotelModel
      .findById<WithId<Hotel>>(params.hotelId, hotelProjection)
      .exec();

    if (!hotel) {
      throw new NotFoundException();
    }

    const { id, description, images } = await createdRoom.save();

    return { id, hotel, description, images, isEnabled: true };
  }

  async search({
    limit = LIMIT_DEFAULT,
    offset = OFFSET_DEFAULT,
    hotel,
    isEnabled,
  }: SearchHotelRoomParams): Promise<HotelRoomSearchResponse[]> {
    const hotelRoom = await this.hotelRoomModel
      .find<WithId<HotelRoom>>({
        hotel,
        isEnabled,
      })
      .skip(offset)
      .limit(limit);

    const foundHotel = await this.hotelModel.findById<
      WithId<Pick<Hotel, 'title'>>
    >(hotel, {
      title: 1,
    });

    if (!foundHotel) {
      throw new NotFoundException();
    }
    return hotelRoom.map((hotelRoom) => ({
      id: hotelRoom.id,
      description: hotelRoom.description,
      images: hotelRoom.images,
      hotel: foundHotel,
    }));
  }

  async findById(hotelRoomId: string): Promise<HotelRoomByIdResponse> {
    const foundHotelRoom = await this.hotelRoomModel.findById<
      WithId<HotelRoom>
    >(hotelRoomId);

    if (!foundHotelRoom) {
      throw new NotFoundException();
    }
    const { id, description, images, hotel } = foundHotelRoom;

    const foundHotel = await this.hotelModel.findById<WithId<Hotel>>(hotel, {
      title: 1,
      description: 1,
    });

    if (!foundHotel) {
      throw new NotFoundException();
    }
    return { id, description, images, hotel: foundHotel };
  }

  async update(
    hotelRoomId: string,
    params: UpdateHotelRoomParams,
  ): Promise<HotelRoomCreateUpdateResponse> {
    const updatedHotelRoom = await this.hotelRoomModel.findByIdAndUpdate(
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
    );
    if (!updatedHotelRoom) {
      throw new NotFoundException();
    }
    const { description, images, isEnabled, hotel: hotelId } = updatedHotelRoom;

    const hotel = await this.hotelModel
      .findById<WithId<Hotel>>(hotelId, hotelProjection)
      .exec();

    if (!hotel) {
      throw new NotFoundException();
    }
    return { id: hotelRoomId, hotel, description, images, isEnabled };
  }
}
