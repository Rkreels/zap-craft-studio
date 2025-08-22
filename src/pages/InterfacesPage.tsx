
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
import { toast } from "@/hooks/use-toast";

const InterfacesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("gallery");
  const [isZapierDialogOpen, setIsZapierDialogOpen] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [advancedBuilderInterface, setAdvancedBuilderInterface] = useState<InterfaceItem | null>(null);
  
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

  const realTimeInterface = useRealTimeInterface();

  const openVersionHistory = (id: string) => {
    console.log(`Opening version history for interface ${id}`);
    toast({
      title: "Version History",
      description: "Version history feature will be available soon.",
    });
  };

  const createInterface = async () => {
    if (!newInterface.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an interface name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const createdInterface = await realTimeInterface.createInterface({
        name: newInterface.name,
        type: newInterface.type,
        description: newInterface.description || `A new ${newInterface.type} interface`
      });
      
      setNewInterface({
        name: "",
        type: "form",
        description: ""
      });
      
      setAdvancedBuilderInterface(createdInterface);
      
      toast({
        title: "Interface Created",
        description: `${createdInterface.name} has been created successfully.`,
      });
    } catch (error) {
      console.error('Failed to create interface:', error);
      toast({
        title: "Error",
        description: "Failed to create interface. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openInterfaceEditor = async (id: string) => {
    try {
      const interface_ = interfaces.find(item => item.id === id);
      if (interface_) {
        setEditingInterface(interface_);
      } else {
        toast({
          title: "Error",
          description: "Interface not found.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to open interface editor:', error);
      toast({
        title: "Error",
        description: "Failed to open interface editor.",
        variant: "destructive",
      });
    }
  };

  const duplicateInterface = async (item: InterfaceItem) => {
    try {
      await realTimeInterface.duplicateInterface(item.id);
      toast({
        title: "Interface Duplicated",
        description: `${item.name} (Copy) has been created.`,
      });
    } catch (error) {
      console.error('Failed to duplicate interface:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate interface.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (id: string) => {
    const interfaceToDelete = interfaces.find(item => item.id === id);
    if (interfaceToDelete) {
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (interfaceToDelete) {
      try {
        await realTimeInterface.deleteInterface(interfaceToDelete);
        setIsDeleteDialogOpen(false);
        toast({
          title: "Interface Deleted",
          description: "The interface has been successfully deleted.",
        });
      } catch (error) {
        console.error('Failed to delete interface:', error);
        toast({
          title: "Error",
          description: "Failed to delete interface.",
          variant: "destructive",
        });
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
      
      toast({
        title: "Template Applied",
        description: `Interface created from ${template.name} template.`,
      });
    } catch (error) {
      console.error('Failed to create interface from template:', error);
      toast({
        title: "Error",
        description: "Failed to create interface from template.",
        variant: "destructive",
      });
    }
  };

  const handleBuilderSave = async (interface_: InterfaceItem) => {
    try {
      await realTimeInterface.updateInterface(interface_.id, interface_);
      setAdvancedBuilderInterface(null);
      toast({
        title: "Interface Saved",
        description: "Your interface has been saved successfully.",
      });
    } catch (error) {
      console.error('Failed to save interface:', error);
      toast({
        title: "Error",
        description: "Failed to save interface.",
        variant: "destructive",
      });
    }
  };

  const handleBuilderPreview = () => {
    if (advancedBuilderInterface) {
      console.log('Preview interface:', advancedBuilderInterface);
      toast({
        title: "Preview",
        description: "Preview functionality will be available soon.",
      });
    }
  };

  const updateInterface = async () => {
    if (editingInterface) {
      try {
        await realTimeInterface.updateInterface(editingInterface.id, editingInterface);
        setEditingInterface(null);
      } catch (error) {
        console.error('Failed to update interface:', error);
        throw error;
      }
    }
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
                description: "A quickly created interface"
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
        updateInterface={updateInterface}
      />

      <DeleteInterfaceDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirmDelete={handleDeleteConfirm}
        isLoading={isLoading}
      />

      <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <InterfaceTemplateSelector
            onSelectTemplate={handleTemplateSelect}
            onClose={() => setShowTemplateSelector(false)}
          />
        </DialogContent>
      </Dialog>

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
