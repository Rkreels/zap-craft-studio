
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
  availableCommands: { command: string; description: string }[];
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
  const [availableCommands, setAvailableCommands] = useState<{ command: string; description: string }[]>([]);

  // Create speech recognition instance
  const [recognition, setRecognition] = useState<any>(null);

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
    // Example commands
    setAvailableCommands([
      { command: "open dashboard", description: "Navigate to dashboard" },
      { command: "create interface", description: "Open interface creation dialog" },
      { command: "search for", description: "Search for interfaces" }
    ]);
  }, []);

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
    availableCommands
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
