
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

// Import hooks
import { useInterfaceManager } from "@/hooks/useInterfaceManager";

// Import interface components
import InterfaceHeader from "@/components/interfaces/InterfaceHeader";
import InterfaceFilters from "@/components/interfaces/InterfaceFilters";
import InterfaceEditor from "@/components/interfaces/InterfaceEditor";
import { InterfaceDetailsDialog } from "@/components/interfaces/InterfaceDetailsDialog";
import DeleteInterfaceDialog from "@/components/interfaces/DeleteInterfaceDialog";
import ZapierIntegrationDialog from "@/components/interfaces/ZapierIntegrationDialog";
import InterfaceViewSwitcher from "@/components/interfaces/InterfaceViewSwitcher";
import { InterfaceVoiceGuide } from "@/components/interfaces/InterfaceVoiceGuide";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import VersionHistoryDialog from "@/components/interfaces/VersionHistoryDialog";
import { InterfacesContent } from "@/components/interfaces/InterfacesContent";

export default function InterfacesPage() {
  const [activeTab, setActiveTab] = useState("gallery");
  const { isEnabled } = useVoiceAssistant();
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [selectedInterfaceId, setSelectedInterfaceId] = useState<string>("");
  
  const {
    interfaces,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    sortBy,
    sortDirection,
    isLoading,
    editingInterface,
    setEditingInterface,
    viewingInterface,
    setViewingInterface,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isZapierDialogOpen,
    setIsZapierDialogOpen,
    selectedForAction,
    newInterface,
    setNewInterface,
    formatDate,
    toggleSort,
    createInterface,
    updateInterface,
    deleteInterface,
    bulkDeleteInterfaces,
    bulkPublishInterfaces,
    duplicateInterface,
    confirmDelete,
    openInterfaceEditor,
    handleSelectInterface,
    toggleSelectAll
  } = useInterfaceManager();
  
  // Function to handle opening interface details
  const openInterfaceDetails = (id: string) => {
    const interface_ = interfaces.find(item => item.id === id);
    if (interface_) {
      setViewingInterface(interface_);
    }
  };

  // Open version history dialog
  const openVersionHistory = (interfaceId: string) => {
    setSelectedInterfaceId(interfaceId);
    setIsVersionHistoryOpen(true);
  };

  // Handle version restore
  const handleRestoreVersion = (versionId: string) => {
    console.log(`Restoring interface ${selectedInterfaceId} to version ${versionId}`);
    // In a real implementation, this would fetch the version and update the interface
  };

  // Load voice guide if enabled
  useEffect(() => {
    // This effect runs when the voice assistant status changes
  }, [isEnabled]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Voice guidance component (no visual UI) */}
      {isEnabled && <InterfaceVoiceGuide />}
      
      {/* Header section with search and filters */}
      <InterfaceHeader 
        interfaces={interfaces}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        newInterface={newInterface}
        setNewInterface={setNewInterface}
        isLoading={isLoading}
        createInterface={createInterface}
        setIsZapierDialogOpen={setIsZapierDialogOpen}
      />

      {/* Status filters and sorting */}
      <InterfaceFilters 
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        sortDirection={sortDirection}
        toggleSort={toggleSort}
      />
      
      {/* View selector tabs */}
      <InterfaceViewSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Tabs content */}
      <Tabs value={activeTab} className="mt-4">
        <TabsContent value="gallery">
          <InterfacesContent
            activeTab="gallery"
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
        </TabsContent>
        
        <TabsContent value="table">
          <InterfacesContent
            activeTab="table"
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
        </TabsContent>
      </Tabs>

      {/* Interface editor dialog */}
      <InterfaceEditor 
        editingInterface={editingInterface}
        isLoading={isLoading}
        setEditingInterface={setEditingInterface}
        updateInterface={updateInterface}
      />

      {/* Interface details dialog */}
      <InterfaceDetailsDialog 
        viewingInterface={viewingInterface}
        setViewingInterface={setViewingInterface}
        setEditingInterface={setEditingInterface}
        confirmDelete={confirmDelete}
        duplicateInterface={duplicateInterface}
        formatDate={formatDate}
        openVersionHistory={openVersionHistory}
      />

      {/* Delete confirmation dialog */}
      <DeleteInterfaceDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirmDelete={deleteInterface}
        isLoading={isLoading}
      />
      
      {/* Zapier integration dialog */}
      <ZapierIntegrationDialog 
        isOpen={isZapierDialogOpen}
        setIsOpen={setIsZapierDialogOpen}
        interfaces={interfaces}
      />

      {/* Version history dialog */}
      <VersionHistoryDialog
        isOpen={isVersionHistoryOpen}
        setIsOpen={setIsVersionHistoryOpen}
        interfaceId={selectedInterfaceId}
        onRestoreVersion={handleRestoreVersion}
      />
    </div>
  );
}
