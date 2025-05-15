
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy, 
  Share2, 
  ExternalLink, 
  Layout, 
  FileText, 
  List,
  Settings,
  Code,
  PlayCircle,
  CodeXml,
  Database,
  Check,
  X,
  EyeIcon
} from "lucide-react";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { interfacesScripts } from "@/data/voiceScripts";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Type definitions for our data
interface InterfaceItem {
  id: string;
  name: string;
  type: "form" | "page" | "dashboard";
  description?: string;
  preview: string; // URL of preview image
  createdAt: string;
  updatedAt: string;
  status: "published" | "draft";
  templateJson?: string;
  fields?: InterfaceField[];
  integrations?: InterfaceIntegration[];
  logic?: InterfaceLogic[];
  collaborators?: string[];
  viewCount?: number;
}

interface InterfaceField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
}

interface InterfaceIntegration {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

interface InterfaceLogic {
  id: string;
  name: string;
  type: "condition" | "action" | "trigger";
  config: Record<string, unknown>;
}

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
  const [interfaces, setInterfaces] = useState<InterfaceItem[]>(initialInterfaces);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [editingInterface, setEditingInterface] = useState<InterfaceItem | null>(null);
  const [activeTab, setActiveTab] = useState("gallery");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [viewingInterface, setViewingInterface] = useState<InterfaceItem | null>(null);
  const [selectedForAction, setSelectedForAction] = useState<string[]>([]);
  
  const [newInterface, setNewInterface] = useState<{
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  }>({
    name: "",
    type: "form",
    description: ""
  });
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [interfaceToDelete, setInterfaceToDelete] = useState<string | null>(null);
  const [isZapierDialogOpen, setIsZapierDialogOpen] = useState(false);
  
