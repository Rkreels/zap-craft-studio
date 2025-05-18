
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import InterfacesPage from "./pages/InterfacesPage";
import ZapCreator from "./pages/ZapCreator";
import Dashboard from "./pages/Dashboard";
import ConnectedApps from "./pages/ConnectedApps";
import ExploreApps from "./pages/ExploreApps";
import TablesPage from "./pages/TablesPage";
import ChatbotPage from "./pages/ChatbotPage";
import HistoryPage from "./pages/HistoryPage";
import TemplateDetails from "./pages/TemplateDetails";
import { NotFound } from "./pages/NotFound";
import { VoiceAssistantWrapper } from "./components/voice-assistant/VoiceAssistantWrapper";
import DataTransformationPage from "./pages/DataTransformationPage";

function App() {
  return (
    <VoiceAssistantWrapper>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="interfaces" element={<InterfacesPage />} />
          <Route path="zaps/create" element={<ZapCreator />} />
          <Route path="connected-apps" element={<ConnectedApps />} />
          <Route path="explore-apps" element={<ExploreApps />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="template/:id" element={<TemplateDetails />} />
          <Route path="data-transformation" element={<DataTransformationPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </VoiceAssistantWrapper>
  );
}

export default App;
