
import { InterfaceItem } from "@/types/interfaces";
import { toast } from "@/components/ui/use-toast";

// Mock placeholder image URLs (moved from the main file)
export const formPreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Form+Interface";
export const pagePreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Page+Interface";
export const dashboardPreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Dashboard+Interface";

// Format date for display
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Get preview image based on type
export const getPreviewImage = (type: string) => {
  switch(type) {
    case "form": return formPreview;
    case "page": return pagePreview;
    case "dashboard": return dashboardPreview;
    default: return formPreview;
  }
};

// CRUD Operations
export const createInterfaceOperation = (
  newInterface: { name: string; type: "form" | "page" | "dashboard"; description: string },
  setIsLoading: (loading: boolean) => void,
  setInterfaces: React.Dispatch<React.SetStateAction<InterfaceItem[]>>,
  setNewInterface: React.Dispatch<React.SetStateAction<{
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  }>>
) => {
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

export const updateInterfaceOperation = (
  editingInterface: InterfaceItem | null,
  setIsLoading: (loading: boolean) => void,
  setInterfaces: React.Dispatch<React.SetStateAction<InterfaceItem[]>>,
  setEditingInterface: React.Dispatch<React.SetStateAction<InterfaceItem | null>>
) => {
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

export const deleteInterfaceOperation = (
  interfaceToDelete: string | null,
  setIsLoading: (loading: boolean) => void,
  setInterfaces: React.Dispatch<React.SetStateAction<InterfaceItem[]>>,
  setIsDeleteDialogOpen: (open: boolean) => void,
  setInterfaceToDelete: (id: string | null) => void
) => {
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

export const duplicateInterfaceOperation = (
  item: InterfaceItem,
  setIsLoading: (loading: boolean) => void,
  setInterfaces: React.Dispatch<React.SetStateAction<InterfaceItem[]>>
) => {
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

export const bulkOperations = {
  bulkDeleteInterfaces: (
    selectedForAction: string[],
    setIsLoading: (loading: boolean) => void,
    setInterfaces: React.Dispatch<React.SetStateAction<InterfaceItem[]>>,
    setSelectedForAction: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
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
  },

  bulkPublishInterfaces: (
    selectedForAction: string[],
    setIsLoading: (loading: boolean) => void,
    setInterfaces: React.Dispatch<React.SetStateAction<InterfaceItem[]>>,
    setSelectedForAction: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
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
  }
};
