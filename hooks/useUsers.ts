'use client';

import { useQuery } from '@tanstack/react-query';
import { User } from '@/types';
import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';

const fetchUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<{ data: User[] }>(API_ENDPOINTS.USERS);
  return response.data.data;
};

export function useUsers() {
  const { data: users, isLoading: isLoadingUsers, error } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return { users: users || [], isLoadingUsers, error };
}
