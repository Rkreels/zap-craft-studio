
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { VoiceAssistantProvider } from './contexts/VoiceAssistantContext.tsx';
import { EnhancedVoiceAssistantProvider } from './contexts/EnhancedVoiceAssistantContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { AppStateProvider } from './contexts/AppStateContext.tsx';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppStateProvider>
          <AuthProvider>
            <VoiceAssistantProvider>
              <EnhancedVoiceAssistantProvider>
                <App />
                <Toaster />
              </EnhancedVoiceAssistantProvider>
            </VoiceAssistantProvider>
          </AuthProvider>
        </AppStateProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
