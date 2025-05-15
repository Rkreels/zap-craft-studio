
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  List 
} from "lucide-react";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { interfacesScripts } from "@/data/voiceScripts";

// Type definitions for our data
interface InterfaceItem {
  id: string;
  name: string;
  type: "form" | "page" | "dashboard";
  preview: string; // URL of preview image
  createdAt: string;
  updatedAt: string;
  status: "published" | "draft";
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
    preview: formPreview,
    createdAt: "2025-05-03T10:20:00Z",
    updatedAt: "2025-05-10T14:30:00Z",
    status: "published"
  },
  {
    id: "interface-2",
    name: "Analytics Dashboard",
    type: "dashboard",
    preview: dashboardPreview,
    createdAt: "2025-05-05T11:45:00Z",
    updatedAt: "2025-05-12T09:15:00Z",
    status: "published"
  },
  {
    id: "interface-3",
    name: "Product Catalog",
    type: "page",
    preview: pagePreview,
    createdAt: "2025-05-08T16:30:00Z",
    updatedAt: "2025-05-08T16:30:00Z",
    status: "draft"
  }
];

export default function InterfacesPage() {
  const [interfaces, setInterfaces] = useState<InterfaceItem[]>(initialInterfaces);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [editingInterface, setEditingInterface] = useState<InterfaceItem | null>(null);
  const [newInterface, setNewInterface] = useState({
    name: "",
    type: "form" as const
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [interfaceToDelete, setInterfaceToDelete] = useState<string | null>(null);
  
  // Voice guidance
  const editorVoiceProps = {
    elementName: "Interface Editor",
    hoverText: interfacesScripts.interfaceEditor.hover,
    clickText: interfacesScripts.interfaceEditor.click
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(editorVoiceProps);

  // Filter interfaces based on search query and type
  const filteredInterfaces = interfaces.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
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
        preview: getPreviewImage(newInterface.type),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "draft"
      };
      
      setInterfaces(prev => [...prev, createdInterface]);
      setNewInterface({
        name: "",
        type: "form"
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
        status: "draft"
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
    toast({
      title: "Interface Editor",
      description: `Opening interface editor. This would navigate to a full editor in a production app.`
    });
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
              <Button variant="outline" onClick={() => setNewInterface({ name: "", type: "form" })}>Cancel</Button>
              <Button onClick={createInterface} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Interface"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
        ) : filteredInterfaces.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No interfaces found</p>
            <Button variant="link" onClick={() => {
              setSearchQuery("");
              setFilterType("all");
            }}>
              Clear filters
            </Button>
          </div>
        ) : (
          filteredInterfaces.map((item) => (
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
              </div>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg truncate">{item.name}</h3>
                  <Badge className={item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {item.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
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

      {/* Edit interface dialog */}
      <Dialog open={!!editingInterface} onOpenChange={(open) => !open && setEditingInterface(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Interface</DialogTitle>
            <DialogDescription>
              Update the details of your interface.
            </DialogDescription>
          </DialogHeader>
          {editingInterface && (
            <div className="py-4">
              <Input
                placeholder="Interface Name"
                value={editingInterface.name}
                onChange={(e) => setEditingInterface({...editingInterface, name: e.target.value})}
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
    </div>
  );
}
