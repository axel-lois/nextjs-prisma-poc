import { z } from 'zod';

// Post validation schemas
export const createPostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  body: z.string()
    .min(1, 'Body is required')
    .max(5000, 'Body must be less than 5000 characters')
    .trim(),
  userId: z.number()
    .int('User ID must be an integer')
    .positive('User ID must be positive'),
});

export const updatePostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim()
    .optional(),
  body: z.string()
    .min(1, 'Body is required')
    .max(5000, 'Body must be less than 5000 characters')
    .trim()
    .optional(),
});

// Pagination validation schema
export const paginationSchema = z.object({
  page: z.string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
  limit: z.string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().max(1000)),
});

// Type exports
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

// Validation helper function
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
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
