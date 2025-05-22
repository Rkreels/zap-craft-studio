
import React, { useState } from "react";
import { InterfacesContent } from "@/components/interfaces/InterfacesContent";
import InterfaceHeader from "@/components/interfaces/InterfaceHeader";
import { InterfaceVoiceCommands } from "@/components/interfaces/InterfaceVoiceCommands";
import { useInterfaceManager } from "@/hooks/useInterfaceManager";

const InterfacesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("gallery");
  const [isZapierDialogOpen, setIsZapierDialogOpen] = useState(false);
  
  // Initialize interface manager hook to get all the interface functionalities
  const { 
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
    createInterface,
    newInterface,
    setNewInterface,
    setFilterStatus
  } = useInterfaceManager();

  // Function to open version history
  const openVersionHistory = (id: string) => {
    console.log(`Opening version history for interface ${id}`);
    // This would typically open a dialog or navigate to a version history page
  };

  return (
    <>
      <InterfaceVoiceCommands />
      <div className="container mx-auto py-6 space-y-6">
        <InterfaceHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          newInterface={newInterface}
          setNewInterface={setNewInterface}
          interfaces={interfaces}
          isLoading={isLoading}
          createInterface={createInterface}
          setIsZapierDialogOpen={setIsZapierDialogOpen}
        />
        <InterfacesContent
          activeTab={activeTab}
          interfaces={interfaces}
          isLoading={isLoading}
          selectedForAction={selectedForAction}
          handleSelectInterface={handleSelectInterface}
          toggleSelectAll={toggleSelectAll}
          openInterfaceEditor={openInterfaceEditor}
          openInterfaceDetails={openInterfaceDetails}
          duplicateInterface={duplicateInterface}
          confirmDelete={confirmDelete}
          formatDate={formatDate}
          openVersionHistory={openVersionHistory}
          setSearchQuery={setSearchQuery}
          setFilterType={setFilterType}
          setFilterStatus={setFilterStatus}
        />
      </div>
    </>
  );
};

export default InterfacesPage;
