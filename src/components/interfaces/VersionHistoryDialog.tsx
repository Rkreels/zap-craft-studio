
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, RotateCcw, ArrowDown, ArrowUp } from "lucide-react";

// Mock version history data
const mockVersionHistory = [
  {
    id: "v1-1",
    version: "1.0",
    timestamp: "2025-05-09T10:20:00Z",
    author: "John Doe",
    changes: ["Interface created", "Added basic form fields"],
  },
  {
    id: "v1-2",
    version: "1.1",
    timestamp: "2025-05-10T14:30:00Z",
    author: "John Doe",
    changes: ["Added email validation", "Updated form styling"],
  },
  {
    id: "v1-3",
    version: "1.2",
    timestamp: "2025-05-12T09:15:00Z",
    author: "Jane Smith",
    changes: ["Connected email notification integration", "Fixed mobile responsiveness"],
  },
  {
    id: "v1-4",
    version: "2.0",
    timestamp: "2025-05-15T16:45:00Z",
    author: "John Doe",
    changes: ["Complete redesign", "Added new fields", "Implemented advanced validation logic"],
  }
];

interface VersionHistoryDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  interfaceId: string;
  onRestoreVersion: (versionId: string) => void;
}

const VersionHistoryDialog: React.FC<VersionHistoryDialogProps> = ({
  isOpen,
  setIsOpen,
  interfaceId,
  onRestoreVersion
}) => {
  // In a real application, we would fetch version history based on interfaceId
  const versionHistory = mockVersionHistory;
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Voice guidance
  const dialogVoiceProps = {
    elementName: "Version History Dialog",
    hoverText: "Version history dialog shows all previous versions of this interface.",
    clickText: "This dialog displays the version history. You can select a version to restore."
  };
  const dialogGuidance = useVoiceGuidance(dialogVoiceProps);

  // Voice guidance for restore button
  const restoreVoiceProps = {
    elementName: "Restore Version Button",
    hoverText: "Restore to selected version.",
    clickText: "Restoring interface to the selected version. Your current version will be saved as a new version."
  };
  const restoreGuidance = useVoiceGuidance(restoreVoiceProps);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Sort versions
  const sortedVersions = [...versionHistory].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl" onMouseEnter={dialogGuidance.handleMouseEnter}>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Clock className="mr-2" size={18} />
            Version History
          </DialogTitle>
          <DialogDescription>
            View and restore previous versions of this interface
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {versionHistory.length} versions
          </div>
          <Button variant="outline" size="sm" onClick={toggleSortOrder}>
            {sortOrder === 'desc' ? (
              <>Newest First <ArrowDown className="ml-1" size={14} /></>
            ) : (
              <>Oldest First <ArrowUp className="ml-1" size={14} /></>
            )}
          </Button>
        </div>

        <ScrollArea className="max-h-[400px]">
          <div className="space-y-3">
            {sortedVersions.map((version) => (
              <div 
                key={version.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedVersion === version.id 
                    ? "border-primary bg-primary/5" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedVersion(version.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium flex items-center">
                      Version {version.version}
                      {version.id === versionHistory[versionHistory.length - 1].id && (
                        <Badge className="ml-2 bg-green-100 text-green-700">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(version.timestamp)} by {version.author}
                    </div>
                  </div>
                </div>
                
                <ul className="text-sm text-gray-600 ml-4 list-disc mt-2">
                  {version.changes.map((change, idx) => (
                    <li key={idx}>{change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (selectedVersion) {
                restoreGuidance.handleClick();
                onRestoreVersion(selectedVersion);
                setIsOpen(false);
              }
            }}
            disabled={!selectedVersion}
            onMouseEnter={restoreGuidance.handleMouseEnter}
            className="flex items-center"
          >
            <RotateCcw size={16} className="mr-1" />
            Restore Selected Version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistoryDialog;
