import { useState, useEffect } from "react";
import { InterfaceItem } from "@/types/interfaces";
import { toast } from "@/hooks/use-toast";
import { formPreview, pagePreview, dashboardPreview, initialInterfaces } from "./mockData";
import { InterfaceManagerHook } from "./types";

export const useInterfaceManager = (): InterfaceManagerHook => {
  // State for interfaces data
  const [interfaces, setInterfaces] = useState<InterfaceItem[]>(initialInterfaces);
  
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // State for loading and UI
  const [isLoading, setIsLoading] = useState(false);
  
  // State for dialogs
  const [editingInterface, setEditingInterface] = useState<InterfaceItem | null>(null);
  const [viewingInterface, setViewingInterface] = useState<InterfaceItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [interfaceToDelete, setInterfaceToDelete] = useState<string | null>(null);
  const [isZapierDialogOpen, setIsZapierDialogOpen] = useState(false);
  
  // State for bulk actions
  const [selectedForAction, setSelectedForAction] = useState<string[]>([]);
  
  // State for new interface creation
  const [newInterface, setNewInterface] = useState<{
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  }>({
    name: "",
    type: "form",
    description: ""
  });

  // Filter and sort interfaces
  const processedInterfaces = interfaces
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || item.type === filterType;
      const matchesStatus = filterStatus === "all" || item.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch(sortBy) {
        case "name":
          valueA = a.name;
          valueB = b.name;
          break;
        case "type":
          valueA = a.type;
          valueB = b.type;
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        case "viewCount":
          valueA = a.viewCount || 0;
          valueB = b.viewCount || 0;
          break;
        default: // updatedAt
          valueA = new Date(a.updatedAt).getTime();
          valueB = new Date(b.updatedAt).getTime();
      }
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get preview image based on type
  const getPreviewImage = (type: string) => {
    switch(type) {
      case "form": return formPreview;
      case "page": return pagePreview;
      case "dashboard": return dashboardPreview;
      default: return formPreview;
    }
  };

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // CRUD Operations
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

  // Other CRUD operations
  const updateInterface = () => {
    if (!editingInterface) return;
    
    setIsLoading(true);
    
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

  const deleteInterface = () => {
    if (!interfaceToDelete) return;
    
    setIsLoading(true);
    
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

  const bulkDeleteInterfaces = () => {
    if (selectedForAction.length === 0) return;
    
    setIsLoading(true);
    
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
  
  const confirmDelete = (id: string) => {
    setInterfaceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const openInterfaceEditor = (id: string) => {
    const interface_ = interfaces.find(item => item.id === id);
    if (interface_) {
      // Increment view count
      const updatedInterfaces = interfaces.map(item => 
        item.id === id ? { ...item, viewCount: (item.viewCount || 0) + 1 } : item
      );
      setInterfaces(updatedInterfaces);
      setEditingInterface(interface_);
    }
  };
  
  const openInterfaceDetails = (item: InterfaceItem) => {
    setViewingInterface(item);
  };
  
  const handleSelectInterface = (id: string) => {
    setSelectedForAction(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedForAction.length === processedInterfaces.length) {
      setSelectedForAction([]);
    } else {
      setSelectedForAction(processedInterfaces.map(item => item.id));
    }
  };

  // Simulate loading interfaces from API on mount
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return {
    interfaces: processedInterfaces,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    isLoading,
    editingInterface,
    setEditingInterface,
    viewingInterface,
    setViewingInterface,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    interfaceToDelete,
    setInterfaceToDelete,
    isZapierDialogOpen,
    setIsZapierDialogOpen,
    selectedForAction,
    setSelectedForAction,
    newInterface,
    setNewInterface,
    formatDate,
    getPreviewImage,
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
  };
};
