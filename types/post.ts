import { User } from './user';

// Post interface matching the database schema
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
}
