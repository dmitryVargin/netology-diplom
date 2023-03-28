import { Hotel } from '../hotels/schemas/hotel.schema';
import { HotelRoom } from '../hotel-rooms/schemas/hotel-room.schema';

export type ManagerReservationSearchOptions = {
  userId: string;
  dateStart?: Date;
  dateEnd?: Date;
};
export type ClientReservationSearchOptions = {
  dateStart?: Date;
  dateEnd?: Date;
};
export type GetReservations = {
  userId: string;
  dateStart?: Date;
  dateEnd?: Date;
};

export type ReservationsResponse = {
  startDate: Date;
  endDate: Date;
  hotel: Hotel;
  hotelRoom: Pick<HotelRoom, 'description' | 'images'>;
};

export type AddClientReservation = {
  hotelRoom: string;
  dateStart: Date;
  dateEnd: Date;
};
export type AddReservationParams = {
  userId: string;
  hotelRoom: string;
  startDate: Date;
  endDate: Date;
};
export interface IReservation {
  addReservation(data: AddReservationParams): Promise<ReservationsResponse>;
  removeReservation(reservationId: string): Promise<void>;
  getReservations(filter: GetReservations): Promise<ReservationsResponse[]>;
}
