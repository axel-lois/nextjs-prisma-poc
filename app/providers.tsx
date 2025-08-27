'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider } from '@/contexts/AppContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { PersistQueryClientProvider } from './PersistQueryClientProvider';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <QueryClientProvider client={queryClient}>
        <PersistQueryClientProvider queryClient={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppProvider>
              <ModalProvider>{children}</ModalProvider>
            </AppProvider>
          </ThemeProvider>
        </PersistQueryClientProvider>
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
}
