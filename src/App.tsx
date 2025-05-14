
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { VoiceAssistantProvider } from "./contexts/VoiceAssistantContext";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ZapCreator from "./pages/ZapCreator";
import HistoryPage from "./pages/HistoryPage";
import TemplateDetails from "./pages/TemplateDetails";
import ConnectedApps from "./pages/ConnectedApps";
import ExploreApps from "./pages/ExploreApps";
import TablesPage from "./pages/TablesPage";
import InterfacesPage from "./pages/InterfacesPage";
import ChatbotPage from "./pages/ChatbotPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Create placeholder for the remaining pages
const CanvasPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh]">
    <h1 className="text-2xl font-bold mb-4">Canvas</h1>
    <p>A visual builder tool for creating automated workflows (coming soon).</p>
  </div>
);

const SettingsPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh]">
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <p>Manage your account settings, preferences, and configuration.</p>
  </div>
);

const MorePage = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh]">
    <h1 className="text-2xl font-bold mb-4">More Resources</h1>
    <p>Discover additional tools, resources, and learning materials.</p>
  </div>
);

const ZapsPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh]">
    <h1 className="text-2xl font-bold mb-4">My Zaps</h1>
    <p>View and manage all your automated workflows.</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <VoiceAssistantProvider>
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* App routes - All wrapped in AppLayout */}
              <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/zaps" element={<AppLayout><ZapsPage /></AppLayout>} />
              <Route path="/zaps/create" element={<AppLayout><ZapCreator /></AppLayout>} />
              <Route path="/templates/:id" element={<AppLayout><TemplateDetails /></AppLayout>} />
              <Route path="/tables" element={<AppLayout><TablesPage /></AppLayout>} />
              <Route path="/interfaces" element={<AppLayout><InterfacesPage /></AppLayout>} />
              <Route path="/chatbot" element={<AppLayout><ChatbotPage /></AppLayout>} />
              <Route path="/canvas" element={<AppLayout><CanvasPage /></AppLayout>} />
              <Route path="/history" element={<AppLayout><HistoryPage /></AppLayout>} />
              <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
              <Route path="/more" element={<AppLayout><MorePage /></AppLayout>} />
              <Route path="/connected-apps" element={<AppLayout><ConnectedApps /></AppLayout>} />
              <Route path="/explore-apps" element={<AppLayout><ExploreApps /></AppLayout>} />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </VoiceAssistantProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
