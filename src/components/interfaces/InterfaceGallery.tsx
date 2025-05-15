
import React from "react";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { InterfaceItem } from "@/types/interfaces";
import InterfaceCard from "./InterfaceCard";
import { interfacesScripts } from "@/data/voiceScripts";
import { Button } from "@/components/ui/button";

interface InterfaceGalleryProps {
  interfaces: InterfaceItem[];
  isLoading: boolean;
  openInterfaceEditor: (id: string) => void;
  duplicateInterface: (item: InterfaceItem) => void;
  confirmDelete: (id: string) => void;
  openInterfaceDetails: (item: InterfaceItem) => void;
}

const InterfaceGallery: React.FC<InterfaceGalleryProps> = ({
  interfaces,
  isLoading,
  openInterfaceEditor,
  duplicateInterface,
  confirmDelete,
  openInterfaceDetails,
}) => {
  // Voice guidance
  const editorVoiceProps = {
    elementName: "Interface Editor",
    hoverText: interfacesScripts.interfaceEditor.hover,
    clickText: interfacesScripts.interfaceEditor.click
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(editorVoiceProps);

  if (isLoading) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
        <span className="ml-3">Loading interfaces...</span>
      </div>
    );
  }

  if (interfaces.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500">No interfaces found</p>
        <Button variant="link" onClick={() => {
          // This would typically clear filters in the parent component
        }}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      {interfaces.map((item) => (
        <InterfaceCard
          key={item.id}
          item={item}
          openInterfaceEditor={openInterfaceEditor}
          duplicateInterface={duplicateInterface}
          confirmDelete={confirmDelete}
          openInterfaceDetails={openInterfaceDetails}
        />
      ))}
    </div>
  );
};

export default InterfaceGallery;
