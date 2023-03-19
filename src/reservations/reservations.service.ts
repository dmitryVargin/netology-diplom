import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AddReservationParams,
  GetReservations,
  IReservation,
  ReservationsResponse,
} from './reservations.interface';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { ID } from '../utils/types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument } from '../hotels/schemas/hotel.schema';
import {
  HotelRoom,
  HotelRoomDocument,
} from '../hotel-rooms/schemas/hotel-room.schema';

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
    const {
      description,
      images,
      hotel: hotelId,
    } = await this.hotelRoomModel.findById(hotelRoom);

    const hotel = await this.hotelModel.findById(hotelId, {
      _id: 0,
      title: 1,
      description: 1,
    });

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
          title: currentHotel.title,
          description: currentHotel.description,
        },
        hotelRoom: {
          images: currentHotelRoom.images,
          description: currentHotelRoom.description,
        },
      };
    });
  }

  async removeReservation(id: ID): Promise<void> {
    try {
      await this.reservationModel.findOneAndRemove({ _id: id });
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
