import { ID, SearchParams, WithId } from '../utils/types';
import { Hotel } from './schemas/hotel.schema';

export type SearchHotelParams = SearchParams & {
  title?: string;
};

export type UpdateHotelParams = {
  title?: string;
  description?: string;
};
export type CreateHotelParams = {
  title: string;
  description?: string;
};

export interface IHotelService {
  create(params: CreateHotelParams): Promise<WithId<Hotel>>;
  findById(hotelId: ID): Promise<WithId<Hotel>>;
  search(params: SearchHotelParams): Promise<WithId<Hotel>[]>;
  update(hotelId: ID, params: UpdateHotelParams): Promise<WithId<Hotel>>;
}
