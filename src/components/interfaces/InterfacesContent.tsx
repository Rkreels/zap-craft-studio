
import React from "react";
import { InterfaceItem } from "@/types/interfaces";
import { Button } from "@/components/ui/button";
import { InterfaceGallery } from "./InterfaceGallery";
import { InterfaceTable } from "./InterfaceTable";

interface InterfacesContentProps {
  activeTab: string;
  interfaces: InterfaceItem[];
  isLoading: boolean;
  selectedForAction: string[];
  handleSelectInterface: (id: string) => void;
  toggleSelectAll: () => void;
  openInterfaceEditor: (id: string) => void;
  openInterfaceDetails: (id: string) => void; // Changed type to match hook function
  duplicateInterface: (item: InterfaceItem) => void;
  confirmDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
  openVersionHistory: (interfaceId: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: string) => void;
  setFilterStatus: (status: string) => void;
}

export const InterfacesContent: React.FC<InterfacesContentProps> = ({
  activeTab,
  interfaces,
  isLoading,
  selectedForAction,
  handleSelectInterface,
  toggleSelectAll,
  openInterfaceEditor,
  openInterfaceDetails,
  duplicateInterface,
  confirmDelete,
  formatDate,
  openVersionHistory,
  setSearchQuery,
  setFilterType,
  setFilterStatus
}) => {
  if (activeTab === "gallery") {
    return (
      <InterfaceGallery
        interfaces={interfaces}
        isLoading={isLoading}
        openInterfaceEditor={openInterfaceEditor}
        duplicateInterface={duplicateInterface}
        confirmDelete={confirmDelete}
        openInterfaceDetails={openInterfaceDetails}
        openVersionHistory={openVersionHistory}
      />
    );
  } else if (activeTab === "table") {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          <span className="ml-3">Loading interfaces...</span>
        </div>
      );
    } else if (interfaces.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No interfaces found</p>
          <Button variant="link" onClick={() => {
            setSearchQuery("");
            setFilterType("all");
            setFilterStatus("all");
          }}>
            Clear filters
          </Button>
        </div>
      );
    } else {
      return (
        <InterfaceTable
          interfaces={interfaces}
          selectedForAction={selectedForAction}
          handleSelectInterface={handleSelectInterface}
          toggleSelectAll={toggleSelectAll}
          openInterfaceEditor={openInterfaceEditor}
          duplicateInterface={duplicateInterface}
          confirmDelete={confirmDelete}
          formatDate={formatDate}
          openInterfaceDetails={openInterfaceDetails}
          openVersionHistory={openVersionHistory}
        />
      );
    }
  }
  
  return null;
};
