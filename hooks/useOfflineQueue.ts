'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOnlineStatus } from './useOnlineStatus';
import { getQueuedRequests, deleteQueuedRequest, queueRequest, isDuplicateRequest } from '@/lib/offline';
import { QueuedRequest } from '@/types';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { Post } from '@/types';
import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';

export function useOfflineQueue() {
  const isOnline = useOnlineStatus();
  const { showNotification } = useNotificationContext();
  const queryClient = useQueryClient();
  const [queuedRequests, setQueuedRequests] = useState<QueuedRequest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setQueuedRequests(getQueuedRequests());
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessing) return;

    const requests = getQueuedRequests();
    if (requests.length === 0) return;

    setIsProcessing(true);
    showNotification(`Syncing ${requests.length} offline changes...`, 'info');

    let successCount = 0;
    let failureCount = 0;

    for (const req of requests) {
      try {
        if (req.type === 'create') {
          await apiClient.post(API_ENDPOINTS.POSTS, req.data);
        } else if (req.type === 'update') {
          const { id, ...data } = req.data as Partial<Post> & { id: number };
          await apiClient.patch(`${API_ENDPOINTS.POSTS}/${id}`, data);
        } else if (req.type === 'delete') {
          await apiClient.delete(`${API_ENDPOINTS.POSTS}/${req.data}`);
        }
        deleteQueuedRequest(req.id);
        setQueuedRequests(getQueuedRequests());
        successCount++;
      } catch (error) {
        console.error('Failed to process queued request:', error);
        failureCount++;
      }
    }

    setIsProcessing(false);
    
    // Show completion notification
    if (successCount > 0) {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      showNotification(`Successfully synced ${successCount} changes!`, 'success');
    }
    if (failureCount > 0) {
      showNotification(`Failed to sync ${failureCount} changes. They will be retried later.`, 'error');
    }
  }, [showNotification, isProcessing, queryClient]);

  useEffect(() => {
    if (isOnline && queuedRequests.length > 0) {
      processQueue();
    }
  }, [isOnline, processQueue, queuedRequests]);

  const addRequestToQueue = (request: Omit<QueuedRequest, 'id'>) => {
    if (isDuplicateRequest(request)) {
      showNotification('This action is already in the queue.', 'warning');
      return;
    }
    queueRequest(request);
    setQueuedRequests(getQueuedRequests());
    showNotification('Request queued. It will be processed when you are back online.', 'info');
  };

  return { queuedRequests, addRequestToQueue };
}
