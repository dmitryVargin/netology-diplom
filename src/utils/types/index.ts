export type SearchParams = {
  limit?: number;
  offset?: number;
};

export type Roles = 'admin' | 'client' | 'manager';

export type RequestUser = {
  id: string;
  role: Roles;
};

export type WithId<T> = T & { id: string };
