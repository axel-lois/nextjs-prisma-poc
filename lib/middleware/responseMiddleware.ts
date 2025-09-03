import { NextResponse } from "next/server";

// Standard API response interface
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

// Response standardization utility
function createResponse<T>(
  data: T | null = null,
  message: string | null = null,
  error: string | null = null,
  status: number = 200
): NextResponse {
  const response: ApiResponse<T> = {};

  if (data !== null) response.data = data;
  if (message) response.message = message;
  if (error) response.error = error;

  return NextResponse.json(response, { status });
}

// Success response helpers
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  return createResponse(data, message, null, status);
}

export function createdResponse<T>(
  data: T,
  message: string = "Resource created successfully"
): NextResponse {
  return createResponse(data, message, null, 201);
}

export function noContentResponse(
  message: string = "Operation completed successfully"
): NextResponse {
  return createResponse(null, message, null, 200);
}

// Error response helpers
export function badRequestResponse(error: string): NextResponse {
  return createResponse(null, null, error, 400);
}

export function notFoundResponse(error: string = "Resource not found"): NextResponse {
  return createResponse(null, null, error, 404);
}

export function internalErrorResponse(error: string = "Internal server error"): NextResponse {
  return createResponse(null, null, error, 500);
}

