
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

type VoiceCommand = {
  command: string;
  description: string;
  action: () => void;
  aliases?: string[];
};

type VoiceAssistantContextType = {
  isEnabled: boolean;
  toggleVoiceAssistant: () => void;
  speakText: (text: string, priority?: boolean) => void;
  stopSpeaking: () => void;
  registerCommand: (command: VoiceCommand) => void;
  unregisterCommand: (commandText: string) => void;
  executeCommand: (commandText: string) => boolean;
  availableCommands: VoiceCommand[];
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  isSpeaking: boolean;
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

// Create context with default values
const VoiceAssistantContext = createContext<VoiceAssistantContextType>({
  isEnabled: false,
  toggleVoiceAssistant: () => {},
  speakText: () => {},
  stopSpeaking: () => {},
  registerCommand: () => {},
  unregisterCommand: () => {},
  executeCommand: () => false,
  availableCommands: [],
  isListening: false,
  startListening: () => {},
  stopListening: () => {},
  isSpeaking: false,
  currentPage: "",
  setCurrentPage: () => {},
});

// Custom hook to use the voice assistant context
export const useVoiceAssistant = () => useContext(VoiceAssistantContext);

export const VoiceAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [isEnabled, setIsEnabled] = useState(() => {
    // Check localStorage for user preference, default to true
    const savedPreference = localStorage.getItem("voiceAssistantEnabled");
    return savedPreference ? savedPreference === "true" : true;
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [utteranceQueue, setUtteranceQueue] = useState<SpeechSynthesisUtterance[]>([]);
  const [availableCommands, setAvailableCommands] = useState<VoiceCommand[]>([]);
  const [currentPage, setCurrentPage] = useState<string>("");
  
  // Speech recognition instance
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // @ts-ignore - TypeScript doesn't have types for webkitSpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log("Voice command recognized:", transcript);
        
        if (executeCommand(transcript)) {
          console.log("Command executed:", transcript);
        } else {
          console.log("Command not recognized:", transcript);
          if (isEnabled) {
            speakText("I didn't understand that command. Please try again.");
          }
        }
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionError) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        // Only restart if it's supposed to be listening
        if (isListening) {
          recognitionInstance.start();
        } else {
          setIsListening(false);
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.error("Speech recognition is not supported in this browser");
      toast({
        title: "Voice Assistant Limited",
        description: "Your browser doesn't fully support speech recognition",
        variant: "destructive",
      });
    }
    
    // Cleanup on component unmount
    return () => {
      if (recognition) {
        recognition.onend = null;
        recognition.abort();
      }
    };
  }, []);

  // Save preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("voiceAssistantEnabled", isEnabled.toString());
  }, [isEnabled]);

  // Function to start listening
  const startListening = () => {
    if (!isEnabled || !recognition) return;
    
    try {
      recognition.start();
      setIsListening(true);
      toast({
        title: "Voice Assistant Listening",
        description: "Say a command...",
      });
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  };
  
  // Function to stop listening
  const stopListening = () => {
    if (!recognition) return;
    
    try {
      recognition.stop();
      setIsListening(false);
      toast({
        title: "Voice Assistant Stopped Listening",
      });
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  };

  // Function to toggle the voice assistant
  const toggleVoiceAssistant = () => {
    if (isEnabled) {
      stopSpeaking();
      stopListening();
    }
    setIsEnabled(prev => !prev);
    toast({
      title: !isEnabled ? "Voice Assistant Enabled" : "Voice Assistant Disabled",
      description: !isEnabled 
        ? "Hover over elements for voice guidance" 
        : "Voice guidance is now turned off",
    });
  };

  // Register a new command
  const registerCommand = (command: VoiceCommand) => {
    setAvailableCommands(prev => {
      // Check if command already exists
      const exists = prev.some(cmd => cmd.command === command.command);
      if (!exists) {
        return [...prev, command];
      }
      return prev;
    });
  };

  // Unregister a command
  const unregisterCommand = (commandText: string) => {
    setAvailableCommands(prev => prev.filter(cmd => cmd.command !== commandText));
  };

  // Execute a command based on user input
  const executeCommand = (commandText: string): boolean => {
    // Convert to lowercase for case-insensitive matching
    const lowerCaseCommand = commandText.toLowerCase().trim();
    
    // Try to find an exact match or alias match
    const matchedCommand = availableCommands.find(cmd => 
      cmd.command.toLowerCase() === lowerCaseCommand || 
      (cmd.aliases?.some(alias => alias.toLowerCase() === lowerCaseCommand))
    );
    
    if (matchedCommand) {
      matchedCommand.action();
      return true;
    }
    
    // If no exact match, try to find a command that contains the user input
    const partialMatch = availableCommands.find(cmd => 
      lowerCaseCommand.includes(cmd.command.toLowerCase()) ||
      cmd.aliases?.some(alias => lowerCaseCommand.includes(alias.toLowerCase()))
    );
    
    if (partialMatch) {
      partialMatch.action();
      return true;
    }
    
    return false;
  };

  // Function to stop all speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setUtteranceQueue([]);
    }
  };

  // Function to speak text
  const speakText = (text: string, priority = false) => {
    if (!isEnabled || !text || !('speechSynthesis' in window)) return;

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to use a natural female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      (voice.name.includes("Female") || 
       voice.name.includes("female") || 
       voice.name.includes("Samantha") || 
       voice.name.includes("Google") && voice.name.includes("US")) && 
      voice.lang.includes("en-US")
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Set properties for the utterance
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Add end event listener
    utterance.onend = () => {
      setIsSpeaking(false);
      // Check if there are more utterances in the queue
      if (utteranceQueue.length > 0) {
        const nextUtterance = utteranceQueue[0];
        setUtteranceQueue(prev => prev.slice(1));
        window.speechSynthesis.speak(nextUtterance);
        setIsSpeaking(true);
      }
    };

    // If already speaking and this is not a priority message, add to queue
    if (isSpeaking && !priority) {
      setUtteranceQueue(prev => [...prev, utterance]);
    } else {
      // If priority or not speaking, stop current speech and speak this one
      stopSpeaking();
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <VoiceAssistantContext.Provider value={{ 
      isEnabled, 
      toggleVoiceAssistant, 
      speakText,
      stopSpeaking,
      registerCommand,
      unregisterCommand,
      executeCommand,
      availableCommands,
      isListening,
      startListening,
      stopListening,
      isSpeaking,
      currentPage,
      setCurrentPage
    }}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};
