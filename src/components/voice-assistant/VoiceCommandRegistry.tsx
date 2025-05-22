
import { useEffect } from "react";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { useNavigate } from "react-router-dom";

// Define common voice commands for navigation
const GlobalVoiceCommands = () => {
  const { registerCommand, unregisterCommand, speakText } = useVoiceAssistant();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Register global navigation commands
    const commands = [
      {
        command: "go to dashboard",
        description: "Navigate to the dashboard page",
        action: () => { navigate("/"); speakText("Navigating to dashboard"); },
        aliases: ["open dashboard", "show dashboard"]
      },
      {
        command: "go to interfaces",
        description: "Navigate to the interfaces page",
        action: () => { navigate("/interfaces"); speakText("Navigating to interfaces"); },
        aliases: ["open interfaces", "show interfaces"]
      },
      {
        command: "go to voice training",
        description: "Navigate to the voice training page",
        action: () => { navigate("/voice-training"); speakText("Navigating to voice training"); },
        aliases: ["open voice training", "show voice training"]
      },
      {
        command: "go to tables",
        description: "Navigate to the tables page",
        action: () => { navigate("/tables"); speakText("Navigating to tables"); },
        aliases: ["open tables", "show tables"]
      },
      {
        command: "go to chatbot",
        description: "Navigate to the chatbot page",
        action: () => { navigate("/chatbot"); speakText("Navigating to chatbot"); },
        aliases: ["open chatbot", "show chatbot"]
      },
      {
        command: "toggle voice assistant",
        description: "Turn voice assistant on or off",
        action: () => { speakText("Toggling voice assistant"); },
        aliases: ["enable voice", "disable voice"]
      },
      {
        command: "help",
        description: "List available commands",
        action: () => { speakText("Available commands include: navigation commands like 'go to dashboard', 'toggle voice assistant', and page specific commands."); },
        aliases: ["show help", "what can I say"]
      }
    ];
    
    // Register each command
    commands.forEach(cmd => registerCommand(cmd));
    
    // Cleanup on unmount
    return () => {
      commands.forEach(cmd => unregisterCommand(cmd.command));
    };
  }, [registerCommand, unregisterCommand, navigate, speakText]);
  
  return null; // This component doesn't render anything
};

// Main voice command registry component
export const VoiceCommandRegistry: React.FC = () => {
  return (
    <>
      <GlobalVoiceCommands />
    </>
  );
};

// Helper hook for pages to register their specific commands
export const usePageVoiceCommands = (
  pageName: string, 
  commands: {
    command: string;
    description: string;
    action: () => void;
    aliases?: string[];
  }[]
) => {
  const { registerCommand, unregisterCommand, setCurrentPage } = useVoiceAssistant();
  
  useEffect(() => {
    // Set current page for context awareness
    setCurrentPage(pageName);
    
    // Register page specific commands
    commands.forEach(cmd => registerCommand(cmd));
    
    // Cleanup on unmount
    return () => {
      commands.forEach(cmd => unregisterCommand(cmd.command));
    };
  }, [pageName, commands, registerCommand, unregisterCommand, setCurrentPage]);
};
