import React from "react";
import { VoiceAssistantWrapper } from "./VoiceAssistantWrapper";
import { ContextualVoiceGuide } from "./ContextualVoiceGuide";

interface EnhancedVoiceWrapperProps {
  children: React.ReactNode;
}

export const EnhancedVoiceWrapper: React.FC<EnhancedVoiceWrapperProps> = ({ children }) => {
  return (
    <VoiceAssistantWrapper>
      <ContextualVoiceGuide />
      {children}
    </VoiceAssistantWrapper>
  );
};