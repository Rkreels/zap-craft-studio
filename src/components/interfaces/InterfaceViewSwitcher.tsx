
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { interfaceGuideScripts } from "./InterfaceVoiceGuide";

interface InterfaceViewSwitcherProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const InterfaceViewSwitcher: React.FC<InterfaceViewSwitcherProps> = ({ activeTab, setActiveTab }) => {
  // Voice guidance for gallery view
  const galleryVoiceProps = {
    elementName: "Gallery View",
    hoverText: "Gallery view displays interfaces as cards with visual previews.",
    clickText: interfaceGuideScripts.galleryView
  };
  const galleryGuidance = useVoiceGuidance(galleryVoiceProps);
  
  // Voice guidance for table view
  const tableVoiceProps = {
    elementName: "Table View",
    hoverText: "Table view displays interfaces in a detailed list format.",
    clickText: interfaceGuideScripts.tableView
  };
  const tableGuidance = useVoiceGuidance(tableVoiceProps);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger 
          value="gallery"
          onMouseEnter={galleryGuidance.handleMouseEnter}
          onClick={galleryGuidance.handleClick}
        >
          Gallery View
        </TabsTrigger>
        <TabsTrigger 
          value="table"
          onMouseEnter={tableGuidance.handleMouseEnter}
          onClick={tableGuidance.handleClick}
        >
          Table View
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default InterfaceViewSwitcher;
