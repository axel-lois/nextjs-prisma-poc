import { prisma } from '@/lib/prisma';
import { Post } from '@/types';
import { Prisma } from '@prisma/client';

const postWithUserArgs = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: { user: true },
});

type PostWithUser = Prisma.PostGetPayload<typeof postWithUserArgs>;

export async function getPosts() {
  const posts: PostWithUser[] = await prisma.post.findMany({
    ...postWithUserArgs,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const transformedPosts: Post[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    userId: post.userId,
    user: post.user ? {
      id: post.user.id,
      name: post.user.name,
      username: post.user.username,
      email: post.user.email,
      address: post.user.address,
      phone: post.user.phone,
      website: post.user.website,
      company: post.user.company,
      createdAt: post.user.createdAt,
      updatedAt: post.user.updatedAt,
    } : undefined,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));

  return transformedPosts;
}
