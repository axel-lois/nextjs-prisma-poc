import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createPostSchema,
  validateInput,
} from "@/lib/validations";
import { Post } from "@/types";
import { getPosts } from "@/lib/data/posts";

// GET /api/posts - Retrieve all posts
export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json({ data: posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = validateInput(createPostSchema, body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    const { title, body: postBody, userId } = validationResult.data;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    return NextResponse.json(
      { data: transformedPost, message: "Post created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
