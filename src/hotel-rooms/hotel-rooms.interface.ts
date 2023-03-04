import { ID } from '../utils/types';
import { HotelRoom } from './schemas/hotel-room.schema';

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: ID;
  isEnabled?: boolean;
}

export interface HotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;

  findById(id: ID): Promise<HotelRoom>;

  search(params: SearchRoomsParams): Promise<HotelRoom[]>;

  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
