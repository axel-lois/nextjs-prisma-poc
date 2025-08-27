import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { usePosts } from "./usePosts";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useModal } from "@/contexts/ModalContext";
import { useUsers } from "./useUsers";

interface CreatePostForm {
  title: string;
  body: string;
  userId: string;
}

export function useCreatePost() {
  const { createPost, addRequestToQueue } = usePosts();
  const { closeModal } = useModal();
  const isOnline = useOnlineStatus();
  const { users, isLoadingUsers } = useUsers();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostForm>({
    defaultValues: {
      title: "",
      body: "",
      userId: "",
    },
  });

  // Handle form submission
  const onSubmit = useCallback(
    async (data: CreatePostForm) => {
      const postData = {
        ...data,
        userId: parseInt(data.userId, 10),
      };

      if (!isOnline) {
        addRequestToQueue({ type: "create", data: postData });
        closeModal();
        return;
      }

      try {
        await createPost(postData);
        closeModal();
      } catch (err) {
        console.error(err);
      }
    },
    [createPost, addRequestToQueue, isOnline, closeModal]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return {
    users,
    isLoadingUsers,
    isSubmitting,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    handleBack,
    watch,
    error: null,
  };
}
