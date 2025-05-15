
import React, { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { interfacesScripts } from "@/data/voiceScripts";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";

// Import interface components
import InterfaceHeader from "@/components/interfaces/InterfaceHeader";
import InterfaceFilters from "@/components/interfaces/InterfaceFilters";
import InterfaceGallery from "@/components/interfaces/InterfaceGallery";
import InterfaceTable from "@/components/interfaces/InterfaceTable";
import InterfaceEditor from "@/components/interfaces/InterfaceEditor";
import InterfaceDetailsDialog from "@/components/interfaces/InterfaceDetailsDialog";
import DeleteInterfaceDialog from "@/components/interfaces/DeleteInterfaceDialog";
import ZapierIntegrationDialog from "@/components/interfaces/ZapierIntegrationDialog";

// Import types
import { InterfaceItem } from "@/types/interfaces";
import { FileText, Layout, List, EyeIcon } from "lucide-react";

// Mock placeholder image URLs
const formPreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Form+Interface";
const pagePreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Page+Interface";
const dashboardPreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Dashboard+Interface";

// Mock data for interfaces
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

export default function InterfacesPage() {
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
  const [activeTab, setActiveTab] = useState("gallery");
  
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section with search and filters */}
      <InterfaceHeader 
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">Gallery View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery" className="mt-4">
          <InterfaceGallery 
            interfaces={processedInterfaces}
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
          ) : processedInterfaces.length === 0 ? (
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
              interfaces={processedInterfaces}
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
              getTypeIcon={getTypeIcon}
              formatDate={formatDate}
            />
          )}
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
