import { Injectable } from '@nestjs/common';
import {
  IReservation,
  ReservationDto,
  ReservationSearchOptions,
} from './reservations.interface';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { ID } from '../utils/types';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}
  // Работает

  async addReservation({
    // @ts-ignore
    user,
    ...data
  }: ReservationDto): Promise<Reservation> {
    const reservation = new this.reservationModel({ userId: user, ...data });
    return reservation.save();
  }
  // Работает
  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    return this.reservationModel.find(filter);
  }

  async findByUserId(id: ID): Promise<Reservation> {
    // @ts-ignore
    return this.reservationModel.find();
  }

  async removeReservation(id: ID): Promise<void> {
    return this.reservationModel.findOneAndRemove({ _id: id });
  }
}
