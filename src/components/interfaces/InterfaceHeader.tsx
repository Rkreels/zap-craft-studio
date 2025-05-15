
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Layout, List, CodeXml } from "lucide-react";
import CreateInterfaceDialog from "./CreateInterfaceDialog";

interface InterfaceHeaderProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filterType: string;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
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
  isLoading: boolean;
  createInterface: () => void;
  setIsZapierDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InterfaceHeader: React.FC<InterfaceHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  newInterface,
  setNewInterface,
  isLoading,
  createInterface,
  setIsZapierDialogOpen
}) => {
  return (
    <>
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Interfaces</h1>
        <p className="text-gray-600">Create and manage custom forms, pages, and dashboards</p>
      </div>

      {/* Action bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search interfaces"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={filterType === "all" ? "default" : "outline"} 
            onClick={() => setFilterType("all")}
            className="whitespace-nowrap"
          >
            All Types
          </Button>
          <Button 
            variant={filterType === "form" ? "default" : "outline"} 
            onClick={() => setFilterType("form")}
            className="whitespace-nowrap"
          >
            <FileText size={16} className="mr-1" />
            Forms
          </Button>
          <Button 
            variant={filterType === "page" ? "default" : "outline"} 
            onClick={() => setFilterType("page")}
            className="whitespace-nowrap"
          >
            <Layout size={16} className="mr-1" />
            Pages
          </Button>
          <Button 
            variant={filterType === "dashboard" ? "default" : "outline"} 
            onClick={() => setFilterType("dashboard")}
            className="whitespace-nowrap"
          >
            <List size={16} className="mr-1" />
            Dashboards
          </Button>
        </div>
        
        <CreateInterfaceDialog
          newInterface={newInterface}
          setNewInterface={setNewInterface}
          isLoading={isLoading}
          createInterface={createInterface}
        />
        
        <Button 
          variant="outline" 
          onClick={() => setIsZapierDialogOpen(true)}
          className="gap-2 whitespace-nowrap"
        >
          <CodeXml size={16} />
          Connect to Zapier
        </Button>
      </div>
    </>
  );
};

export default InterfaceHeader;
