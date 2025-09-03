import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/lib/validations";
import { Post } from "@/types";
import { getPosts } from "@/lib/data/posts";
import { 
  successResponse, 
  createdResponse, 
  notFoundResponse,
  withRequestValidation,
  withErrorHandling
} from "@/lib/middleware";

// GET /api/posts - Retrieve all posts
export const GET = withErrorHandling(async () => {
  const posts = await getPosts();
  return successResponse(posts);
});

// POST /api/posts - Create a new post (using explicit composition)
export const POST = withErrorHandling(
  withRequestValidation(
    createPostSchema,
    async (_: NextRequest, validatedData) => {
    const { title, body: postBody, userId } = validatedData;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return notFoundResponse("User not found");
    }

    // Create the post
    const newPost = await prisma.post.create({
      data: {
        title,
        body: postBody,
        userId,
      },
      include: {
        user: true,
      },
    });

    // Transform the response
    const transformedPost: Post = {
      id: newPost.id,
      title: newPost.title,
      body: newPost.body,
      userId: newPost.userId,
      user: newPost.user,
      createdAt: newPost.createdAt,
      updatedAt: newPost.updatedAt,
    };

    return createdResponse(transformedPost, "Post created successfully");
    }
  )
);
