
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ZapCreator from "./pages/ZapCreator";
import HistoryPage from "./pages/HistoryPage";
import TemplateDetails from "./pages/TemplateDetails";
import ConnectedApps from "./pages/ConnectedApps";

// Create placeholder pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh]">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p>This page is under construction.</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/zaps" element={
            <AppLayout>
              <PlaceholderPage title="My Zaps" />
            </AppLayout>
          } />
          <Route path="/zaps/create" element={
            <AppLayout>
              <ZapCreator />
            </AppLayout>
          } />
          <Route path="/templates/:id" element={
            <AppLayout>
              <TemplateDetails />
            </AppLayout>
          } />
          <Route path="/tables" element={
            <AppLayout>
              <PlaceholderPage title="Tables" />
            </AppLayout>
          } />
          <Route path="/interfaces" element={
            <AppLayout>
              <PlaceholderPage title="Interfaces" />
            </AppLayout>
          } />
          <Route path="/chatbot" element={
            <AppLayout>
              <PlaceholderPage title="Chatbot" />
            </AppLayout>
          } />
          <Route path="/canvas" element={
            <AppLayout>
              <PlaceholderPage title="Canvas" />
            </AppLayout>
          } />
          <Route path="/history" element={
            <AppLayout>
              <HistoryPage />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <PlaceholderPage title="Settings" />
            </AppLayout>
          } />
          <Route path="/more" element={
            <AppLayout>
              <PlaceholderPage title="More" />
            </AppLayout>
          } />
          <Route path="/connected-apps" element={
            <AppLayout>
              <ConnectedApps />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
