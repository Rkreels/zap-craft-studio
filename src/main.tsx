
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { VoiceAssistantProvider } from './contexts/VoiceAssistantContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { Toaster } from "@/components/ui/toaster";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VoiceAssistantProvider>
          <App />
          <Toaster />
        </VoiceAssistantProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
