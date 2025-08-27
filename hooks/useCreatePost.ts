import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { User } from '@/types';
import { apiClient } from '@/lib/axios';
import { usePosts } from './usePosts';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
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
  const { createPost, addRequestToQueue } = usePosts();
  const { setOnConfirm, onConfirmOpen, onConfirmClose } = useModal();
  const isOnline = useOnlineStatus();

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
    const postData = {
      ...data,
      userId: parseInt(data.userId, 10),
    };

    if (!isOnline) {
      addRequestToQueue({ type: 'create', data: postData });
      router.push('/posts');
      return;
    }

    setOnConfirm(() => async () => {
      try {
        await createPost(postData);
        router.push('/posts');
      } catch (err) {
        console.error(err);
      } finally {
        onConfirmClose();
      }
    });
    onConfirmOpen();
  }, [createPost, addRequestToQueue, isOnline, router, setOnConfirm, onConfirmOpen, onConfirmClose]);

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
