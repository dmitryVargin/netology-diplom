import { Injectable } from '@nestjs/common';
import {
  IReservation,
  ReservationDto,
  ReservationSearchOptions,
} from './reservations.interface';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { ID } from '../utils/types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async addReservation({
    user,
    ...data
  }: ReservationDto & { user: ID }): Promise<Reservation> {
    const reservation = new this.reservationModel({ userId: user, ...data });
    return reservation.save();
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    return this.reservationModel.find(filter);
  }

  async findByUserId(id: ID): Promise<Reservation[]> {
    // TODO проверить
    return this.reservationModel.find({ userId: id });
  }

  async removeReservation(id: ID): Promise<void> {
    return this.reservationModel.findOneAndRemove({ _id: id });
  }
}