  // Voice guidance
  const editorVoiceProps = {
    elementName: "Interface Editor",
    hoverText: interfacesScripts.interfaceEditor.hover,
    clickText: interfacesScripts.interfaceEditor.click
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(editorVoiceProps);

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

  const deleteInterface = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setInterfaces(prev => prev.filter(item => item.id !== id));
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

  const handleTriggerZapierWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Triggering Zapier webhook:", webhookUrl);

    try {
      // Since we're using no-cors, we won't get a proper response status
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
          interfaces: interfaces.filter(item => item.status === "published").map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            url: `${window.location.origin}/interface/${item.id}`
          }))
        }),
      });

      toast({
        title: "Request Sent",
        description: "The request was sent to Zapier. Please check your Zap's history to confirm it was triggered.",
      });
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description: "Failed to trigger the Zapier webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsZapierDialogOpen(false);
    }
  };

  const openInterfaceEditor = (id: string) => {
    const interface_ = interfaces.find(item => item.id === id);
    if (interface_) {
      // Increment view count
      const updatedInterfaces = interfaces.map(item => 
        item.id === id ? { ...item, viewCount: (item.viewCount || 0) + 1 } : item
      );
      setInterfaces(updatedInterfaces);
      
      toast({
        title: "Interface Editor",
        description: `Opening ${interface_.name}. This would navigate to a full editor in a production app.`
      });
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
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Interfaces</h1>
        <p className="text-gray-600">Create and manage custom forms, pages, and dashboards</p>
      </div>

      {/* Action bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search interfaces"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={filterType === "all" ? "default" : "outline"} 
            onClick={() => setFilterType("all")}
            className="whitespace-nowrap"
          >
            All Types
          </Button>
          <Button 
            variant={filterType === "form" ? "default" : "outline"} 
            onClick={() => setFilterType("form")}
            className="whitespace-nowrap"
          >
            <FileText size={16} className="mr-1" />
            Forms
          </Button>
          <Button 
            variant={filterType === "page" ? "default" : "outline"} 
            onClick={() => setFilterType("page")}
            className="whitespace-nowrap"
          >
            <Layout size={16} className="mr-1" />
            Pages
          </Button>
          <Button 
            variant={filterType === "dashboard" ? "default" : "outline"} 
            onClick={() => setFilterType("dashboard")}
            className="whitespace-nowrap"
          >
            <List size={16} className="mr-1" />
            Dashboards
          </Button>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 whitespace-nowrap">
              <Plus size={16} />
              Create
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Interface</DialogTitle>
              <DialogDescription>
                Select a type and enter a name for your new interface.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Interface Name"
                value={newInterface.name}
                onChange={(e) => setNewInterface({...newInterface, name: e.target.value})}
                className="mb-4"
              />
              
              <Textarea
                placeholder="Description (optional)"
                value={newInterface.description}
                onChange={(e) => setNewInterface({...newInterface, description: e.target.value})}
                className="mb-4"
              />
              
              <div className="mb-2">Interface Type:</div>
              <div className="flex gap-2">
                <Button 
                  variant={newInterface.type === "form" ? "default" : "outline"} 
                  onClick={() => setNewInterface({...newInterface, type: "form"})}
                  className="flex-1"
                >
                  <FileText size={16} className="mr-2" />
                  Form
                </Button>
                <Button 
                  variant={newInterface.type === "page" ? "default" : "outline"} 
                  onClick={() => setNewInterface({...newInterface, type: "page"})}
                  className="flex-1"
                >
                  <Layout size={16} className="mr-2" />
                  Page
                </Button>
                <Button 
                  variant={newInterface.type === "dashboard" ? "default" : "outline"} 
                  onClick={() => setNewInterface({...newInterface, type: "dashboard"})}
                  className="flex-1"
                >
                  <List size={16} className="mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewInterface({ name: "", type: "form", description: "" })}>Cancel</Button>
              <Button onClick={createInterface} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Interface"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="outline" 
          onClick={() => setIsZapierDialogOpen(true)}
          className="gap-2 whitespace-nowrap"
        >
          <CodeXml size={16} />
          Connect to Zapier
        </Button>
      </div>

      {/* Secondary action bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2">
          <Button 
            variant={filterStatus === "all" ? "default" : "outline"} 
            onClick={() => setFilterStatus("all")}
          >
            All Status
          </Button>
          <Button 
            variant={filterStatus === "published" ? "default" : "outline"} 
            onClick={() => setFilterStatus("published")}
          >
            Published
          </Button>
          <Button 
            variant={filterStatus === "draft" ? "default" : "outline"} 
            onClick={() => setFilterStatus("draft")}
          >
            Draft
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => toggleSort("updatedAt")}
            className="gap-1"
          >
            Sort: {sortBy === "updatedAt" ? (sortDirection === "asc" ? "Oldest" : "Newest") : "Date"}
          </Button>
          <Button
            variant="outline"
            onClick={() => toggleSort("viewCount")}
            className="gap-1"
          >
            <EyeIcon size={16} /> 
            {sortBy === "viewCount" ? (sortDirection === "asc" ? "Least" : "Most") : ""} Views
          </Button>
        </div>
      </div>
      
      {/* View selector tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">Gallery View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery" className="mt-4">
          {/* Interfaces grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
          >
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                <span className="ml-3">Loading interfaces...</span>
              </div>
            ) : processedInterfaces.length === 0 ? (
              <div className="col-span-full text-center py-12">
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
              processedInterfaces.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative h-48 bg-gray-100 cursor-pointer group" onClick={() => openInterfaceEditor(item.id)}>
                    <img 
                      src={item.preview} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button variant="outline" className="text-white border-white">
                        <Edit size={16} className="mr-2" />
                        Edit
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2 flex items-center gap-1">
                      {getTypeIcon(item.type)}
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                    {item.viewCount !== undefined && item.viewCount > 0 && (
                      <Badge variant="outline" className="absolute top-2 left-2 bg-white flex items-center gap-1">
                        <EyeIcon size={14} />
                        {item.viewCount}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg truncate">{item.name}</h3>
                      <Badge className={item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    {item.description && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      Updated {formatDate(item.updatedAt)}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="ghost" size="sm" onClick={() => openInterfaceEditor(item.id)}>
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => duplicateInterface(item)}>
                        <Copy size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete(item.id)}>
                        <Trash2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openInterfaceDetails(item)}>
                        <Settings size={16} />
                      </Button>
                      {item.status === 'published' && (
                        <Button variant="ghost" size="icon">
                          <ExternalLink size={16} />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="table" className="mt-4">
          {/* Table view */}
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
            <>
              {selectedForAction.length > 0 && (
                <div className="bg-gray-100 p-3 rounded-md mb-4 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{selectedForAction.length} items selected</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={bulkPublishInterfaces}
                    >
                      <Check size={16} className="mr-1" />
                      Publish
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={bulkDeleteInterfaces}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
                  
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input 
                        type="checkbox" 
                        checked={selectedForAction.length === processedInterfaces.length && processedInterfaces.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => toggleSort("name")}
                    >
                      Name {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => toggleSort("type")}
                    >
                      Type {sortBy === "type" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => toggleSort("status")}
                    >
                      Status {sortBy === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => toggleSort("updatedAt")}
                    >
                      Updated {sortBy === "updatedAt" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => toggleSort("viewCount")}
                    >
                      Views {sortBy === "viewCount" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedInterfaces.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          checked={selectedForAction.includes(item.id)}
                          onChange={() => handleSelectInterface(item.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            {item.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center w-fit gap-1">
                          {getTypeIcon(item.type)}
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {item.status === 'published' ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.updatedAt)}</TableCell>
                      <TableCell>{item.viewCount || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openInterfaceEditor(item.id)}>
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => duplicateInterface(item)}>
                            <Copy size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => confirmDelete(item.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit interface dialog */}
      <Dialog open={!!editingInterface} onOpenChange={(open) => !open && setEditingInterface(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Interface</DialogTitle>
            <DialogDescription>
              Update the details of your interface.
            </DialogDescription>
          </DialogHeader>
          {editingInterface && (
            <div className="py-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                  <TabsTrigger value="fields">Fields & Elements</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <Input
                    placeholder="Interface Name"
                    value={editingInterface.name}
                    onChange={(e) => setEditingInterface({...editingInterface, name: e.target.value})}
                    className="mb-4"
                  />
                  
                  <Textarea
                    placeholder="Description"
                    value={editingInterface.description || ""}
                    onChange={(e) => setEditingInterface({...editingInterface, description: e.target.value})}
                    className="mb-4"
                  />
                  
                  <div className="mb-2">Interface Type:</div>
                  <div className="flex gap-2">
                    <Button 
                      variant={editingInterface.type === "form" ? "default" : "outline"} 
                      onClick={() => setEditingInterface({...editingInterface, type: "form"})}
                      className="flex-1"
                    >
                      <FileText size={16} className="mr-2" />
                      Form
                    </Button>
                    <Button 
                      variant={editingInterface.type === "page" ? "default" : "outline"} 
                      onClick={() => setEditingInterface({...editingInterface, type: "page"})}
                      className="flex-1"
                    >
                      <Layout size={16} className="mr-2" />
                      Page
                    </Button>
                    <Button 
                      variant={editingInterface.type === "dashboard" ? "default" : "outline"} 
                      onClick={() => setEditingInterface({...editingInterface, type: "dashboard"})}
                      className="flex-1"
                    >
                      <List size={16} className="mr-2" />
                      Dashboard
                    </Button>
                  </div>
                  
                  <div className="mt-4 mb-2">Status:</div>
                  <div className="flex gap-2">
                    <Button 
                      variant={editingInterface.status === "draft" ? "default" : "outline"} 
                      onClick={() => setEditingInterface({...editingInterface, status: "draft"})}
                      className="flex-1"
                    >
                      Draft
                    </Button>
                    <Button 
                      variant={editingInterface.status === "published" ? "default" : "outline"} 
                      onClick={() => setEditingInterface({...editingInterface, status: "published"})}
                      className="flex-1"
                    >
                      Published
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="fields" className="space-y-4 pt-4">
                  <h3 className="font-medium">Form Fields & Elements</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {editingInterface.type === "form" ? 
                      "Add and configure form fields for collecting user data." :
                      editingInterface.type === "dashboard" ?
                        "Add charts, metrics, and display elements to your dashboard." :
                        "Add content blocks, sections, and interactive elements to your page."
                    }
                  </p>
                  
                  {/* Field list */}
                  <div className="border rounded-md divide-y">
                    {(editingInterface.fields || []).length > 0 ? 
                      (editingInterface.fields || []).map((field, index) => (
                        <div key={field.id} className="p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{field.label}</div>
                            <div className="text-sm text-gray-500">
                              {field.type} {field.required && "(Required)"}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      )) : (
                        <div className="p-4 text-center text-gray-500">
                          No fields added yet
                        </div>
                      )
                    }
                  </div>
                  
                  <Button className="w-full">
                    <Plus size={16} className="mr-2" />
                    Add New Field
                  </Button>
                </TabsContent>
                
                <TabsContent value="integrations" className="space-y-4 pt-4">
                  <h3 className="font-medium">Connected Integrations</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Connect your interface with external services and APIs
                  </p>
                  
                  {/* Integrations list */}
                  <div className="border rounded-md divide-y">
                    {(editingInterface.integrations || []).length > 0 ? 
                      (editingInterface.integrations || []).map((integration) => (
                        <div key={integration.id} className="p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{integration.name}</div>
                            <div className="text-sm text-gray-500">{integration.type}</div>
                          </div>
                          <div className="flex gap-1 items-center">
                            <Badge variant={integration.enabled ? "default" : "outline"}>
                              {integration.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <Settings size={16} />
                            </Button>
                          </div>
                        </div>
                      )) : (
                        <div className="p-4 text-center text-gray-500">
                          No integrations added yet
                        </div>
                      )
                    }
                  </div>
                  
                  <Button className="w-full">
                    <Plus size={16} className="mr-2" />
                    Add New Integration
                  </Button>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <h4 className="font-medium flex items-center gap-2">
                      <Database size={16} />
                      Data Connections
                    </h4>
                    <p className="text-sm mt-1">
                      Connect your interface to data sources or APIs to power dynamic content.
                    </p>
                    <Button variant="outline" className="mt-2">
                      <Plus size={16} className="mr-1" />
                      Connect Data Source
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingInterface(null)}>Cancel</Button>
            <Button onClick={updateInterface} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interface details dialog */}
      <Dialog open={!!viewingInterface} onOpenChange={(open) => !open && setViewingInterface(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewingInterface && getTypeIcon(viewingInterface.type)}
              {viewingInterface?.name}
              {viewingInterface?.status === "published" && (
                <Badge className="ml-2 bg-green-100 text-green-700">Published</Badge>
              )}
              {viewingInterface?.status === "draft" && (
                <Badge className="ml-2 bg-gray-100 text-gray-700">Draft</Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Interface details and statistics
            </DialogDescription>
          </DialogHeader>
          
          {viewingInterface && (
            <div className="py-4">
              <div className="flex gap-4 mb-6">
                <div className="w-1/3">
                  <img 
                    src={viewingInterface.preview}
                    alt={viewingInterface.name}
                    className="w-full h-auto rounded-md border"
                  />
                </div>
                <div className="w-2/3">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-600 mb-4">
                    {viewingInterface.description || "No description provided."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Created</div>
                      <div>{formatDate(viewingInterface.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Last Updated</div>
                      <div>{formatDate(viewingInterface.updatedAt)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Type</div>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(viewingInterface.type)}
                        {viewingInterface.type.charAt(0).toUpperCase() + viewingInterface.type.slice(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Views</div>
                      <div>{viewingInterface.viewCount || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Fields</h3>
              <div className="mb-4">
                {(viewingInterface.fields || []).length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(viewingInterface.fields || []).map(field => (
                        <tr key={field.id} className="border-b">
                          <td className="py-2">{field.label}</td>
                          <td className="py-2">{field.type}</td>
                          <td className="py-2">{field.required ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No fields defined</p>
                )}
              </div>
              
              <h3 className="font-medium mb-2">Integrations</h3>
              <div className="mb-4">
                {(viewingInterface.integrations || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(viewingInterface.integrations || []).map(integration => (
                      <Badge key={integration.id} variant="outline" className="px-3 py-1">
                        {integration.name} ({integration.type})
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No integrations connected</p>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div>
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => {
                      setEditingInterface(viewingInterface);
                      setViewingInterface(null);
                    }}
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline">
                    <Copy size={16} className="mr-1" />
                    Duplicate
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  className="text-red-600"
                  onClick={() => {
                    confirmDelete(viewingInterface.id);
                    setViewingInterface(null);
                  }}
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Interface</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this interface? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => interfaceToDelete && deleteInterface(interfaceToDelete)}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Interface"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Zapier integration dialog */}
      <Dialog open={isZapierDialogOpen} onOpenChange={setIsZapierDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CodeXml size={18} />
              Connect to Zapier
            </DialogTitle>
            <DialogDescription>
              Integrate your interfaces with Zapier to automate workflows
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-1">What you can do with Zapier</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Automatically create records in your CRM when a form is submitted</li>
                <li>Send email notifications when interfaces are published</li>
                <li>Update spreadsheets with interface analytics</li>
                <li>Create calendar events for publishing schedules</li>
              </ul>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Zapier Webhook URL
              </label>
              <Input
                placeholder="https://hooks.zapier.com/your-webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Create a Zapier webhook trigger and paste the URL here
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Data that will be sent to Zapier</h4>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-auto">
                {JSON.stringify({
                  timestamp: new Date().toISOString(),
                  triggered_from: "your-app.com",
                  interfaces: [
                    {
                      id: "interface-id",
                      name: "Example Interface",
                      type: "form",
                      url: "https://your-app.com/interface/example-id"
                    }
                  ]
                }, null, 2)}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsZapierDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleTriggerZapierWebhook}
              disabled={isLoading || !webhookUrl}
            >
              {isLoading ? "Connecting..." : "Connect & Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
