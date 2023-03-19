import { ID, SearchParams, WithId } from '../utils/types';
import { HotelRoom } from './schemas/hotel-room.schema';
import { Hotel } from '../hotels/schemas/hotel.schema';

export type SearchHotelRoomParams = SearchParams & {
  hotel: ID;
  isEnabled?: boolean;
};
export type CreateHotelRoomParams = {
  hotelId: ID;
  description: string;
  images: string[];
};

export type UpdateHotelRoomParams = {
  hotelId: string;
  description?: string;
  images?: File[];
  isEnabled?: boolean;
};
export type HotelRoomSearchResponse = Omit<
  WithId<HotelRoom>,
  'isEnabled' | 'hotel'
> & { hotel: WithId<Pick<Hotel, 'title'>> };

export type HotelRoomByIdResponse = Omit<
  WithId<HotelRoom>,
  'isEnabled' | 'hotel'
> & { hotel: WithId<Hotel> };

export type HotelRoomCreateUpdateResponse = Omit<WithId<HotelRoom>, 'hotel'> & {
  hotel: WithId<Hotel>;
};

export interface HotelRoomService {
  create(params: CreateHotelRoomParams): Promise<HotelRoomCreateUpdateResponse>;

  findById(hotelRoomId: ID): Promise<HotelRoomByIdResponse>;

  search(params: SearchHotelRoomParams): Promise<HotelRoomSearchResponse[]>;

  update(
    hotelRoomId: ID,
    params: UpdateHotelRoomParams,
  ): Promise<HotelRoomCreateUpdateResponse>;
}
