
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Save, 
  PlayCircle, 
  PauseCircle, 
  Trash2, 
  Clock, 
  ChevronDown 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { zapCreatorScripts } from "@/data/voiceScripts";

interface ZapHeaderProps {
  zapName: string;
  setZapName: (name: string) => void;
  isActive: boolean;
  toggleActivation: () => void;
  handleSave: (showToast?: boolean) => void;
  handleTest: () => void;
  handleDelete: () => void;
  lastSaved: Date | null;
  isLoading: boolean;
}

export const ZapHeader = ({
  zapName,
  setZapName,
  isActive,
  toggleActivation,
  handleSave,
  handleTest,
  handleDelete,
  lastSaved,
  isLoading
}: ZapHeaderProps) => {
  const voiceProps = {
    elementName: "Zap Header",
    hoverText: zapCreatorScripts.zapHeader.hover,
    clickText: zapCreatorScripts.zapHeader.click
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(voiceProps);
  
  return (
    <div 
      className="sticky top-0 bg-white z-10 border-b border-gray-200 pb-4"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div className="flex-1">
          <Input
            type="text"
            value={zapName}
            onChange={(e) => setZapName(e.target.value)}
            className="text-2xl font-bold border-0 border-b-2 border-transparent focus:border-purple-500 focus:outline-none focus:ring-0 bg-transparent w-full p-0"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={isLoading}
            onClick={handleTest}
          >
            <PlayCircle size={16} />
            Test
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={isLoading}
            onClick={() => handleSave(true)}
          >
            <Save size={16} />
            Save
          </Button>
          
          <Button
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={`gap-1 ${isActive ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            onClick={toggleActivation}
            disabled={isLoading}
          >
            {isActive ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
            {isActive ? "Turn Off" : "Turn On"}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 size={16} className="mr-2" />
                Delete Zap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-500">
        {lastSaved && (
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            Last saved {new Date(lastSaved).toLocaleTimeString()}
          </div>
        )}
        {isActive && (
          <Badge className="ml-2 bg-green-100 text-green-700 border border-green-200">
            Active
          </Badge>
        )}
      </div>
    </div>
  );
};
