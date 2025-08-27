'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { getQueuedRequests, deleteQueuedRequest, queueRequest } from '@/lib/offline';
import { QueuedRequest } from '@/types';
import { useAppContext } from '@/contexts/AppContext';
import { Post } from '@/types';

interface OfflineQueueOptions {
  createPost: (post: Omit<Post, 'id'>) => Promise<void>;
  updatePost: (post: Partial<Post> & { id: number }) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
}

export function useOfflineQueue({ createPost, updatePost, deletePost }: OfflineQueueOptions) {
  const isOnline = useOnlineStatus();
  const { showNotification } = useAppContext();
  const [queuedRequests, setQueuedRequests] = useState<QueuedRequest[]>([]);

  useEffect(() => {
    setQueuedRequests(getQueuedRequests());
  }, []);

  const processQueue = useCallback(async () => {
    const requests = getQueuedRequests();
    if (requests.length === 0) return;

    showNotification(`Syncing ${requests.length} offline changes...`, 'info');

    for (const req of requests) {
      try {
        if (req.type === 'create') {
          await createPost(req.data as Omit<Post, 'id'>);
        } else if (req.type === 'update') {
          await updatePost(req.data as Partial<Post> & { id: number });
        } else if (req.type === 'delete') {
          await deletePost(req.data as number);
        }
        deleteQueuedRequest(req.id);
        setQueuedRequests(getQueuedRequests());
      } catch (error) {
        console.error('Failed to process queued request:', error);
        showNotification(`Failed to sync change. Please try again.`, 'error');
      }
    }
  }, [createPost, updatePost, deletePost, showNotification]);

  useEffect(() => {
    if (isOnline) {
      processQueue();
    }
  }, [isOnline, processQueue]);

  const addRequestToQueue = (request: Omit<QueuedRequest, 'id'>) => {
    queueRequest(request);
    setQueuedRequests(getQueuedRequests());
    showNotification('Request queued. It will be processed when you are back online.', 'info');
  };

  return { queuedRequests, addRequestToQueue };
}
