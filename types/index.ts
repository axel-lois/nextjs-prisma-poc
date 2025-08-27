// Re-export all types from domain-specific files
export * from './user';
export * from './post';
export * from './api';

export interface QueuedRequest {
  id: number;
  type: 'create' | 'update' | 'delete';
  data: unknown;
}
