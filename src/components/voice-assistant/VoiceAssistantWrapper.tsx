
import React from "react";
import { VoiceAssistantToggle } from "./VoiceAssistantToggle";
import { TooltipProvider } from "@/components/ui/tooltip";

interface VoiceAssistantWrapperProps {
  children: React.ReactNode;
}

export const VoiceAssistantWrapper: React.FC<VoiceAssistantWrapperProps> = ({ children }) => {
  return (
    <TooltipProvider>
      <>
        {children}
        <div className="fixed bottom-8 right-8 z-50 shadow-lg rounded-full">
          <VoiceAssistantToggle />
        </div>
      </>
    </TooltipProvider>
  );
};
