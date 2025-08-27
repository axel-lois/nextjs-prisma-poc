'use client';

import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface PersistQueryClientProviderProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export function PersistQueryClientProvider({ children, queryClient }: PersistQueryClientProviderProps) {
  useEffect(() => {
    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
    });

    persistQueryClient({
      queryClient,
      persister: localStoragePersister,
    });
  }, [queryClient]);

  return <>{children}</>;
}
