
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

type VoiceAssistantContextType = {
  isEnabled: boolean;
  toggleVoiceAssistant: () => void;
  speakText: (text: string, priority?: boolean) => void;
  stopSpeaking: () => void;
};

// Create context with default values
const VoiceAssistantContext = createContext<VoiceAssistantContextType>({
  isEnabled: false,
  toggleVoiceAssistant: () => {},
  speakText: () => {},
  stopSpeaking: () => {},
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
  const [utteranceQueue, setUtteranceQueue] = useState<SpeechSynthesisUtterance[]>([]);
  
  // Initialize speech synthesis
  useEffect(() => {
    // Check if Speech Synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.error("Speech synthesis is not supported in this browser");
      toast({
        title: "Voice Assistant Unavailable",
        description: "Your browser doesn't support speech synthesis",
        variant: "destructive",
      });
      setIsEnabled(false);
      return;
    }

    // Set up event listeners for the speech synthesis
    const handleSpeechEnd = () => {
      setIsSpeaking(false);
      // Check if there are more utterances in the queue
      if (utteranceQueue.length > 0) {
        const nextUtterance = utteranceQueue[0];
        setUtteranceQueue(prev => prev.slice(1));
        window.speechSynthesis.speak(nextUtterance);
        setIsSpeaking(true);
      }
    };

    // Clean up event listeners when component unmounts
    return () => {
      stopSpeaking();
    };
  }, []);

  // Save preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("voiceAssistantEnabled", isEnabled.toString());
  }, [isEnabled]);

  // Function to toggle the voice assistant
  const toggleVoiceAssistant = () => {
    if (isEnabled) {
      stopSpeaking();
    }
    setIsEnabled(prev => !prev);
    toast({
      title: !isEnabled ? "Voice Assistant Enabled" : "Voice Assistant Disabled",
      description: !isEnabled 
        ? "Hover over elements for voice guidance" 
        : "Voice guidance is now turned off",
    });
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
      stopSpeaking
    }}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};
