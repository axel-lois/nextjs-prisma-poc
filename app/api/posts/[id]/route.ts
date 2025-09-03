import { NextRequest } from "next/server";
import { updatePostSchema } from "@/lib/validations";
import { getPostById, updatePost, deletePost } from "@/services/postService";
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

    const post = await getPostById(postId);

    if (!post) {
      return notFoundResponse("Post not found");
    }

    return successResponse(post);
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

      const result = await updatePost(postId, {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.body && { body: validatedData.body }),
      });

      if (!result.success) {
        if (result.statusCode === 404) {
          return notFoundResponse(result.error);
        }
        throw new Error(result.error);
      }

      return successResponse(result.data, "Post updated successfully");
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

    const result = await deletePost(postId);

    if (!result.success) {
      if (result.statusCode === 404) {
        return notFoundResponse(result.error);
      }
      throw new Error(result.error);
    }

    return noContentResponse("Post deleted successfully");
  }
);
