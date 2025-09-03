import { prisma } from '@/lib/prisma';
import { User } from '@/types';
import { successResponse, withErrorHandling } from '@/lib/middleware';

// GET /api/users - Retrieve all users
export const GET = withErrorHandling(async () => {
  // Fetch all users
  const users = await prisma.user.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  // Transform the data to match our interfaces
  const transformedUsers: User[] = users.map((user) => ({
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
  }));

  return successResponse(transformedUsers);
});
