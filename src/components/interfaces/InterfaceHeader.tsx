
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Download, History, Zap } from "lucide-react";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { interfaceGuideScripts } from "./InterfaceVoiceGuide";
import CreateInterfaceDialog from "./CreateInterfaceDialog";
import ExportInterfacesDialog from "./ExportInterfacesDialog";
import VersionHistoryDialog from "./VersionHistoryDialog";
import { toast } from "@/hooks/use-toast";
import { InterfaceItem } from "@/types/interfaces";

interface InterfaceHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  newInterface: {
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  };
  setNewInterface: React.Dispatch<React.SetStateAction<{
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  }>>;
  interfaces: InterfaceItem[];
  isLoading: boolean;
  createInterface: () => void;
  setIsZapierDialogOpen: (isOpen: boolean) => void;
}

const InterfaceHeader: React.FC<InterfaceHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  newInterface,
  setNewInterface,
  interfaces,
  isLoading,
  createInterface,
  setIsZapierDialogOpen
}) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isVersionHistoryDialogOpen, setIsVersionHistoryDialogOpen] = useState(false);
  const [selectedInterfaceId, setSelectedInterfaceId] = useState<string>("interface-1");

  // Voice guidance for header
  const headerVoiceProps = {
    elementName: "Interface Header",
    hoverText: "Interface management header with search and actions.",
    clickText: "This is the header section for managing interfaces."
  };
  const headerGuidance = useVoiceGuidance(headerVoiceProps);

  // Voice guidance for search
  const searchVoiceProps = {
    elementName: "Search Interfaces",
    hoverText: "Search interfaces by name or description.",
    clickText: "Enter text to search for interfaces by name or description."
  };
  const searchGuidance = useVoiceGuidance(searchVoiceProps);

  // Voice guidance for create
  const createVoiceProps = {
    elementName: "Create Interface",
    hoverText: "Create a new interface.",
    clickText: interfaceGuideScripts.createInterface
  };
  const createGuidance = useVoiceGuidance(createVoiceProps);

  // Voice guidance for export
  const exportVoiceProps = {
    elementName: "Export Interfaces",
    hoverText: "Export interfaces to different formats.",
    clickText: "Opens the export dialog to export interfaces in JSON or CSV format."
  };
  const exportGuidance = useVoiceGuidance(exportVoiceProps);

  // Voice guidance for history
  const historyVoiceProps = {
    elementName: "Version History",
    hoverText: "View interface version history.",
    clickText: "Opens the version history dialog to view and restore previous versions."
  };
  const historyGuidance = useVoiceGuidance(historyVoiceProps);

  // Voice guidance for zapier
  const zapierVoiceProps = {
    elementName: "Zapier Integration",
    hoverText: "Configure Zapier integrations.",
    clickText: "Opens the Zapier integration dialog to connect your interfaces with other applications."
  };
  const zapierGuidance = useVoiceGuidance(zapierVoiceProps);

  // Handler for restoring a version
  const handleRestoreVersion = (versionId: string) => {
    toast({
      title: "Version restored",
      description: `Interface has been restored to version ${versionId.split('-')[1]}.`
    });
  };

  return (
    <div 
      className="mb-6 pt-6"
      onMouseEnter={headerGuidance.handleMouseEnter}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold">Interfaces</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              historyGuidance.handleClick();
              setIsVersionHistoryDialogOpen(true);
            }}
            onMouseEnter={historyGuidance.handleMouseEnter}
          >
            <History size={16} />
            History
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              exportGuidance.handleClick();
              setIsExportDialogOpen(true);
            }}
            onMouseEnter={exportGuidance.handleMouseEnter}
          >
            <Download size={16} />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              zapierGuidance.handleClick();
              setIsZapierDialogOpen(true);
            }}
            onMouseEnter={zapierGuidance.handleMouseEnter}
          >
            <Zap size={16} />
            Zapier
          </Button>
          <CreateInterfaceDialog
            newInterface={newInterface}
            setNewInterface={setNewInterface}
            isLoading={isLoading}
            createInterface={createInterface}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search interfaces..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onMouseEnter={searchGuidance.handleMouseEnter}
            onClick={searchGuidance.handleClick}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
            className="flex-1 sm:flex-none"
          >
            All
          </Button>
          <Button
            variant={filterType === "form" ? "default" : "outline"}
            onClick={() => setFilterType("form")}
            className="flex-1 sm:flex-none"
          >
            Forms
          </Button>
          <Button
            variant={filterType === "page" ? "default" : "outline"}
            onClick={() => setFilterType("page")}
            className="flex-1 sm:flex-none"
          >
            Pages
          </Button>
          <Button
            variant={filterType === "dashboard" ? "default" : "outline"}
            onClick={() => setFilterType("dashboard")}
            className="flex-1 sm:flex-none"
          >
            Dashboards
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <ExportInterfacesDialog 
        isOpen={isExportDialogOpen}
        setIsOpen={setIsExportDialogOpen}
        interfaces={interfaces}
      />

      <VersionHistoryDialog
        isOpen={isVersionHistoryDialogOpen}
        setIsOpen={setIsVersionHistoryDialogOpen}
        interfaceId={selectedInterfaceId}
        onRestoreVersion={handleRestoreVersion}
      />
    </div>
  );
};

export default InterfaceHeader;
