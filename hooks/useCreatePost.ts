import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { User } from '@/types';
import { apiClient } from '@/lib/axios';
import { usePosts } from './usePosts';
import { useModal } from '@/contexts/ModalContext';
import { API_ENDPOINTS } from '@/constants';
import { useQuery } from '@tanstack/react-query';

interface CreatePostForm {
  title: string;
  body: string;
  userId: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<{ data: User[] }>(API_ENDPOINTS.USERS);
  return response.data.data;
};

export function useCreatePost() {
  const router = useRouter();
  const { createPost } = usePosts();
  const { setOnConfirm, onConfirmOpen, onConfirmClose } = useModal();

  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostForm>({
    defaultValues: {
      title: '',
      body: '',
      userId: '',
    },
  });

  // Handle form submission
  const onSubmit = useCallback(async (data: CreatePostForm) => {
    setOnConfirm(() => async () => {
      try {
        await createPost({
          ...data,
          userId: parseInt(data.userId, 10),
        });
        router.push('/posts');
      } catch (err) {
        console.error(err);
      } finally {
        onConfirmClose();
      }
    });
    onConfirmOpen();
  }, [createPost, router, setOnConfirm, onConfirmOpen, onConfirmClose]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.push('/posts');
  }, [router]);

  return {
    users: users || [],
    isLoadingUsers,
    isSubmitting,
    error: usersError,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    handleBack,
    watch,
  };
}
