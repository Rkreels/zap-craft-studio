
import React, { useEffect } from "react";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { usePageVoiceCommands } from "./VoiceCommandRegistry";

interface CommandDefinition {
  command: string;
  description: string;
  action: () => void;
  aliases?: string[];
}

interface PageVoiceCommandsProps {
  pageName: string;
  commands: CommandDefinition[];
  introMessage?: string;
}

export const PageVoiceCommands: React.FC<PageVoiceCommandsProps> = ({
  pageName,
  commands,
  introMessage
}) => {
  const { isEnabled, speakText } = useVoiceAssistant();
  
  // Register the page-specific commands
  usePageVoiceCommands(pageName, commands);
  
  // Speak intro message when component mounts
  useEffect(() => {
    if (isEnabled && introMessage) {
      const timer = setTimeout(() => {
        speakText(introMessage);
      }, 800); // Slight delay to ensure it doesn't speak immediately on page load
      
      return () => clearTimeout(timer);
    }
  }, [isEnabled, introMessage, speakText]);
  
  // This is a utility component and doesn't render anything
  return null;
};
