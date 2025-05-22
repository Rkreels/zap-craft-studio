
import React from "react";
import { PageVoiceCommands } from "@/components/voice-assistant/PageVoiceCommands";
import { useInterfaceManager } from "@/hooks/useInterfaceManager";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const InterfaceVoiceCommands: React.FC = () => {
  const {
    createInterface,
    setFilterType,
    setFilterStatus,
    setSortBy,
    setSortDirection,
    newInterface,
    setNewInterface,
    interfaces
  } = useInterfaceManager();
  
  const navigate = useNavigate();
  
  const introMessage = "Welcome to the Interfaces page. You can use voice commands to filter, sort, or create new interfaces.";
  
  const commands = [
    {
      command: "create new interface",
      description: "Start creating a new interface",
      action: () => {
        setNewInterface({
          name: "New Voice Created Interface",
          type: "form",
          description: "Created using voice commands"
        });
        setTimeout(() => {
          createInterface();
          toast({
            title: "Interface Created",
            description: "New interface created via voice command"
          });
        }, 500);
      },
      aliases: ["new interface", "add interface"]
    },
    {
      command: "filter by forms",
      description: "Filter to show only form interfaces",
      action: () => {
        setFilterType("form");
        toast({
          title: "Filter Applied",
          description: "Showing only form interfaces"
        });
      },
      aliases: ["show forms", "display forms"]
    },
    {
      command: "filter by pages",
      description: "Filter to show only page interfaces",
      action: () => {
        setFilterType("page");
        toast({
          title: "Filter Applied",
          description: "Showing only page interfaces"
        });
      },
      aliases: ["show pages", "display pages"]
    },
    {
      command: "filter by dashboards",
      description: "Filter to show only dashboard interfaces",
      action: () => {
        setFilterType("dashboard");
        toast({
          title: "Filter Applied",
          description: "Showing only dashboard interfaces"
        });
      },
      aliases: ["show dashboards", "display dashboards"]
    },
    {
      command: "show all interfaces",
      description: "Clear all filters",
      action: () => {
        setFilterType("all");
        setFilterStatus("all");
        toast({
          title: "Filters Cleared",
          description: "Showing all interfaces"
        });
      },
      aliases: ["clear filters", "reset filters"]
    },
    {
      command: "show published interfaces",
      description: "Filter to show only published interfaces",
      action: () => {
        setFilterStatus("published");
        toast({
          title: "Filter Applied",
          description: "Showing only published interfaces"
        });
      }
    },
    {
      command: "show drafts",
      description: "Filter to show only draft interfaces",
      action: () => {
        setFilterStatus("draft");
        toast({
          title: "Filter Applied",
          description: "Showing only draft interfaces"
        });
      },
      aliases: ["show draft interfaces"]
    },
    {
      command: "sort by name",
      description: "Sort interfaces by name",
      action: () => {
        setSortBy("name");
        setSortDirection("asc");
        toast({
          title: "Sort Applied",
          description: "Interfaces sorted by name"
        });
      }
    },
    {
      command: "sort by date",
      description: "Sort interfaces by date updated",
      action: () => {
        setSortBy("updatedAt");
        setSortDirection("desc");
        toast({
          title: "Sort Applied",
          description: "Interfaces sorted by date updated"
        });
      },
      aliases: ["sort by update date"]
    },
    {
      command: "edit first interface",
      description: "Open the first interface for editing",
      action: () => {
        if (interfaces.length > 0) {
          navigate(`/interfaces/edit/${interfaces[0].id}`);
          toast({
            title: "Opening Interface",
            description: `Editing ${interfaces[0].name}`
          });
        } else {
          toast({
            title: "No Interfaces Found",
            description: "There are no interfaces available to edit",
            variant: "destructive"
          });
        }
      }
    }
  ];
  
  return <PageVoiceCommands pageName="Interfaces" commands={commands} introMessage={introMessage} />;
};
