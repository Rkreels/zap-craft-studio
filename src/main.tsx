
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { VoiceAssistantWrapper } from './components/voice-assistant/VoiceAssistantWrapper'

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <VoiceAssistantWrapper />
  </>
);
