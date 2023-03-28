import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AddReservationParams,
  GetReservations,
  IReservation,
  ReservationsResponse,
} from './reservations.interface';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Hotel, HotelDocument } from '../hotels/schemas/hotel.schema';
import {
  HotelRoom,
  HotelRoomDocument,
} from '../hotel-rooms/schemas/hotel-room.schema';
import { WithId } from '../utils/types';

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async addReservation({
    userId,
    hotelRoom,
    startDate,
    endDate,
  }: AddReservationParams): Promise<ReservationsResponse> {
    const foundHotelRoom = await this.hotelRoomModel.findById<
      WithId<HotelRoom>
    >(hotelRoom);
    if (!foundHotelRoom) {
      throw new NotFoundException();
    }
    const { description, images, hotel: hotelId } = foundHotelRoom;
    const hotel = await this.hotelModel.findById<Hotel>(hotelId, {
      _id: 0,
      title: 1,
      description: 1,
    });

    if (!hotel) {
      throw new NotFoundException();
    }

    const reservation = new this.reservationModel({
      userId,
      hotelId,
      roomId: hotelRoom,
      dateStart: startDate,
      dateEnd: endDate,
    });

    await reservation.save();

    return {
      startDate,
      endDate,
      hotel,
      hotelRoom: {
        description,
        images,
      },
    };
  }

  async getReservationsNew(
    filter: GetReservations,
  ): Promise<ReservationsResponse[]> {
    return await this.reservationModel
      .aggregate([
        {
          $project: {
            hotelId: 1,
            userId: 1,
            roomId: 1,
            dateStart: 1,
            dateEnd: 1,
          },
        },
        {
          $match: {
            userId: new mongoose.Types.ObjectId(filter.userId),
          },
        },
        {
          $lookup: {
            from: 'hotels',
            localField: 'hotelId',
            foreignField: '_id',
            as: 'hotels',
          },
        },
        { $unwind: '$hotels' },
        {
          $lookup: {
            from: 'hotelrooms',
            localField: 'roomId',
            foreignField: '_id',
            as: 'hotelrooms',
          },
        },
        { $unwind: '$hotelrooms' },
        {
          $project: {
            _id: 0,
            id: '$_id',
            startDate: '$dateStart',
            endDate: '$dateEnd',
            hotel: {
              title: '$hotels.title',
              description: '$hotels.description',
            },
            hotelRoom: {
              images: '$hotelrooms.images',
              description: '$hotelrooms.description',
            },
          },
        },
      ])
      .exec();
  }

  async getReservations(
    filter: GetReservations,
  ): Promise<ReservationsResponse[]> {
    const reservations = await this.reservationModel.find(filter);

    const hotelIds = reservations.map(({ hotelId }) => hotelId);
    const roomIds = reservations.map(({ roomId }) => roomId);
    const hotels = await this.hotelModel.find(
      { _id: hotelIds },
      {
        title: 1,
        description: 1,
      },
    );

    const hotelRooms = await this.hotelRoomModel.find(
      { _id: roomIds },
      {
        description: 1,
        images: 1,
      },
    );

    return reservations.map(({ dateStart, dateEnd, hotelId, roomId, _id }) => {
      const currentHotel = hotels.find((hotel) => {
        return hotel._id.equals(hotelId);
      });
      const currentHotelRoom = hotelRooms.find((hotelRoom) =>
        hotelRoom._id.equals(roomId),
      );
      return {
        id: _id,
        startDate: dateStart,
        endDate: dateEnd,
        hotel: {
          title: currentHotel?.title || '',
          description: currentHotel?.description || '',
        },
        hotelRoom: {
          images: currentHotelRoom?.images || [],
          description: currentHotelRoom?.description || '',
        },
      };
    });
  }

  async removeReservation(id: string): Promise<void> {
    const removed = await this.reservationModel.findOneAndRemove({ _id: id });
    if (!removed) {
      throw new NotFoundException();
    }
  }
}
