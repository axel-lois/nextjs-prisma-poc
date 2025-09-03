import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { badRequestResponse } from './responseMiddleware';

// Type for dynamic route context
export type RouteContext = {
  params?: Promise<{ [key: string]: string }>;
};

// Validation result type
type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Enhanced validation helper with detailed error formatting
function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((issue) => {
        const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
        return `${path}${issue.message}`;
      });
      return { success: false, error: errorMessages.join(', ') };
    }
    return { success: false, error: 'Invalid input data' };
  }
}

// Request validation middleware - handles validation only
export function withRequestValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (
    request: NextRequest,
    validatedData: T,
    context?: RouteContext
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: RouteContext) => {
    const body = await request.json();
    const validationResult = validateInput(schema, body);

    if (!validationResult.success) {
      return badRequestResponse(validationResult.error);
    }

    return await handler(request, validationResult.data, context);
  };
}

// Path parameter validation helper
export function validatePathParam(param: string): number | null {
  const id = parseInt(param, 10);
  return isNaN(id) ? null : id;
}

