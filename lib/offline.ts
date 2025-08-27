import { QueuedRequest } from "@/types";

const QUEUE_KEY = "offline-queue";

export function hasPendingAction(postId: number): boolean {
  const queue = getQueuedRequests();
  return queue.some((req) => {
    if (req.type === "update") {
      const data = req.data as { id?: number };
      return data.id === postId;
    }
    if (req.type === "delete") {
      return req.data === postId;
    }
    return false;
  });
}

export function isDuplicateRequest(
  request: Omit<QueuedRequest, "id">
): boolean {
  const queue = getQueuedRequests();
  return queue.some(
    (req) =>
      req.type === request.type &&
      JSON.stringify(req.data) === JSON.stringify(request.data)
  );
}

export function queueRequest(request: Omit<QueuedRequest, "id">): void {
  if (typeof window === "undefined") return;

  const queue = getQueuedRequests();
  const newRequest = { ...request, id: Date.now() };
  queue.push(newRequest);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function getQueuedRequests(): QueuedRequest[] {
  if (typeof window === "undefined") return [];

  const queue = localStorage.getItem(QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
}

export function deleteQueuedRequest(id: number): void {
  if (typeof window === "undefined") return;

  const queue = getQueuedRequests();
  const newQueue = queue.filter((req) => req.id !== id);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
}
