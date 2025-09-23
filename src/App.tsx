
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import InterfacesPage from "./pages/InterfacesPage";
import ZapCreator from "./pages/ZapCreator";
import Dashboard from "./pages/Dashboard";
import ConnectedApps from "./pages/ConnectedApps";
import ExploreApps from "./pages/ExploreApps";
import TablesPage from "./pages/TablesPage";
import ChatbotPage from "./pages/ChatbotPage";
import HistoryPage from "./pages/HistoryPage";
import TemplateDetails from "./pages/TemplateDetails";
import TemplatesPage from "./pages/TemplatesPage";
import NotFound from "./pages/NotFound";
import { EnhancedVoiceWrapper } from "./components/voice-assistant/EnhancedVoiceWrapper";
import DataTransformationPage from "./pages/DataTransformationPage";
import VoiceTrainingPage from "./pages/VoiceTrainingPage";
import VoiceTrainingPageEnhanced from "./pages/VoiceTrainingPageEnhanced";
import WebhooksPage from "./pages/WebhooksPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CanvasPage from "./pages/CanvasPage";
import TableCreatorPage from "./pages/TableCreatorPage";
import DiscoverPage from "./pages/DiscoverPage";
import AgentsPage from "./pages/AgentsPage";
import AdvancedDashboard from "./pages/AdvancedDashboard";
import MorePage from "./pages/MorePage";
import SettingsPage from "./pages/SettingsPage";
import FunctionsPage from "./pages/FunctionsPage";

function App() {
  return (
    <EnhancedVoiceWrapper>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Main App Routes */}
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="advanced" element={<AdvancedDashboard />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="zaps" element={<HistoryPage />} />
          <Route path="zaps/create" element={<ZapCreator />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="tables/create" element={<TableCreatorPage />} />
          <Route path="interfaces" element={<InterfacesPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="canvas" element={<CanvasPage />} />
          <Route path="canvas/create" element={<CanvasPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="app-connections" element={<ConnectedApps />} />
          <Route path="zap-history" element={<HistoryPage />} />
          
          {/* New Zapier-like feature routes */}
          <Route path="filters" element={<NotFound />} />
          <Route path="storage" element={<NotFound />} />
          <Route path="scheduler" element={<NotFound />} />
          <Route path="analytics" element={<AdvancedDashboard />} />
          
          {/* Legacy routes for backwards compatibility */}
          <Route path="connected-apps" element={<ConnectedApps />} />
          <Route path="explore-apps" element={<ExploreApps />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/:id" element={<TemplateDetails />} />
          <Route path="data-transformation" element={<DataTransformationPage />} />
          <Route path="voice-training" element={<VoiceTrainingPage />} />
          <Route path="voice-training-enhanced" element={<VoiceTrainingPageEnhanced />} />
          <Route path="webhooks" element={<WebhooksPage />} />
          
          {/* Placeholder routes */}
          <Route path="functions" element={<FunctionsPage />} />
          <Route path="developer-platform" element={<NotFound />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="more" element={<MorePage />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </EnhancedVoiceWrapper>
  );
}

export default App;
