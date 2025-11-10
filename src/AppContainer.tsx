import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageProvider";
import { Toaster } from "./components/ui/sonner";
import { AsyncBoundary } from './components/AsyncBoundary';
import App from './App';

import { queryClient } from './lib/queryClient';

export default function AppContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <AsyncBoundary>
            <App />
            <Toaster />
          </AsyncBoundary>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
