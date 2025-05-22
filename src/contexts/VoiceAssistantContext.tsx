
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Define the SpeechRecognition types that TypeScript can't find
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

// Define voice command type
export interface VoiceCommand {
  command: string;
  description: string;
  action?: () => void;
  aliases?: string[];
  pageSpecific?: boolean;
}

// Define the context type
interface VoiceAssistantContextType {
  isEnabled: boolean;
  isListening: boolean;
  lastCommand: string;
  confidenceLevel: number;
  toggleVoiceAssistant: () => void;
  startListening: () => void;
  stopListening: () => void;
  speakText: (text: string) => void;
  trainingProgress: number;
  commandHistory: string[];
  availableCommands: VoiceCommand[];
  registerCommand: (command: VoiceCommand) => void;
  unregisterCommand: (command: string) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

// Create the context with default values
const VoiceAssistantContext = createContext<VoiceAssistantContextType>({
  isEnabled: false,
  isListening: false,
  lastCommand: "",
  confidenceLevel: 0,
  toggleVoiceAssistant: () => {},
  startListening: () => {},
  stopListening: () => {},
  speakText: () => {},
  trainingProgress: 0,
  commandHistory: [],
  availableCommands: [],
  registerCommand: () => {},
  unregisterCommand: () => {},
  currentPage: "",
  setCurrentPage: () => {}
});

// Create a custom hook for using the context
export const useVoiceAssistant = () => useContext(VoiceAssistantContext);

interface VoiceAssistantProviderProps {
  children: React.ReactNode;
}

// Define the provider component
export const VoiceAssistantProvider: React.FC<VoiceAssistantProviderProps> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [availableCommands, setAvailableCommands] = useState<VoiceCommand[]>([]);
  const [currentPage, setCurrentPage] = useState("");

  // Create speech recognition instance
  const [recognition, setRecognition] = useState<any>(null);

  // Register a new command
  const registerCommand = useCallback((command: VoiceCommand) => {
    setAvailableCommands(prev => {
      // Check if command already exists to avoid duplicates
      const exists = prev.some(cmd => cmd.command === command.command);
      if (!exists) {
        return [...prev, command];
      }
      return prev;
    });
  }, []);

  // Unregister a command
  const unregisterCommand = useCallback((commandName: string) => {
    setAvailableCommands(prev => 
      prev.filter(cmd => cmd.command !== commandName)
    );
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    // Browser compatibility check for Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        const confidence = event.results[event.resultIndex][0].confidence;
        setConfidenceLevel(confidence);
        
        if (event.results[event.resultIndex].isFinal) {
          setLastCommand(transcript);
          setCommandHistory(prev => [...prev, transcript]);
        }
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionError) => {
        console.error('Speech recognition error', event);
        if (event.error === 'not-allowed') {
          setIsEnabled(false);
          setIsListening(false);
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech Recognition API not supported in this browser');
    }
    
    // Mock training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        const newProgress = prev + 5;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 5000);
    
    return () => {
      clearInterval(interval);
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // Toggle voice assistant
  const toggleVoiceAssistant = useCallback(() => {
    setIsEnabled(prev => !prev);
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    }
  }, [isListening, recognition]);

  // Start listening
  const startListening = useCallback(() => {
    if (recognition && isEnabled && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition', error);
      }
    }
  }, [recognition, isEnabled, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  // Text-to-speech function
  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window && isEnabled) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      window.speechSynthesis.speak(speech);
    }
  }, [isEnabled]);

  // Effect to update available commands
  useEffect(() => {
    // Example global commands
    const globalCommands: VoiceCommand[] = [
      { command: "open dashboard", description: "Navigate to dashboard", aliases: ["go to dashboard", "show dashboard"] },
      { command: "create interface", description: "Open interface creation dialog", aliases: ["new interface", "add interface"] },
      { command: "search for", description: "Search for interfaces", aliases: ["find", "look for"] }
    ];
    
    setAvailableCommands(globalCommands);
  }, []);

  // Handle commands when last command changes
  useEffect(() => {
    if (!lastCommand || !isEnabled) return;

    const processCommand = () => {
      const lowerCommand = lastCommand.toLowerCase().trim();
      
      // Check if the command matches any registered command including aliases
      const matchedCommand = availableCommands.find(cmd => {
        if (lowerCommand === cmd.command.toLowerCase()) return true;
        if (cmd.aliases) {
          return cmd.aliases.some(alias => 
            lowerCommand === alias.toLowerCase() || 
            lowerCommand.includes(alias.toLowerCase())
          );
        }
        return false;
      });

      if (matchedCommand?.action) {
        matchedCommand.action();
        return true;
      }
      
      return false;
    };

    processCommand();
  }, [lastCommand, isEnabled, availableCommands]);

  // The context value
  const value = {
    isEnabled,
    isListening,
    lastCommand,
    confidenceLevel,
    toggleVoiceAssistant,
    startListening,
    stopListening,
    speakText,
    trainingProgress,
    commandHistory,
    availableCommands,
    registerCommand,
    unregisterCommand,
    currentPage,
    setCurrentPage
  };

  return (
    <VoiceAssistantContext.Provider value={value}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};

// Add these global type declarations to make TypeScript happy
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}
