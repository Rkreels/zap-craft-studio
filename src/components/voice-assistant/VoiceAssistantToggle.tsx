
import React from "react";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const VoiceAssistantToggle: React.FC = () => {
  const { isEnabled, toggleVoiceAssistant } = useVoiceAssistant();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={toggleVoiceAssistant}
            aria-label={isEnabled ? "Disable voice assistant" : "Enable voice assistant"}
          >
            {isEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isEnabled ? "Disable voice assistant" : "Enable voice assistant"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
