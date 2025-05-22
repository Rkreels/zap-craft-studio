
import React, { useState } from "react";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Mic, MicOff, HelpCircle } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

export const VoiceAssistantToggle: React.FC = () => {
  const { 
    isEnabled, 
    toggleVoiceAssistant, 
    isListening, 
    startListening, 
    stopListening,
    availableCommands,
    currentPage
  } = useVoiceAssistant();
  
  const [showHelp, setShowHelp] = useState(false);
  const isMobile = useIsMobile();
  
  const filteredCommands = availableCommands.sort((a, b) => 
    a.command.localeCompare(b.command)
  );
  
  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'flex-col' : ''}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${isEnabled ? 'bg-purple-100 border-purple-300' : ''}`}
              onClick={toggleVoiceAssistant}
              aria-label={isEnabled ? "Disable voice assistant" : "Enable voice assistant"}
            >
              {isEnabled ? <Volume2 size={18} className="text-purple-600" /> : <VolumeX size={18} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isEnabled ? "Disable voice assistant" : "Enable voice assistant"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isEnabled && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full ${isListening ? 'bg-red-100 border-red-300 animate-pulse' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                  aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening ? <MicOff size={18} className="text-red-600" /> : <Mic size={18} className="text-purple-600" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isListening ? "Stop listening" : "Start listening"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Popover open={showHelp} onOpenChange={setShowHelp}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                aria-label="Voice command help"
              >
                <HelpCircle size={18} className="text-purple-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Available Voice Commands</h3>
                {currentPage && (
                  <p className="text-sm text-gray-500">
                    Current page: <span className="font-medium">{currentPage}</span>
                  </p>
                )}
                <div className="space-y-2">
                  {filteredCommands.length > 0 ? (
                    filteredCommands.map((cmd, index) => (
                      <div key={index} className="p-2 rounded-md bg-gray-50 border border-gray-100">
                        <p className="font-medium">{cmd.command}</p>
                        {cmd.aliases && cmd.aliases.length > 0 && (
                          <p className="text-xs text-gray-500">
                            Aliases: {cmd.aliases.join(", ")}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">{cmd.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No commands available</p>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  );
};
