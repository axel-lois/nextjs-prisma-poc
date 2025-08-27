import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Shammelesly copied from internet :)

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Singleton pattern implementation for Prisma Client
class PrismaSingleton {
  private static instance: PrismaClient;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return PrismaSingleton.instance;
  }
}

// Export the singleton instance
export const prisma = globalForPrisma.prisma || PrismaSingleton.getInstance();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Utility function to handle Prisma errors
export function handlePrismaError(error: unknown): string {
  const prismaError = error as { code?: string };
  
  if (prismaError.code === 'P2002') {
    return 'A record with this unique value already exists.';
  }
  if (prismaError.code === 'P2025') {
    return 'Record not found.';
  }
  if (prismaError.code === 'P2003') {
    return 'Foreign key constraint failed.';
  }
  if (prismaError.code === 'P2014') {
    return 'The change you are trying to make would violate a required relation.';
  }

  return 'An unexpected database error occurred.';
}
