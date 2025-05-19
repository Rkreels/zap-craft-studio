
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
import { VoiceAssistantWrapper } from "./components/voice-assistant/VoiceAssistantWrapper";
import DataTransformationPage from "./pages/DataTransformationPage";
import VoiceTrainingPage from "./pages/VoiceTrainingPage";
import WebhooksPage from "./pages/WebhooksPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CanvasPage from "./pages/CanvasPage";
import TableCreatorPage from "./pages/TableCreatorPage";

function App() {
  return (
    <VoiceAssistantWrapper>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<AppLayout>
          {/* AppLayout now accepts children */}
        </AppLayout>}>
          <Route index element={<Dashboard />} />
          <Route path="interfaces" element={<InterfacesPage />} />
          <Route path="zaps/create" element={<ZapCreator />} />
          <Route path="connected-apps" element={<ConnectedApps />} />
          <Route path="explore-apps" element={<ExploreApps />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="tables/create" element={<TableCreatorPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/:id" element={<TemplateDetails />} />
          <Route path="data-transformation" element={<DataTransformationPage />} />
          <Route path="voice-training" element={<VoiceTrainingPage />} />
          <Route path="webhooks" element={<WebhooksPage />} />
          <Route path="canvas" element={<CanvasPage />} />
          <Route path="canvas/create" element={<CanvasPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </VoiceAssistantWrapper>
  );
}

export default App;
