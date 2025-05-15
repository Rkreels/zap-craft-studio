
import React, { useEffect } from "react";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

// Define guide scripts for different interface features
const interfaceGuideScripts = {
  pageIntro: "Welcome to the Interfaces page. Here you can manage your form, page, and dashboard interfaces. Use the gallery or table view to see your interfaces.",
  galleryView: "Gallery view shows your interfaces as cards with previews. Click on a card to edit the interface.",
  tableView: "Table view shows your interfaces in a list with details. You can select multiple interfaces for bulk actions.",
  createInterface: "To create a new interface, click the Create button at the top right.",
  filterInterfaces: "Use the search and filters to find specific interfaces by name, type or status.",
  bulkActions: "Select multiple interfaces to perform actions on them, such as publishing or deleting.",
  interfaceDetails: "Click the settings icon to view detailed information about an interface."
};

// Component to manage voice guidance for the interfaces page
const InterfaceVoiceGuide: React.FC = () => {
  const { isEnabled, speakText } = useVoiceAssistant();

  // Initial page introduction
  useEffect(() => {
    if (isEnabled) {
      // Slight delay to ensure it doesn't speak immediately on page load
      const timer = setTimeout(() => {
        speakText(interfaceGuideScripts.pageIntro);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isEnabled, speakText]);

  // Export method to speak guide for specific features
  const speakGuide = (guideKey: keyof typeof interfaceGuideScripts) => {
    if (isEnabled && interfaceGuideScripts[guideKey]) {
      speakText(interfaceGuideScripts[guideKey]);
    }
  };

  // This component doesn't render anything visible
  return null;
};

// Export both the component and the guide scripts for use throughout the interfaces section
export { InterfaceVoiceGuide, interfaceGuideScripts };
