import { getAllUsers } from '@/services/userService';
import { successResponse, withErrorHandling } from '@/lib/middleware';

// GET /api/users - Retrieve all users
export const GET = withErrorHandling(async () => {
  const result = await getAllUsers();

  if (!result.success) {
    throw new Error(result.error);
  }

  return successResponse(result.data);
});
