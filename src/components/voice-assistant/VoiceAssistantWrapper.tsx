
import React from "react";
import { VoiceAssistantToggle } from "./VoiceAssistantToggle";
import { TooltipProvider } from "@/components/ui/tooltip";

export const VoiceAssistantWrapper: React.FC = () => {
  return (
    <TooltipProvider>
      <div className="fixed bottom-8 right-8 z-50 shadow-lg rounded-full">
        <VoiceAssistantToggle />
      </div>
    </TooltipProvider>
  );
};
