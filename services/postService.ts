import { prisma } from "@/lib/prisma";
import { Post } from "@/types";
import { Prisma } from '@prisma/client';

export interface CreatePostData {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostData {
  title?: string;
  body?: string;
}

const postWithUserArgs = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: { user: true },
});

type PostWithUser = Prisma.PostGetPayload<typeof postWithUserArgs>;

const transformPost = (post: PostWithUser): Post => {
  return {
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
  };
};

export const getAllPosts = async (): Promise<Post[]> => {
  const posts = await prisma.post.findMany({
    ...postWithUserArgs,
    orderBy: { createdAt: 'desc' },
  });

  return posts.map(transformPost);
};

export const getPostById = async (id: number): Promise<Post | null> => {
  const post = await prisma.post.findUnique({
    where: { id },
    ...postWithUserArgs,
  });

  return post ? transformPost(post) : null;
};

export const createPost = async (data: CreatePostData) => {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!userExists) {
      return { success: false, error: "User not found", statusCode: 404 };
    }

    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        body: data.body,
        userId: data.userId,
      },
      ...postWithUserArgs,
    });

    return { success: true, data: transformPost(newPost) };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create post";
    return { success: false, error: errorMessage, statusCode: 500 };
  }
};

export const updatePost = async (id: number, data: UpdatePostData) => {
  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return { success: false, error: "Post not found", statusCode: 404 };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.body && { body: data.body }),
      },
      ...postWithUserArgs,
    });

    return { success: true, data: transformPost(updatedPost) };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update post";
    return { success: false, error: errorMessage, statusCode: 500 };
  }
};

export const deletePost = async (id: number) => {
  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return { success: false, error: "Post not found", statusCode: 404 };
    }

    await prisma.post.delete({
      where: { id },
    });

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete post";
    return { success: false, error: errorMessage, statusCode: 500 };
  }
};