import { NextRequest } from "next/server";
import { createPostSchema } from "@/lib/validations";
import { getAllPosts, createPost } from "@/services/postService";
import { 
  successResponse, 
  createdResponse, 
  notFoundResponse,
  withRequestValidation,
  withErrorHandling
} from "@/lib/middleware";

// GET /api/posts - Retrieve all posts
export const GET = withErrorHandling(async () => {
  const posts = await getAllPosts();
  return successResponse(posts);
});

// POST /api/posts - Create a new post (using explicit composition)
export const POST = withErrorHandling(
  withRequestValidation(
    createPostSchema,
    async (_: NextRequest, validatedData) => {
      const { title, body: postBody, userId } = validatedData;

      const result = await createPost({
        title,
        body: postBody,
        userId,
      });

      if (!result.success) {
        if (result.statusCode === 404) {
          return notFoundResponse(result.error);
        }
        throw new Error(result.error);
      }

      return createdResponse(result.data, "Post created successfully");
    }
  )
);
