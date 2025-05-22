
import { useCallback } from 'react';
import { useVoiceAssistant } from '@/contexts/VoiceAssistantContext';

interface VoiceGuidanceProps {
  elementName: string;
  hoverText: string;
  clickText: string;
}

export function useVoiceGuidance(props: VoiceGuidanceProps) {
  const { speakText, isEnabled } = useVoiceAssistant();
  const { elementName, hoverText, clickText } = props;

  const handleMouseEnter = useCallback(() => {
    if (isEnabled) {
      speakText(hoverText);
    }
  }, [isEnabled, speakText, hoverText]);

  const handleClick = useCallback(() => {
    if (isEnabled) {
      speakText(clickText);
    }
  }, [isEnabled, speakText, clickText]);

  return { handleMouseEnter, handleClick };
}

// Higher-order component for voice guidance
export const withVoiceGuidance = (WrappedComponent: React.ComponentType<any>, guidanceProps: VoiceGuidanceProps) => {
  return function EnhancedComponent(props: any) {
    const { handleMouseEnter, handleClick } = useVoiceGuidance(guidanceProps);

    return (
      <div
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };
};
