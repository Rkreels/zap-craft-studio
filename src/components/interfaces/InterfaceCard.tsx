
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2, Copy, Settings, ExternalLink, EyeIcon, Clock } from "lucide-react";
import { InterfaceItem } from "@/types/interfaces";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { getTypeIcon } from "@/utils/interfaceIcons";

interface InterfaceCardProps {
  interfaceItem: InterfaceItem;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onView: () => void;
  onVersionHistory: () => void;
}

const InterfaceCard: React.FC<InterfaceCardProps> = ({
  interfaceItem,
  onEdit,
  onDuplicate,
  onDelete,
  onView,
  onVersionHistory
}) => {
  const item = interfaceItem; // For backward compatibility
  
  // Voice guidance for card
  const cardVoiceProps = {
    elementName: "Interface Card",
    hoverText: `${item.name} interface card. Type: ${item.type}. Status: ${item.status}.`,
    clickText: `Opening the ${item.name} interface for editing.`
  };
  const cardGuidance = useVoiceGuidance(cardVoiceProps);

  // Voice guidance for edit button
  const editVoiceProps = {
    elementName: "Edit Button",
    hoverText: `Edit the ${item.name} interface.`,
    clickText: `Opening the editor for ${item.name}.`
  };
  const editGuidance = useVoiceGuidance(editVoiceProps);

  // Voice guidance for duplicate button
  const duplicateVoiceProps = {
    elementName: "Duplicate Button",
    hoverText: `Duplicate the ${item.name} interface.`,
    clickText: `Creating a copy of ${item.name}.`
  };
  const duplicateGuidance = useVoiceGuidance(duplicateVoiceProps);

  // Voice guidance for delete button
  const deleteVoiceProps = {
    elementName: "Delete Button",
    hoverText: `Delete the ${item.name} interface.`,
    clickText: `Preparing to delete ${item.name}. This cannot be undone.`
  };
  const deleteGuidance = useVoiceGuidance(deleteVoiceProps);

  // Voice guidance for settings button
  const settingsVoiceProps = {
    elementName: "Settings Button",
    hoverText: `View details and settings for ${item.name}.`,
    clickText: `Opening details for ${item.name}.`
  };
  const settingsGuidance = useVoiceGuidance(settingsVoiceProps);

  // Voice guidance for version history button
  const historyVoiceProps = {
    elementName: "Version History Button",
    hoverText: `View version history for ${item.name}.`,
    clickText: `Opening version history for ${item.name}.`
  };
  const historyGuidance = useVoiceGuidance(historyVoiceProps);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card key={item.id} className="overflow-hidden">
      <div 
        className="relative h-48 bg-gray-100 cursor-pointer group" 
        onClick={() => {
          cardGuidance.handleClick();
          onEdit();
        }}
        onMouseEnter={cardGuidance.handleMouseEnter}
      >
        <img 
          src={item.preview} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button variant="outline" className="text-white border-white">
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
        </div>
        <Badge className="absolute top-2 right-2 flex items-center gap-1">
          {getTypeIcon(item.type)}
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Badge>
        {item.viewCount !== undefined && item.viewCount > 0 && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-white flex items-center gap-1">
            <EyeIcon size={14} />
            {item.viewCount}
          </Badge>
        )}
      </div>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg truncate">{item.name}</h3>
          <Badge className={item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
            {item.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
        </div>
        {item.description && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          Updated {formatDate(item.updatedAt)}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            editGuidance.handleClick();
            onEdit();
          }}
          onMouseEnter={editGuidance.handleMouseEnter}
        >
          <Edit size={16} className="mr-1" />
          Edit
        </Button>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              historyGuidance.handleClick();
              onVersionHistory();
            }}
            onMouseEnter={historyGuidance.handleMouseEnter}
          >
            <Clock size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              duplicateGuidance.handleClick();
              onDuplicate();
            }}
            onMouseEnter={duplicateGuidance.handleMouseEnter}
          >
            <Copy size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              deleteGuidance.handleClick();
              onDelete();
            }}
            onMouseEnter={deleteGuidance.handleMouseEnter}
          >
            <Trash2 size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              settingsGuidance.handleClick();
              onView();
            }}
            onMouseEnter={settingsGuidance.handleMouseEnter}
          >
            <Settings size={16} />
          </Button>
          {item.status === 'published' && (
            <Button variant="ghost" size="icon">
              <ExternalLink size={16} />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default InterfaceCard;
