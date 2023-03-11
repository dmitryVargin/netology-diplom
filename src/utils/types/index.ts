import { ObjectId } from 'mongoose';

export type ID = string | ObjectId;

export type PaginationQuery = {
  limit?: number;
  offset?: number;
};

export type Roles = 'admin' | 'client' | 'manager';

export type RequestUser = {
  id: string;
  role: Roles;
};
