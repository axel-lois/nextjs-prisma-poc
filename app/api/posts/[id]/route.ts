import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { updatePostSchema } from "@/lib/validations";
import { Post } from "@/types";
import { 
  successResponse, 
  badRequestResponse,
  notFoundResponse,
  noContentResponse,
  validatePathParam,
  withRequestValidation,
  withErrorHandling,
  RouteContext
} from "@/lib/middleware";

// GET /api/posts/[id] - Get a single post
export const GET = withErrorHandling(
  async (_: NextRequest, context?: RouteContext) => {
    if (!context?.params) {
      return badRequestResponse("Missing route parameters");
    }
    const resolvedParams = await context.params;
    const postId = validatePathParam(resolvedParams.id);

    if (postId === null) {
      return badRequestResponse("Invalid post ID");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { user: true },
    });

    if (!post) {
      return notFoundResponse("Post not found");
    }

    // Transform the response
    const transformedPost: Post = {
      id: post.id,
      title: post.title,
      body: post.body,
      userId: post.userId,
      user: post.user,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return successResponse(transformedPost);
  }
);

// PATCH /api/posts/[id] - Update a post
export const PATCH = withErrorHandling(
  withRequestValidation(
    updatePostSchema,
    async (_: NextRequest, validatedData, context?: RouteContext) => {
    if (!context?.params) {
      return badRequestResponse("Missing route parameters");
    }
    const resolvedParams = await context.params;
    const postId = validatePathParam(resolvedParams.id);

    if (postId === null) {
      return badRequestResponse("Invalid post ID");
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return notFoundResponse("Post not found");
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.body && { body: validatedData.body }),
      },
      include: { user: true },
    });

    // Transform the response
    const transformedPost: Post = {
      id: updatedPost.id,
      title: updatedPost.title,
      body: updatedPost.body,
      userId: updatedPost.userId,
      user: updatedPost.user,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };

    return successResponse(transformedPost, "Post updated successfully");
    }
  )
);

// DELETE /api/posts/[id] - Delete a post
export const DELETE = withErrorHandling(
  async (_: NextRequest, context?: RouteContext) => {
    if (!context?.params) {
      return badRequestResponse("Missing route parameters");
    }
    const resolvedParams = await context.params;
    const postId = validatePathParam(resolvedParams.id);

    if (postId === null) {
      return badRequestResponse("Invalid post ID");
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return notFoundResponse("Post not found");
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    return noContentResponse("Post deleted successfully");
  }
);
