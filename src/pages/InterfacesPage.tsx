
import React, { useState } from "react";
import { InterfacesContent } from "@/components/interfaces/InterfacesContent";
import InterfaceHeader from "@/components/interfaces/InterfaceHeader";
import { InterfaceVoiceCommands } from "@/components/interfaces/InterfaceVoiceCommands";
import { InterfaceDetailsDialog } from "@/components/interfaces/InterfaceDetailsDialog";
import InterfaceEditor from "@/components/interfaces/InterfaceEditor";
import DeleteInterfaceDialog from "@/components/interfaces/DeleteInterfaceDialog";
import { InterfaceTemplateSelector } from "@/components/interfaces/InterfaceTemplateSelector";
import { AdvancedInterfaceBuilder } from "@/components/interfaces/AdvancedInterfaceBuilder";
import { useInterfaceManager } from "@/hooks/useInterfaceManager";
import { useRealTimeInterface } from "@/hooks/useInterfaceManager/realTimeInterface";
import { InterfaceItem } from "@/types/interfaces";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const InterfacesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("gallery");
  const [isZapierDialogOpen, setIsZapierDialogOpen] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [advancedBuilderInterface, setAdvancedBuilderInterface] = useState<InterfaceItem | null>(null);
  
  // Initialize interface manager hook to get all the interface functionalities
  const { 
    interfaces,
    isLoading,
    selectedForAction,
    handleSelectInterface,
    toggleSelectAll,
    openInterfaceDetails,
    formatDate,
    newInterface,
    setNewInterface,
    setFilterStatus,
    editingInterface,
    setEditingInterface,
    viewingInterface,
    setViewingInterface,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    interfaceToDelete,
    deleteInterface
  } = useInterfaceManager();

  // Real-time interface management
  const realTimeInterface = useRealTimeInterface();

  // Function to open version history
  const openVersionHistory = (id: string) => {
    console.log(`Opening version history for interface ${id}`);
    // This would typically open a dialog or navigate to a version history page
  };

  // Enhanced create interface with template support
  const createInterface = async () => {
    if (newInterface.name.trim()) {
      try {
        const createdInterface = await realTimeInterface.createInterface({
          name: newInterface.name,
          type: newInterface.type,
          description: newInterface.description
        });
        
        setNewInterface({
          name: "",
          type: "form",
          description: ""
        });
        
        // Open advanced builder for the new interface
        setAdvancedBuilderInterface(createdInterface);
      } catch (error) {
        console.error('Failed to create interface:', error);
      }
    }
  };

  // Enhanced interface operations
  const openInterfaceEditor = async (id: string) => {
    try {
      const interface_ = interfaces.find(item => item.id === id);
      if (interface_) {
        setAdvancedBuilderInterface(interface_);
      }
    } catch (error) {
      console.error('Failed to open interface editor:', error);
    }
  };

  const duplicateInterface = async (item: InterfaceItem) => {
    try {
      await realTimeInterface.duplicateInterface(item.id);
    } catch (error) {
      console.error('Failed to duplicate interface:', error);
    }
  };

  const confirmDelete = (id: string) => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (interfaceToDelete) {
      try {
        await realTimeInterface.deleteInterface(interfaceToDelete);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error('Failed to delete interface:', error);
      }
    }
  };

  const handleTemplateSelect = async (template: any) => {
    try {
      const createdInterface = await realTimeInterface.createInterface({
        name: template.name,
        type: template.type,
        description: template.description,
        fields: template.fields
      });
      
      setShowTemplateSelector(false);
      setAdvancedBuilderInterface(createdInterface);
    } catch (error) {
      console.error('Failed to create interface from template:', error);
    }
  };

  const handleBuilderSave = async (interface_: InterfaceItem) => {
    try {
      await realTimeInterface.updateInterface(interface_.id, interface_);
      setAdvancedBuilderInterface(null);
    } catch (error) {
      console.error('Failed to save interface:', error);
    }
  };

  const handleBuilderPreview = () => {
    // Implement preview functionality
    console.log('Preview interface:', advancedBuilderInterface);
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

        {/* Quick Actions */}
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            onClick={() => setShowTemplateSelector(true)}
          >
            Use Template
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setNewInterface({
                name: "New Interface",
                type: "form",
                description: ""
              });
              createInterface();
            }}
          >
            Quick Create
          </Button>
        </div>

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

      {/* Dialogs */}
      <InterfaceDetailsDialog
        viewingInterface={viewingInterface}
        setViewingInterface={setViewingInterface}
        setEditingInterface={setEditingInterface}
        confirmDelete={confirmDelete}
        duplicateInterface={duplicateInterface}
        formatDate={formatDate}
        openVersionHistory={openVersionHistory}
      />

      <InterfaceEditor
        editingInterface={editingInterface}
        isLoading={isLoading}
        setEditingInterface={setEditingInterface}
        updateInterface={async () => {
          if (editingInterface) {
            await realTimeInterface.updateInterface(editingInterface.id, editingInterface);
            setEditingInterface(null);
          }
        }}
      />

      <DeleteInterfaceDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirmDelete={handleDeleteConfirm}
        isLoading={isLoading}
      />

      {/* Template Selector Dialog */}
      <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <InterfaceTemplateSelector
            onSelectTemplate={handleTemplateSelect}
            onClose={() => setShowTemplateSelector(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Advanced Builder Dialog */}
      <Dialog 
        open={!!advancedBuilderInterface} 
        onOpenChange={() => setAdvancedBuilderInterface(null)}
      >
        <DialogContent className="max-w-7xl max-h-[90vh] p-0">
          {advancedBuilderInterface && (
            <AdvancedInterfaceBuilder
              interface_={advancedBuilderInterface}
              onSave={handleBuilderSave}
              onPreview={handleBuilderPreview}
              onClose={() => setAdvancedBuilderInterface(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InterfacesPage;
