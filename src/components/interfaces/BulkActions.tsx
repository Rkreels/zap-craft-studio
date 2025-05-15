
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { interfaceGuideScripts } from "./InterfaceVoiceGuide";

interface BulkActionsProps {
  selectedCount: number;
  onPublish: () => void;
  onDelete: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedCount, onPublish, onDelete }) => {
  // Voice guidance for bulk actions
  const bulkActionsVoiceProps = {
    elementName: "Bulk Actions",
    hoverText: "These are bulk actions for selected interfaces.",
    clickText: interfaceGuideScripts.bulkActions
  };
  const bulkGuidance = useVoiceGuidance(bulkActionsVoiceProps);

  // Voice guidance for publish action
  const publishVoiceProps = {
    elementName: "Publish Action",
    hoverText: "Click to publish all selected interfaces.",
    clickText: "Publishing selected interfaces. This will make them available to users."
  };
  const publishGuidance = useVoiceGuidance(publishVoiceProps);

  // Voice guidance for delete action
  const deleteVoiceProps = {
    elementName: "Delete Action", 
    hoverText: "Click to delete all selected interfaces.",
    clickText: "Deleting selected interfaces. This action cannot be undone."
  };
  const deleteGuidance = useVoiceGuidance(deleteVoiceProps);

  if (selectedCount === 0) return null;
  
  return (
    <div 
      className="bg-gray-100 p-3 rounded-md mb-4 flex justify-between items-center"
      onMouseEnter={bulkGuidance.handleMouseEnter}
    >
      <div>
        <span className="font-medium">{selectedCount} items selected</span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            publishGuidance.handleClick();
            onPublish();
          }}
          onMouseEnter={publishGuidance.handleMouseEnter}
        >
          <Check size={16} className="mr-1" />
          Publish
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:text-red-700"
          onClick={() => {
            deleteGuidance.handleClick();
            onDelete();
          }}
          onMouseEnter={deleteGuidance.handleMouseEnter}
        >
          <Trash2 size={16} className="mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
