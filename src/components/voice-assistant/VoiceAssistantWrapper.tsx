
import React, { useEffect } from "react";
import { VoiceAssistantToggle } from "./VoiceAssistantToggle";
import { VoiceCommandRegistry } from "./VoiceCommandRegistry";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface VoiceAssistantWrapperProps {
  children: React.ReactNode;
}

export const VoiceAssistantWrapper: React.FC<VoiceAssistantWrapperProps> = ({ children }) => {
  const { isEnabled, speakText } = useVoiceAssistant();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Handle page navigation announcements
  useEffect(() => {
    if (isEnabled) {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const pageName = pathSegments.length > 0 
        ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ') 
        : 'dashboard';
      
      speakText(`Navigated to ${pageName} page.`);
    }
  }, [location, isEnabled, speakText]);
  
  return (
    <TooltipProvider>
      <>
        {/* Include the command registry */}
        <VoiceCommandRegistry />
        
        {children}
        
        <div 
          className={`fixed ${
            isMobile ? 'bottom-4 right-4' : 'bottom-8 right-8'
          } z-50 shadow-lg rounded-full bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700`}
        >
          <VoiceAssistantToggle />
        </div>
      </>
    </TooltipProvider>
  );
};
