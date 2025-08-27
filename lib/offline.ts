import { QueuedRequest } from '@/types';

const QUEUE_KEY = 'offline-queue';

export function queueRequest(request: Omit<QueuedRequest, 'id'>): void {
  if (typeof window === 'undefined') return;

  const queue = getQueuedRequests();
  const newRequest = { ...request, id: Date.now() };
  queue.push(newRequest);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function getQueuedRequests(): QueuedRequest[] {
  if (typeof window === 'undefined') return [];

  const queue = localStorage.getItem(QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
}

export function deleteQueuedRequest(id: number): void {
  if (typeof window === 'undefined') return;

  const queue = getQueuedRequests();
  const newQueue = queue.filter((req) => req.id !== id);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
}
