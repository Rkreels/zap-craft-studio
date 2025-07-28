import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";

// Enhanced voice command type with context awareness
export interface EnhancedVoiceCommand {
  command: string;
  description: string;
  action?: () => void;
  aliases?: string[];
  pageSpecific?: boolean;
  contextTags?: string[];
  priority?: number;
  trainingPhrases?: string[];
  responseText?: string;
}

// Training session data
export interface TrainingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  commands: string[];
  accuracy: number;
  context: string;
  improvements: string[];
}

// Enhanced context type
interface EnhancedVoiceAssistantContextType {
  isEnabled: boolean;
  isListening: boolean;
  isTraining: boolean;
  lastCommand: string;
  confidenceLevel: number;
  currentContext: string;
  trainingProgress: number;
  trainingAccuracy: number;
  toggleVoiceAssistant: () => void;
  startListening: () => void;
  stopListening: () => void;
  speakText: (text: string, interrupt?: boolean) => void;
  stopSpeaking: () => void;
  commandHistory: string[];
  availableCommands: EnhancedVoiceCommand[];
  registerCommand: (command: EnhancedVoiceCommand) => void;
  unregisterCommand: (command: string) => void;
  setCurrentContext: (context: string) => void;
  startTrainingSession: (context: string) => void;
  endTrainingSession: () => void;
  getContextualCommands: () => EnhancedVoiceCommand[];
  trainSpecificCommand: (command: string) => void;
  isCommandActive: (command: string) => boolean;
  getTrainingFeedback: () => string;
  setTrainingMode: (mode: boolean) => void;
  resetTraining: () => void;
  trainingSessions: TrainingSession[];
}

const EnhancedVoiceAssistantContext = createContext<EnhancedVoiceAssistantContextType>({
  isEnabled: false,
  isListening: false,
  isTraining: false,
  lastCommand: "",
  confidenceLevel: 0,
  currentContext: "",
  trainingProgress: 0,
  trainingAccuracy: 0,
  toggleVoiceAssistant: () => {},
  startListening: () => {},
  stopListening: () => {},
  speakText: () => {},
  stopSpeaking: () => {},
  commandHistory: [],
  availableCommands: [],
  registerCommand: () => {},
  unregisterCommand: () => {},
  setCurrentContext: () => {},
  startTrainingSession: () => {},
  endTrainingSession: () => {},
  getContextualCommands: () => [],
  trainSpecificCommand: () => {},
  isCommandActive: () => false,
  getTrainingFeedback: () => "",
  setTrainingMode: () => {},
  resetTraining: () => {},
  trainingSessions: []
});

export const useEnhancedVoiceAssistant = () => useContext(EnhancedVoiceAssistantContext);

interface EnhancedVoiceAssistantProviderProps {
  children: React.ReactNode;
}

