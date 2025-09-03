import { prisma } from '@/lib/prisma';
import { User } from '@/types';
import { Prisma } from '@prisma/client';

type UserFromDB = Prisma.UserGetPayload<Prisma.UserDefaultArgs>;

const transformUser = (user: UserFromDB): User => {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    address: user.address,
    phone: user.phone,
    website: user.website,
    company: user.company,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return { success: true, data: users.map(transformUser) };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";
    return { success: false, error: errorMessage, statusCode: 500 };
  }
};