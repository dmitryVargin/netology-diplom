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
    private ReservationModel: Model<ReservationDocument>
  ) {}
  async addReservation(data: ReservationDto): Promise<Reservation> {
    return Promise.resolve(undefined);
  }

  async getReservations(
    filter: ReservationSearchOptions
  ): Promise<Array<Reservation>> {
    return this.ReservationModel.find(filter);
  }

  async findById(id: ID): Promise<Reservation> {
    return this.ReservationModel.findById(id).select('-__v');
  }

  async removeReservation(id: ID): Promise<void> {
    return this.ReservationModel.findOneAndRemove({ _id: id });
  }
}
