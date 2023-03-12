import { ID, SearchParams } from '../utils/types';
import { Hotel } from './schemas/hotel.schema';

export interface SearchHotelParams extends SearchParams {
  title?: string;
}

export interface UpdateHotelParams {
  title?: string;
  description?: string;
}
export interface CreateHotelParams {
  title: string;
  description?: string;
}

export interface IHotelService {
  create(data: CreateHotelParams): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}
