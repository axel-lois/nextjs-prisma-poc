import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@/types";
import { apiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { useOfflineQueue } from "./useOfflineQueue";

const fetchPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get(API_ENDPOINTS.POSTS);
  return response.data.data;
};

const createPost = async (
  newPost: { title: string; body: string; userId: number }
): Promise<Post> => {
  const response = await apiClient.post(API_ENDPOINTS.POSTS, newPost);
  return response.data;
};

const updatePost = async (
  updatedPost: { id: number; title?: string; body?: string }
): Promise<Post> => {
  const response = await apiClient.patch(
    `${API_ENDPOINTS.POSTS}/${updatedPost.id}`,
    updatedPost
  );
  return response.data;
};

const deletePost = async (id: number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.POSTS}/${id}`);
};

export function usePosts() {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationContext();

  const { data, isLoading, error } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 30, // 30 seconds 
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
  });

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
      queryClient.setQueryData<Post[]>(["posts"], (old) => [...(old || []), { ...newPost, id: Date.now() }]);
      return { previousPosts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      showNotification("Post created successfully", "success");
    },
    onError: (err, newPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      showNotification("Failed to create post", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: updatePost,
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
      queryClient.setQueryData<Post[]>(["posts"], (old) =>
        old?.map((post) =>
          post.id === updatedPost.id ? { ...post, ...updatedPost } : post
        )
      );
      return { previousPosts };
    },
    onSuccess: () => {
      showNotification("Post updated successfully", "success");
    },
    onError: (err, updatedPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      showNotification("Failed to update post", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
      queryClient.setQueryData<Post[]>(["posts"], (old) =>
        old?.filter((post) => post.id !== id)
      );
      return { previousPosts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      showNotification("Post deleted successfully", "success");
    },
    onError: (err, id, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      showNotification("Failed to delete post", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { addRequestToQueue } = useOfflineQueue();

  return {
    posts: data || [],
    isLoading,
    error,
    createPost: createPostMutation.mutate,
    updatePost: updatePostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    addRequestToQueue,
  };
}
