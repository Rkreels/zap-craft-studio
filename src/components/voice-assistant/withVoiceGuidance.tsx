
import React, { useState } from "react";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

interface VoiceGuidanceProps {
  hoverText?: string;
  clickText?: string;
  elementName: string;
}

// Higher order component for voice guidance
export function withVoiceGuidance<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  guidanceProps: VoiceGuidanceProps
) {
  // Return a new component
  return (props: P) => {
    const { speakText, isEnabled } = useVoiceAssistant();
    const [hasSpoken, setHasSpoken] = useState(false);

    // Handlers
    const handleMouseEnter = () => {
      if (isEnabled && guidanceProps.hoverText && !hasSpoken) {
        speakText(guidanceProps.hoverText);
        setHasSpoken(true);
        // Reset hasSpoken after a delay
        setTimeout(() => setHasSpoken(false), 5000);
      }
    };

    const handleClick = () => {
      if (isEnabled && guidanceProps.clickText) {
        speakText(guidanceProps.clickText, true);
      }
    };

    // Return the wrapped component with enhanced props
    return (
      <div 
        onMouseEnter={handleMouseEnter} 
        onClick={handleClick}
        className="voice-guidance-wrapper"
      >
        <WrappedComponent {...props} />
      </div>
    );
  };
}

// Voice guidance hook for use directly in components
export const useVoiceGuidance = (guidanceProps: VoiceGuidanceProps) => {
  const { speakText, isEnabled } = useVoiceAssistant();
  const [hasSpoken, setHasSpoken] = useState(false);

  const handleMouseEnter = () => {
    if (isEnabled && guidanceProps.hoverText && !hasSpoken) {
      speakText(guidanceProps.hoverText);
      setHasSpoken(true);
      // Reset hasSpoken after a delay
      setTimeout(() => setHasSpoken(false), 5000);
    }
  };

  const handleClick = () => {
    if (isEnabled && guidanceProps.clickText) {
      speakText(guidanceProps.clickText, true);
    }
  };

  return { handleMouseEnter, handleClick };
};
