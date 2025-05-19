
import { InterfaceItem } from "@/types/interfaces";
import { Dispatch, SetStateAction } from "react";
import { toast } from "@/components/ui/use-toast";
import { getPreviewImage } from "./interfaceOperations";

// Hook for interface creation
export const useInterfaceCreation = (
  newInterface: {
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  },
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setInterfaces: Dispatch<SetStateAction<InterfaceItem[]>>,
  setNewInterface: Dispatch<SetStateAction<{
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  }>>
) => {
  const createInterface = () => {
    if (!newInterface.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your new interface",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const createdInterface: InterfaceItem = {
        id: `interface-${Date.now()}`,
        name: newInterface.name,
        type: newInterface.type,
        description: newInterface.description,
        preview: getPreviewImage(newInterface.type),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "draft",
        fields: [],
        integrations: [],
        viewCount: 0
      };
      
      setInterfaces(prev => [...prev, createdInterface]);
      setNewInterface({
        name: "",
        type: "form",
        description: ""
      });
      setIsLoading(false);
      
      toast({
        title: "Interface created",
        description: `${newInterface.name} has been created successfully.`
      });
    }, 800);
  };

  return { createInterface };
};

// Hook for interface update
export const useInterfaceUpdate = (
  editingInterface: InterfaceItem | null,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setInterfaces: Dispatch<SetStateAction<InterfaceItem[]>>,
  setEditingInterface: Dispatch<SetStateAction<InterfaceItem | null>>
) => {
  const updateInterface = () => {
    if (!editingInterface) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setInterfaces(prev => prev.map(item => 
        item.id === editingInterface.id 
          ? { ...editingInterface, updatedAt: new Date().toISOString() } 
          : item
      ));
      
      setIsLoading(false);
      setEditingInterface(null);
      
      toast({
        title: "Interface updated",
        description: `${editingInterface.name} has been updated successfully.`
      });
    }, 800);
  };

  return { updateInterface };
};

// Hook for interface deletion
export const useInterfaceDeletion = (
  interfaceToDelete: string | null,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setInterfaces: Dispatch<SetStateAction<InterfaceItem[]>>,
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>,
  setInterfaceToDelete: Dispatch<SetStateAction<string | null>>
) => {
  const deleteInterface = () => {
    if (!interfaceToDelete) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setInterfaces(prev => prev.filter(item => item.id !== interfaceToDelete));
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setInterfaceToDelete(null);
      
      toast({
        title: "Interface deleted",
        description: "The interface has been deleted successfully.",
        variant: "destructive"
      });
    }, 800);
  };

  return { deleteInterface };
};

// Hook for bulk operations on interfaces
export const useInterfaceBulkOperations = (
  selectedForAction: string[],
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setInterfaces: Dispatch<SetStateAction<InterfaceItem[]>>,
  setSelectedForAction: Dispatch<SetStateAction<string[]>>
) => {
  const bulkDeleteInterfaces = () => {
    if (selectedForAction.length === 0) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setInterfaces(prev => prev.filter(item => !selectedForAction.includes(item.id)));
      setSelectedForAction([]);
      setIsLoading(false);
      
      toast({
        title: "Interfaces deleted",
        description: `${selectedForAction.length} interfaces have been deleted successfully.`,
        variant: "destructive"
      });
    }, 800);
  };

  const bulkPublishInterfaces = () => {
    if (selectedForAction.length === 0) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setInterfaces(prev => prev.map(item => 
        selectedForAction.includes(item.id) 
          ? { ...item, status: "published", updatedAt: new Date().toISOString() } 
          : item
      ));
      setSelectedForAction([]);
      setIsLoading(false);
      
      toast({
        title: "Interfaces published",
        description: `${selectedForAction.length} interfaces have been published successfully.`
      });
    }, 800);
  };

  const duplicateInterface = (item: InterfaceItem) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const duplicatedInterface: InterfaceItem = {
        ...item,
        id: `interface-${Date.now()}`,
        name: `${item.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "draft",
        viewCount: 0
      };
      
      setInterfaces(prev => [...prev, duplicatedInterface]);
      setIsLoading(false);
      
      toast({
        title: "Interface duplicated",
        description: `A copy of ${item.name} has been created.`
      });
    }, 800);
  };

  return { bulkDeleteInterfaces, bulkPublishInterfaces, duplicateInterface };
};
