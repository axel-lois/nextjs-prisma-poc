import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { User } from '@/types';

// GET /api/users - Retrieve all users
export async function GET() {
  try {
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

    return NextResponse.json({ data: transformedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
