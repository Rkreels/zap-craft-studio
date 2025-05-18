
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

// Import hooks
import { useInterfaceManager } from "@/hooks/useInterfaceManager";
import { getTypeIcon } from "@/utils/interfaceIcons";

// Import interface components
import InterfaceHeader from "@/components/interfaces/InterfaceHeader";
import InterfaceFilters from "@/components/interfaces/InterfaceFilters";
import InterfaceGallery from "@/components/interfaces/InterfaceGallery";
import InterfaceTable from "@/components/interfaces/InterfaceTable";
import InterfaceEditor from "@/components/interfaces/InterfaceEditor";
import InterfaceDetailsDialog from "@/components/interfaces/InterfaceDetailsDialog";
import DeleteInterfaceDialog from "@/components/interfaces/DeleteInterfaceDialog";
import ZapierIntegrationDialog from "@/components/interfaces/ZapierIntegrationDialog";
import InterfaceViewSwitcher from "@/components/interfaces/InterfaceViewSwitcher";
import { InterfaceVoiceGuide } from "@/components/interfaces/InterfaceVoiceGuide";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

export default function InterfacesPage() {
  const [activeTab, setActiveTab] = useState("gallery");
  const { isEnabled } = useVoiceAssistant();
  
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
    openInterfaceDetails,
    handleSelectInterface,
    toggleSelectAll
  } = useInterfaceManager();

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
      
      <TabsContent value="gallery" className="mt-4">
        <InterfaceGallery 
          interfaces={interfaces}
          isLoading={isLoading}
          openInterfaceEditor={openInterfaceEditor}
          duplicateInterface={duplicateInterface}
          confirmDelete={confirmDelete}
          openInterfaceDetails={openInterfaceDetails}
        />
      </TabsContent>
      
      <TabsContent value="table" className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
            <span className="ml-3">Loading interfaces...</span>
          </div>
        ) : interfaces.length === 0 ? (
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
        ) : (
          <InterfaceTable 
            interfaces={interfaces}
            selectedForAction={selectedForAction}
            handleSelectInterface={handleSelectInterface}
            toggleSelectAll={toggleSelectAll}
            openInterfaceEditor={openInterfaceEditor}
            duplicateInterface={duplicateInterface}
            confirmDelete={confirmDelete}
            sortBy={sortBy}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
            bulkPublishInterfaces={bulkPublishInterfaces}
            bulkDeleteInterfaces={bulkDeleteInterfaces}
            formatDate={formatDate}
          />
        )}
      </TabsContent>

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
    </div>
  );
}
