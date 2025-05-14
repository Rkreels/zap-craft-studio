
import React from "react";
import { VoiceAssistantToggle } from "./VoiceAssistantToggle";

export const VoiceAssistantWrapper: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50 shadow-lg rounded-full">
      <VoiceAssistantToggle />
    </div>
  );
};
