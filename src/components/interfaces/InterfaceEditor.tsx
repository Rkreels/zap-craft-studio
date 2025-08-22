
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
import { InterfaceFieldEditor } from "./InterfaceFieldEditor";
import { toast } from "@/hooks/use-toast";

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
  const [activeEditorTab, setActiveEditorTab] = useState("basic");
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const validateBasicInfo = (): boolean => {
    if (!editingInterface) return false;
    
    const errors: Record<string, string> = {};
    
    if (!editingInterface.name.trim()) {
      errors.name = 'Interface name is required';
    }
    
    if (!editingInterface.description?.trim()) {
      errors.description = 'Interface description is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateBasicInfo()) {
      updateInterface();
      toast({
        title: 'Interface updated',
        description: 'Your interface has been successfully updated.',
      });
    } else {
      toast({
        title: 'Validation Error',
        description: 'Please fix the form errors before saving.',
        variant: 'destructive',
      });
    }
  };
  
  const addNewField = () => {
    if (!editingInterface) return;
    
    const newField: InterfaceField = {
      id: `field-${Date.now()}`,
      name: `field_${(editingInterface.fields?.length || 0) + 1}`,
      type: "text",
      required: false,
      label: "New Field",
      placeholder: "",
    };
    
    setEditingInterface({
      ...editingInterface,
      fields: [...(editingInterface.fields || []), newField]
    });
    
    setEditingFieldId(newField.id);
  };
  
  const updateField = (updatedField: InterfaceField) => {
    if (!editingInterface) return;
    
    setEditingInterface({
      ...editingInterface,
      fields: (editingInterface.fields || []).map(f => 
        f.id === updatedField.id ? updatedField : f
      )
    });
    
    setEditingFieldId(null);
    toast({
      title: 'Field updated',
      description: 'The field has been successfully updated.',
    });
  };
  
  const removeField = (fieldId: string) => {
    if (!editingInterface) return;
    
    setEditingInterface({
      ...editingInterface,
      fields: (editingInterface.fields || []).filter(f => f.id !== fieldId)
    });
    
    toast({
      title: 'Field removed',
      description: 'The field has been successfully removed.',
    });
  };
  
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Interface</DialogTitle>
          <DialogDescription>
            Update the details of your interface and configure its fields and integrations.
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
              <div>
                <label className="block text-sm font-medium mb-2">Interface Name *</label>
                <Input
                  placeholder="Enter interface name"
                  value={editingInterface.name}
                  onChange={(e) => setEditingInterface({...editingInterface, name: e.target.value})}
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  placeholder="Describe what this interface does"
                  value={editingInterface.description || ""}
                  onChange={(e) => setEditingInterface({...editingInterface, description: e.target.value})}
                  className={formErrors.description ? 'border-red-500' : ''}
                  rows={3}
                />
                {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Interface Type</label>
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
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
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
            </TabsContent>
            
            <TabsContent value="fields" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Form Fields & Elements</h3>
                  <p className="text-sm text-gray-500">
                    Add and configure fields for your interface
                  </p>
                </div>
                <Button onClick={addNewField}>
                  <Plus size={16} className="mr-2" />
                  Add Field
                </Button>
              </div>
              
              <div className="space-y-4">
                {(editingInterface.fields || []).length > 0 ? 
                  (editingInterface.fields || []).map((field) => (
                    <div key={field.id}>
                      {editingFieldId === field.id ? (
                        <InterfaceFieldEditor
                          field={field}
                          onSave={updateField}
                          onCancel={() => setEditingFieldId(null)}
                        />
                      ) : (
                        <div className="p-3 border rounded-md flex justify-between items-center">
                          <div>
                            <div className="font-medium">{field.label}</div>
                            <div className="text-sm text-gray-500">
                              {field.type} • {field.name} {field.required && "(Required)"}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setEditingFieldId(field.id)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => removeField(field.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-md">
                      <p>No fields added yet</p>
                      <Button onClick={addNewField} variant="outline" className="mt-2">
                        <Plus size={16} className="mr-2" />
                        Add Your First Field
                      </Button>
                    </div>
                  )
                }
              </div>
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
          <Button variant="outline" onClick={() => setEditingInterface(null)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InterfaceEditor;
