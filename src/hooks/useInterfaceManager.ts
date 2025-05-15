
import { useState, useEffect } from "react";
import { InterfaceItem } from "@/types/interfaces";
import { toast } from "@/hooks/use-toast";

// Mock placeholder image URLs
const formPreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Form+Interface";
const pagePreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Page+Interface";
const dashboardPreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Dashboard+Interface";

// Initial mock data for interfaces
const initialInterfaces: InterfaceItem[] = [
  {
    id: "interface-1",
    name: "Customer Registration Form",
    type: "form",
    description: "A comprehensive registration form for new customers to fill out their details",
    preview: formPreview,
    createdAt: "2025-05-03T10:20:00Z",
    updatedAt: "2025-05-10T14:30:00Z",
    status: "published",
    fields: [
      { id: "field-1", name: "fullName", type: "text", required: true, label: "Full Name" },
      { id: "field-2", name: "email", type: "email", required: true, label: "Email Address" },
      { id: "field-3", name: "phone", type: "tel", required: false, label: "Phone Number" }
    ],
    integrations: [
      { id: "int-1", name: "Email Notification", type: "email", enabled: true, config: { recipient: "support@example.com" } }
    ],
    viewCount: 237
  },
  {
    id: "interface-2",
    name: "Analytics Dashboard",
    type: "dashboard",
    description: "Interactive dashboard displaying key performance metrics and analytics data",
    preview: dashboardPreview,
    createdAt: "2025-05-05T11:45:00Z",
    updatedAt: "2025-05-12T09:15:00Z",
    status: "published",
    integrations: [
      { id: "int-2", name: "Data Source", type: "api", enabled: true, config: { endpoint: "https://api.example.com/metrics" } }
    ],
    logic: [
      { id: "logic-1", name: "Refresh Data", type: "trigger", config: { interval: 30 } }
    ],
    viewCount: 486
  },
  {
    id: "interface-3",
    name: "Product Catalog",
    type: "page",
    description: "Product listing page with filtering and sorting capabilities",
    preview: pagePreview,
    createdAt: "2025-05-08T16:30:00Z",
    updatedAt: "2025-05-08T16:30:00Z",
    status: "draft",
    integrations: [
      { id: "int-3", name: "Product Database", type: "database", enabled: true, config: { source: "products" } }
    ],
    viewCount: 0
  }
];

export const useInterfaceManager = () => {
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

  // Get icon based on type
  const getTypeIcon = (type: string) => {
    switch(type) {
      case "form": return <FileText size={16} />;
      case "page": return <Layout size={16} />;
      case "dashboard": return <List size={16} />;
      default: return <FileText size={16} />;
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
    getTypeIcon,
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
