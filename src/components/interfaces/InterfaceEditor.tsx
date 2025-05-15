
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { Edit, Trash2, Settings, Database, Plus, FileText, Layout, List } from "lucide-react";
import { InterfaceItem, InterfaceField, InterfaceIntegration } from "@/types/interfaces";

interface InterfaceEditorProps {
  editingInterface: InterfaceItem | null;
  isLoading: boolean;
  setEditingInterface: React.Dispatch<React.SetStateAction<InterfaceItem | null>>;
  updateInterface: () => void;
}

const InterfaceEditor: React.FC<InterfaceEditorProps> = ({
  editingInterface,
  isLoading,
  setEditingInterface,
  updateInterface,
}) => {
  // Local state for current tab
  const [activeEditorTab, setActiveEditorTab] = useState("basic");
  
  // Handle adding a new field
  const addNewField = () => {
    if (!editingInterface) return;
    
    const newField: InterfaceField = {
      id: `field-${Date.now()}`,
      name: `field_${editingInterface.fields?.length || 0 + 1}`,
      type: "text",
      required: false,
      label: "New Field",
      placeholder: "",
    };
    
    setEditingInterface({
      ...editingInterface,
      fields: [...(editingInterface.fields || []), newField]
    });
  };
  
  // Handle removing a field
  const removeField = (fieldId: string) => {
    if (!editingInterface) return;
    
    setEditingInterface({
      ...editingInterface,
      fields: (editingInterface.fields || []).filter(f => f.id !== fieldId)
    });
  };
  
  // Handle adding a new integration
  const addNewIntegration = () => {
    if (!editingInterface) return;
    
    const newIntegration: InterfaceIntegration = {
      id: `int-${Date.now()}`,
      name: "New Integration",
      type: "api",
      enabled: false,
      config: {}
    };
    
    setEditingInterface({
      ...editingInterface,
      integrations: [...(editingInterface.integrations || []), newIntegration]
    });
  };
  
  // Handle toggling integration status
  const toggleIntegration = (integrationId: string) => {
    if (!editingInterface) return;
    
    setEditingInterface({
      ...editingInterface,
      integrations: (editingInterface.integrations || []).map(integration => 
        integration.id === integrationId ? {...integration, enabled: !integration.enabled} : integration
      )
    });
  };

  if (!editingInterface) return null;
  
  return (
    <Dialog open={!!editingInterface} onOpenChange={(open) => !open && setEditingInterface(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Interface</DialogTitle>
          <DialogDescription>
            Update the details of your interface.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Tabs value={activeEditorTab} onValueChange={setActiveEditorTab} className="w-full">
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
                        <Button variant="ghost" size="icon" onClick={() => {
                          // Edit field functionality
                          // Placeholder for field editing modal
                          console.log("Edit field:", field);
                        }}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeField(field.id)}>
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
              
              <Button className="w-full" onClick={addNewField}>
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
                        <Badge 
                          variant={integration.enabled ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleIntegration(integration.id)}
                        >
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
              
              <Button className="w-full" onClick={addNewIntegration}>
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
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditingInterface(null)}>Cancel</Button>
          <Button onClick={updateInterface} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InterfaceEditor;
