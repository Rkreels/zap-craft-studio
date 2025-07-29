import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

// Enhanced Voice Command Interface
export interface EnhancedVoiceCommand {
  command: string;
  description: string;
  action: () => void;
  aliases?: string[];
  contextTags?: string[];
  priority?: number;
  responseText?: string;
  pageSpecific?: boolean;
}

// Training Session Interface
export interface TrainingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  commands: string[];
  accuracy: number;
  context: string;
  duration?: number;
  improvements: string[];
}

// Enhanced Context Interface
interface EnhancedVoiceAssistantContextType {
  // Basic voice controls
  isEnabled: boolean;
  isListening: boolean;
  toggleVoiceAssistant: () => void;
  startListening: () => void;
  stopListening: () => void;
  
  // Speech synthesis
  speakText: (text: string, interrupt?: boolean) => void;
  stopSpeaking: () => void;
  lastSpokenText: string;
  
  // Command management
  availableCommands: EnhancedVoiceCommand[];
  registerCommand: (command: EnhancedVoiceCommand) => void;
  unregisterCommand: (commandName: string) => void;
  getContextualCommands: () => EnhancedVoiceCommand[];
  
  // Context awareness
  currentContext: string;
  setCurrentContext: (context: string) => void;
  
  // Training system
  isTraining: boolean;
  trainingMode: boolean;
  setTrainingMode: (enabled: boolean) => void;
  startTrainingSession: (context: string) => void;
  endTrainingSession: () => void;
  currentTrainingSession: TrainingSession | null;
  trainingSessions: TrainingSession[];
  trainingProgress: number;
  trainingAccuracy: number;
  
  // Recognition data
  lastCommand: string;
  recognitionConfidence: number;
  confidenceLevel: number;
  
  // Learning capabilities
  adaptToUserVoice: boolean;
  userVoiceProfile: any;
  improveRecognition: (command: string, wasCorrect: boolean) => void;
  getTrainingFeedback: () => string;
  resetTraining: () => void;
}

const EnhancedVoiceAssistantContext = createContext<EnhancedVoiceAssistantContextType | undefined>(undefined);

interface EnhancedVoiceAssistantProviderProps {
  children: React.ReactNode;
}

