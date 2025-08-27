import { Prisma } from '@prisma/client';

// User interface matching the database schema
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Prisma.JsonValue;
  phone: string | null;
  website: string | null;
  company: Prisma.JsonValue | null;
  createdAt?: Date;
  updatedAt?: Date;
}