export const EnhancedVoiceAssistantProvider: React.FC<EnhancedVoiceAssistantProviderProps> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [currentContext, setCurrentContext] = useState("dashboard");
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingAccuracy, setTrainingAccuracy] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [availableCommands, setAvailableCommands] = useState<EnhancedVoiceCommand[]>([]);
  const [currentTrainingSession, setCurrentTrainingSession] = useState<TrainingSession | null>(null);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [lastSpokenText, setLastSpokenText] = useState("");

  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<any>(null);
  const trainingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition with enhanced features
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;
      
      recognition.onstart = () => {
        console.log('Voice recognition started');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        const confidence = event.results[event.resultIndex] ? event.results[event.resultIndex][0].confidence : 0;
        setConfidenceLevel(confidence);
        
        if (event.results[event.resultIndex].isFinal) {
          setLastCommand(transcript);
          setCommandHistory(prev => [...prev.slice(-9), transcript]);
          
          if (isTraining) {
            updateTrainingProgress(transcript, confidence);
          }
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setIsEnabled(false);
          setIsListening(false);
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice commands.",
            variant: "destructive"
          });
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isTraining]);

  // Global commands that work across all contexts
  const globalCommands: EnhancedVoiceCommand[] = [
    {
      command: "help",
      description: "Show available voice commands",
      aliases: ["show help", "what can I say", "voice commands"],
      action: () => {
        const commands = getContextualCommands();
        const commandList = commands.map(cmd => cmd.command).join(", ");
        speakText(`Available commands in this context: ${commandList}`);
      },
      priority: 1
    },
    {
      command: "stop listening",
      description: "Stop voice recognition",
      aliases: ["stop", "pause", "quiet"],
      action: () => {
        stopListening();
        speakText("Voice recognition stopped.");
      },
      priority: 1
    },
    {
      command: "start training",
      description: "Begin voice training session",
      aliases: ["train voice", "voice training", "improve recognition"],
      action: () => {
        startTrainingSession(currentContext);
        speakText("Starting voice training session. I'll help you improve command recognition.");
      },
      priority: 1
    }
  ];

  // Update training progress
  const updateTrainingProgress = useCallback((command: string, confidence: number) => {
    if (!currentTrainingSession) return;
    
    const updatedSession = {
      ...currentTrainingSession,
      commands: [...currentTrainingSession.commands, command],
      accuracy: (currentTrainingSession.accuracy + confidence) / 2
    };
    
    setCurrentTrainingSession(updatedSession);
    setTrainingAccuracy(updatedSession.accuracy);
    setTrainingProgress(prev => Math.min(prev + 10, 100));
    
    // Provide real-time feedback
    if (confidence > 0.8) {
      speakText("Excellent recognition! Continue.");
    } else if (confidence > 0.6) {
      speakText("Good. Try speaking more clearly.");
    } else {
      speakText("Please repeat the command more clearly.");
    }
  }, [currentTrainingSession]);

  const toggleVoiceAssistant = useCallback(() => {
    setIsEnabled(prev => {
      const newState = !prev;
      if (!newState && isListening) {
        recognitionRef.current?.stop();
      }
      
      speakText(newState ? "Voice assistant enabled" : "Voice assistant disabled");
      return newState;
    });
  }, [isListening]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && isEnabled && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        
        if (isTraining) {
          speakText("Training mode active. Please say the highlighted command.");
        }
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [isEnabled, isListening, isTraining]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const speakText = useCallback((text: string, interrupt: boolean = false) => {
    if (!('speechSynthesis' in window) || !isEnabled) return;
    
    if (interrupt) {
      window.speechSynthesis.cancel();
    }
    
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 0.8;
    
    speech.onstart = () => {
      setLastSpokenText(text);
    };
    
    speech.onend = () => {
      setLastSpokenText("");
    };
    
    window.speechSynthesis.speak(speech);
    speechSynthesisRef.current = speech;
  }, [isEnabled]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setLastSpokenText("");
    }
  }, []);

  const registerCommand = useCallback((command: EnhancedVoiceCommand) => {
    setAvailableCommands(prev => {
      const exists = prev.some(cmd => cmd.command === command.command);
      if (!exists) {
        return [...prev, command];
      }
      return prev.map(cmd => cmd.command === command.command ? command : cmd);
    });
  }, []);

  const unregisterCommand = useCallback((commandName: string) => {
    setAvailableCommands(prev => 
      prev.filter(cmd => cmd.command !== commandName)
    );
  }, []);

  const getContextualCommands = useCallback(() => {
    const contextCommands = availableCommands.filter(cmd => 
      !cmd.pageSpecific || 
      cmd.contextTags?.includes(currentContext) ||
      cmd.command.toLowerCase().includes(currentContext.toLowerCase())
    );
    
    return [...globalCommands, ...contextCommands].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }, [availableCommands, currentContext]);

  const startTrainingSession = useCallback((context: string) => {
    const session: TrainingSession = {
      id: `training-${Date.now()}`,
      startTime: new Date(),
      commands: [],
      accuracy: 0,
      context,
      improvements: []
    };
    
    setCurrentTrainingSession(session);
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingAccuracy(0);
    
    // Stop any current training timeout
    if (trainingTimeoutRef.current) {
      clearTimeout(trainingTimeoutRef.current);
    }
    
    // Auto-end training after 10 minutes
    trainingTimeoutRef.current = setTimeout(() => {
      endTrainingSession();
    }, 10 * 60 * 1000);
    
    toast({
      title: "Training Started",
      description: `Voice training session started for ${context} context.`
    });
  }, []);

  const endTrainingSession = useCallback(() => {
    if (currentTrainingSession) {
      const completedSession = {
        ...currentTrainingSession,
        endTime: new Date()
      };
      
      setTrainingSessions(prev => [...prev, completedSession]);
      setCurrentTrainingSession(null);
      setIsTraining(false);
      
      if (trainingTimeoutRef.current) {
        clearTimeout(trainingTimeoutRef.current);
      }
      
      const accuracy = Math.round(trainingAccuracy * 100);
      speakText(`Training session completed. Your accuracy was ${accuracy} percent.`);
      
      toast({
        title: "Training Complete",
        description: `Session completed with ${accuracy}% accuracy.`
      });
    }
  }, [currentTrainingSession, trainingAccuracy]);

  const trainSpecificCommand = useCallback((command: string) => {
    const cmd = availableCommands.find(c => c.command === command);
    if (cmd) {
      speakText(`Let's practice the command: ${command}. Please repeat after me: ${command}`);
      
      // Wait for user to repeat
      setTimeout(() => {
        if (lastCommand.toLowerCase().includes(command.toLowerCase())) {
          speakText("Great! Command recognized successfully.");
        } else {
          speakText("Let's try again. Remember to speak clearly and at a normal pace.");
        }
      }, 3000);
    }
  }, [availableCommands, lastCommand]);

  const isCommandActive = useCallback((command: string) => {
    return lastCommand.toLowerCase().includes(command.toLowerCase()) && 
           Date.now() - new Date().getTime() < 5000; // Active for 5 seconds
  }, [lastCommand]);

  const getTrainingFeedback = useCallback(() => {
    if (!isTraining) return "";
    
    if (trainingAccuracy > 0.8) {
      return "Excellent! Your voice recognition is very accurate.";
    } else if (trainingAccuracy > 0.6) {
      return "Good progress. Try speaking more clearly for better recognition.";
    } else {
      return "Let's work on clarity. Speak slowly and pronounce each word distinctly.";
    }
  }, [isTraining, trainingAccuracy]);

  const setTrainingMode = useCallback((mode: boolean) => {
    if (mode && !isTraining) {
      startTrainingSession(currentContext);
    } else if (!mode && isTraining) {
      endTrainingSession();
    }
  }, [isTraining, currentContext, startTrainingSession, endTrainingSession]);

  const resetTraining = useCallback(() => {
    setTrainingProgress(0);
    setTrainingAccuracy(0);
    setTrainingSessions([]);
    endTrainingSession();
    
    toast({
      title: "Training Reset",
      description: "All training data has been cleared."
    });
  }, [endTrainingSession]);

  // Command processing with enhanced matching
  useEffect(() => {
    if (!lastCommand || !isEnabled) return;

    const processCommand = () => {
      const lowerCommand = lastCommand.toLowerCase().trim();
      const contextualCommands = getContextualCommands();
      
      // Enhanced command matching with fuzzy logic
      const matchedCommand = contextualCommands.find(cmd => {
        // Exact match
        if (lowerCommand === cmd.command.toLowerCase()) return true;
        
        // Alias match
        if (cmd.aliases) {
          return cmd.aliases.some(alias => 
            lowerCommand === alias.toLowerCase() || 
            lowerCommand.includes(alias.toLowerCase()) ||
            alias.toLowerCase().includes(lowerCommand)
          );
        }
        
        // Partial match for training phrases
        if (cmd.trainingPhrases) {
          return cmd.trainingPhrases.some(phrase =>
            lowerCommand.includes(phrase.toLowerCase()) ||
            phrase.toLowerCase().includes(lowerCommand)
          );
        }
        
        return false;
      });

      if (matchedCommand?.action) {
        if (matchedCommand.responseText) {
          speakText(matchedCommand.responseText);
        }
        matchedCommand.action();
        
        if (isTraining) {
          speakText("Command executed successfully!");
        }
        
        return true;
      } else if (isTraining) {
        speakText("Command not recognized. Please try again or say 'help' for available commands.");
      }
      
      return false;
    };

    const timer = setTimeout(processCommand, 100);
    return () => clearTimeout(timer);
  }, [lastCommand, isEnabled, getContextualCommands, isTraining]);

  // Context switching with automatic command updates
  const handleContextChange = useCallback((newContext: string) => {
    const previousContext = currentContext;
    setCurrentContext(newContext);
    
    // Stop current training if context changes
    if (isTraining && previousContext !== newContext) {
      endTrainingSession();
      speakText(`Context changed to ${newContext}. Training session ended.`);
      
      // Optionally start new training for new context
      setTimeout(() => {
        if (isEnabled) {
          speakText(`New commands available for ${newContext}. Say 'help' to hear them.`);
        }
      }, 1000);
    }
  }, [currentContext, isTraining, endTrainingSession, isEnabled]);

  const value = {
    isEnabled,
    isListening,
    isTraining,
    lastCommand,
    confidenceLevel,
    currentContext,
    trainingProgress,
    trainingAccuracy,
    toggleVoiceAssistant,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    commandHistory,
    availableCommands,
    registerCommand,
    unregisterCommand,
    setCurrentContext: handleContextChange,
    startTrainingSession,
    endTrainingSession,
    getContextualCommands,
    trainSpecificCommand,
    isCommandActive,
    getTrainingFeedback,
    setTrainingMode,
    resetTraining,
    trainingSessions
  };

  return (
    <EnhancedVoiceAssistantContext.Provider value={value}>
      {children}
    </EnhancedVoiceAssistantContext.Provider>
  );
};

// Type declarations
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}