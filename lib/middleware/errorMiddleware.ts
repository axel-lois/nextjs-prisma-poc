import { NextRequest, NextResponse } from "next/server";
import { internalErrorResponse } from './responseMiddleware';
import { RouteContext } from './requestMiddleware';

// Error handling middleware - wraps handlers with try/catch
export function withErrorHandling(
  handler: (request: NextRequest, context?: RouteContext) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: RouteContext) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error("API Error:", error);
      return internalErrorResponse("An unexpected error occurred");
    }
  };
}