export const EnhancedVoiceAssistantProvider: React.FC<EnhancedVoiceAssistantProviderProps> = ({ children }) => {
  // Basic state
  const [isEnabled, setIsEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState("");
  const [currentContext, setCurrentContextState] = useState<string>("dashboard");
  
  // Command management
  const [availableCommands, setAvailableCommands] = useState<EnhancedVoiceCommand[]>([]);
  const [lastCommand, setLastCommand] = useState("");
  const [recognitionConfidence, setRecognitionConfidence] = useState(0);
  
  // Training system
  const [isTraining, setIsTraining] = useState(false);
  const [trainingMode, setTrainingMode] = useState(false);
  const [currentTrainingSession, setCurrentTrainingSession] = useState<TrainingSession | null>(null);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingAccuracy, setTrainingAccuracy] = useState(0);
  
  // Learning system
  const [adaptToUserVoice, setAdaptToUserVoice] = useState(true);
  const [userVoiceProfile, setUserVoiceProfile] = useState({});
  
  // Refs for cleanup
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const trainingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        const confidence = event.results[event.results.length - 1][0].confidence;
        
        if (event.results[event.results.length - 1].isFinal) {
          setLastCommand(transcript);
          setRecognitionConfidence(confidence);
          handleVoiceCommand(transcript, confidence);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle voice commands
  const handleVoiceCommand = useCallback((transcript: string, confidence: number) => {
    const commands = getContextualCommands();
    
    // Find matching command
    const matchedCommand = commands.find(cmd => {
      const commandMatch = cmd.command.toLowerCase() === transcript;
      const aliasMatch = cmd.aliases?.some(alias => alias.toLowerCase() === transcript);
      return commandMatch || aliasMatch;
    });
    
    if (matchedCommand) {
      // Update training progress if in training mode
      if (isTraining && currentTrainingSession) {
        updateTrainingProgress(transcript, confidence);
      }
      
      // Speak response
      if (matchedCommand.responseText) {
        speakText(matchedCommand.responseText, true);
      }
      
      // Execute command
      setTimeout(() => {
        matchedCommand.action();
      }, 500);
    } else {
      // Handle unrecognized command
      if (isTraining) {
        speakText("Command not recognized. Please try again or say 'help' for available commands.", true);
      }
      
      // Learning opportunity
      if (adaptToUserVoice) {
        improveRecognition(transcript, false);
      }
    }
  }, [availableCommands, currentContext, isTraining, currentTrainingSession, adaptToUserVoice]);

  // Global commands that are always available
  const globalCommands: EnhancedVoiceCommand[] = [
    {
      command: "help",
      description: "Get help with voice commands",
      aliases: ["voice help", "commands", "what can I say"],
      action: () => {
        const commands = getContextualCommands();
        const commandList = commands.slice(0, 5).map(cmd => cmd.command).join(", ");
        speakText(`Available commands include: ${commandList}. Say 'show all commands' for a complete list.`);
      },
      priority: 1
    },
    {
      command: "stop listening",
      description: "Stop voice recognition",
      aliases: ["stop", "quit", "disable voice"],
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
      title: "Training started",
      description: `Voice training session started for ${context} context.`,
    });
  }, []);

  const endTrainingSession = useCallback(() => {
    if (currentTrainingSession) {
      const endTime = new Date();
      const completedSession = {
        ...currentTrainingSession,
        endTime,
        duration: endTime.getTime() - currentTrainingSession.startTime.getTime()
      };
      
      setTrainingSessions(prev => [...prev, completedSession]);
      setCurrentTrainingSession(null);
      setIsTraining(false);
      setTrainingMode(false);
      
      // Stop any active speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      
      // Stop listening
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      
      if (trainingTimeoutRef.current) {
        clearTimeout(trainingTimeoutRef.current);
        trainingTimeoutRef.current = null;
      }
      
      toast({
        title: "Training completed",
        description: `Session completed with ${trainingAccuracy.toFixed(1)}% accuracy`,
      });
      
      setTimeout(() => {
        speakText(`Training session completed. Your accuracy was ${trainingAccuracy.toFixed(0)} percent.`);
      }, 500);
    }
  }, [currentTrainingSession, trainingAccuracy, speakText, isListening]);

  const setCurrentContext = useCallback((context: string) => {
    const previousContext = currentContext;
    
    if (previousContext !== context) {
      // Immediately stop any current training
      if (isTraining) {
        setIsTraining(false);
        setTrainingMode(false);
        
        // Stop speech synthesis immediately
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        
        // Stop listening immediately
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
        }
        
        if (trainingTimeoutRef.current) {
          clearTimeout(trainingTimeoutRef.current);
          trainingTimeoutRef.current = null;
        }
        
        toast({
          title: "Context changed",
          description: `Switching to ${context} context. Training stopped.`,
        });
      }
      
      // Update context
      setCurrentContextState(context);
      
      // Announce new context immediately
      setTimeout(() => {
        speakText(`Switched to ${context} context. Ready for new commands.`, true);
      }, 200);
    }
  }, [currentContext, isTraining, isListening, speakText]);

  const improveRecognition = useCallback((command: string, wasCorrect: boolean) => {
    // Update user voice profile based on recognition results
    setUserVoiceProfile(prev => ({
      ...prev,
      [command]: {
        attempts: (prev[command]?.attempts || 0) + 1,
        successes: (prev[command]?.successes || 0) + (wasCorrect ? 1 : 0),
        lastAttempt: new Date()
      }
    }));
  }, []);

  const resetTraining = useCallback(() => {
    setTrainingProgress(0);
    setTrainingAccuracy(0);
    setCurrentTrainingSession(null);
    setIsTraining(false);
    setTrainingMode(false);
    setTrainingSessions([]);
    
    toast({
      title: "Training reset",
      description: "All training progress has been reset.",
    });
  }, []);

  const getTrainingFeedback = useCallback(() => {
    if (!currentTrainingSession) return "No active training session";
    
    const accuracy = trainingAccuracy;
    if (accuracy > 90) return "Excellent! Your voice recognition is very accurate.";
    if (accuracy > 75) return "Good progress! Keep practicing for better accuracy.";
    if (accuracy > 50) return "Fair recognition. Try speaking more clearly.";
    return "Need improvement. Speak slowly and clearly.";
  }, [currentTrainingSession, trainingAccuracy]);

  const value: EnhancedVoiceAssistantContextType = {
    // Basic controls
    isEnabled,
    isListening,
    toggleVoiceAssistant,
    startListening,
    stopListening,
    
    // Speech synthesis
    speakText,
    stopSpeaking,
    lastSpokenText,
    
    // Command management
    availableCommands,
    registerCommand,
    unregisterCommand,
    getContextualCommands,
    
    // Context awareness
    currentContext,
    setCurrentContext,
    
    // Training system
    isTraining,
    trainingMode,
    setTrainingMode,
    startTrainingSession,
    endTrainingSession,
    currentTrainingSession,
    trainingSessions,
    trainingProgress,
    trainingAccuracy,
    
    // Recognition data
    lastCommand,
    recognitionConfidence,
    confidenceLevel: recognitionConfidence,
    
    // Learning capabilities
    adaptToUserVoice,
    userVoiceProfile,
    improveRecognition,
    getTrainingFeedback,
    resetTraining
  };

  return (
    <EnhancedVoiceAssistantContext.Provider value={value}>
      {children}
    </EnhancedVoiceAssistantContext.Provider>
  );
};

export const useEnhancedVoiceAssistant = () => {
  const context = useContext(EnhancedVoiceAssistantContext);
  if (context === undefined) {
    throw new Error('useEnhancedVoiceAssistant must be used within an EnhancedVoiceAssistantProvider');
  }
  return context;
};