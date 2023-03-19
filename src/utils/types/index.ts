import { ObjectId } from 'mongoose';

export type ID = string | ObjectId;

export type SearchParams = {
  limit?: number;
  offset?: number;
};

export type Roles = 'admin' | 'client' | 'manager';

export type RequestUser = {
  id: ID;
  role: Roles;
};

export type WithId<T> = T & { id: ID };
