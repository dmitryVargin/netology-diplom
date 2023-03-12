import { ID, SearchParams } from '../utils/types';
import { HotelRoom } from './schemas/hotel-room.schema';

export interface SearchRoomsParams extends SearchParams {
  hotel: ID;
  isEnabled?: boolean;
}

export interface HotelRoomService {
  create(
    data: Pick<HotelRoom, 'hotel' | 'isEnabled'> &
      Partial<Pick<HotelRoom, 'images' | 'description'>>,
  ): Promise<HotelRoom>;

  findById(id: ID): Promise<HotelRoom>;

  search(params: SearchRoomsParams): Promise<HotelRoom[]>;

  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
