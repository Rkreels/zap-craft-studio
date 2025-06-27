
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  Move, 
  Settings, 
  Eye, 
  Code, 
  Palette,
  Layout,
  Zap,
  Save,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { InterfaceItem, InterfaceField } from '@/types/interfaces';

interface AdvancedInterfaceBuilderProps {
  interface_: InterfaceItem;
  onSave: (interface_: InterfaceItem) => void;
  onPreview: () => void;
  onClose: () => void;
}

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email' },
  { value: 'password', label: 'Password' },
  { value: 'number', label: 'Number' },
  { value: 'tel', label: 'Phone' },
  { value: 'url', label: 'URL' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'time', label: 'Time' },
  { value: 'file', label: 'File Upload' },
  { value: 'range', label: 'Range Slider' },
  { value: 'color', label: 'Color Picker' }
];

export const AdvancedInterfaceBuilder: React.FC<AdvancedInterfaceBuilderProps> = ({
  interface_,
  onSave,
  onPreview,
  onClose
}) => {
  const [currentInterface, setCurrentInterface] = useState<InterfaceItem>(interface_);
  const [selectedField, setSelectedField] = useState<InterfaceField | null>(null);
  const [activeTab, setActiveTab] = useState('fields');

  const addField = useCallback((type: string) => {
    const newField: InterfaceField = {
      id: `field-${Date.now()}`,
      name: `field_${(currentInterface.fields || []).length + 1}`,
      type,
      required: false,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: type === 'textarea' ? 'Enter your text here...' : `Enter ${type}...`,
      defaultValue: '',
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined
    };

    setCurrentInterface(prev => ({
      ...prev,
      fields: [...(prev.fields || []), newField]
    }));
  }, [currentInterface.fields]);

  const updateField = useCallback((fieldId: string, updates: Partial<InterfaceField>) => {
    setCurrentInterface(prev => ({
      ...prev,
      fields: (prev.fields || []).map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  }, []);

  const removeField = useCallback((fieldId: string) => {
    setCurrentInterface(prev => ({
      ...prev,
      fields: (prev.fields || []).filter(field => field.id !== fieldId)
    }));
    setSelectedField(null);
  }, []);

  const moveField = useCallback((fieldId: string, direction: 'up' | 'down') => {
    const fields = currentInterface.fields || [];
    const currentIndex = fields.findIndex(field => field.id === fieldId);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= fields.length) return;
    
    const newFields = [...fields];
    [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];
    
    setCurrentInterface(prev => ({
      ...prev,
      fields: newFields
    }));
  }, [currentInterface.fields]);

  const renderFieldPreview = (field: InterfaceField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea 
            placeholder={field.placeholder} 
            className="w-full"
            disabled
          />
        );
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input type="checkbox" disabled />
            <Label>{field.label}</Label>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" name={field.name} disabled />
                <Label>{option}</Label>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <Input 
            type={field.type} 
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            disabled
          />
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{currentInterface.name}</h2>
          <p className="text-sm text-gray-600">Advanced Interface Builder</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onPreview}>
            <Eye size={16} className="mr-2" />
            Preview
          </Button>
          <Button onClick={() => onSave(currentInterface)}>
            <Save size={16} className="mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Builder */}
        <div className="w-2/3 border-r">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="fields">Fields</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
              <TabsTrigger value="logic">Logic</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="fields" className="h-full p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Add Field</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {fieldTypes.map(fieldType => (
                      <Button
                        key={fieldType.value}
                        variant="outline"
                        size="sm"
                        onClick={() => addField(fieldType.value)}
                        className="justify-start"
                      >
                        <Plus size={14} className="mr-1" />
                        {fieldType.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Field List</h3>
                  <div className="space-y-2">
                    {(currentInterface.fields || []).map((field, index) => (
                      <Card
                        key={field.id}
                        className={`cursor-pointer ${selectedField?.id === field.id ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setSelectedField(field)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveField(field.id, 'up');
                                  }}
                                  disabled={index === 0}
                                >
                                  <ArrowUp size={12} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveField(field.id, 'down');
                                  }}
                                  disabled={index === (currentInterface.fields || []).length - 1}
                                >
                                  <ArrowDown size={12} />
                                </Button>
                              </div>
                              <div>
                                <p className="font-medium">{field.label}</p>
                                <p className="text-sm text-gray-500">{field.type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {field.required && (
                                <Badge variant="secondary" className="text-xs">Required</Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeField(field.id);
                                }}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="styling" className="p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette size={16} />
                      Theme Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Primary Color</Label>
                      <Input type="color" defaultValue="#3b82f6" />
                    </div>
                    <div>
                      <Label>Background Color</Label>
                      <Input type="color" defaultValue="#ffffff" />
                    </div>
                    <div>
                      <Label>Border Radius</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout size={16} />
                      Layout Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Responsive Design</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Full Width</Label>
                      <Switch />
                    </div>
                    <div>
                      <Label>Max Width</Label>
                      <Input type="number" placeholder="800" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logic" className="p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap size={16} />
                      Conditional Logic
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Add conditional logic to show/hide fields based on user input
                    </p>
                    <Button variant="outline">
                      <Plus size={16} className="mr-2" />
                      Add Logic Rule
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code size={16} />
                      Custom JavaScript
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="// Add custom JavaScript code here"
                      className="h-32 font-mono text-sm"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Interface Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Interface Name</Label>
                      <Input 
                        value={currentInterface.name}
                        onChange={(e) => setCurrentInterface(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea 
                        value={currentInterface.description || ''}
                        onChange={(e) => setCurrentInterface(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable Analytics</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Allow Comments</Label>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-1/3 p-4">
          {selectedField ? (
            <div className="space-y-4">
              <h3 className="font-medium">Field Properties</h3>
              
              <div>
                <Label>Label</Label>
                <Input 
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                />
              </div>

              <div>
                <Label>Name</Label>
                <Input 
                  value={selectedField.name}
                  onChange={(e) => updateField(selectedField.id, { name: e.target.value })}
                />
              </div>

              <div>
                <Label>Placeholder</Label>
                <Input 
                  value={selectedField.placeholder || ''}
                  onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                />
              </div>

              <div>
                <Label>Default Value</Label>
                <Input 
                  value={selectedField.defaultValue || ''}
                  onChange={(e) => updateField(selectedField.id, { defaultValue: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Required</Label>
                <Switch 
                  checked={selectedField.required}
                  onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
                />
              </div>

              {(selectedField.type === 'select' || selectedField.type === 'radio') && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {selectedField.options?.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(selectedField.options || [])];
                            newOptions[index] = e.target.value;
                            updateField(selectedField.id, { options: newOptions });
                          }}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const newOptions = selectedField.options?.filter((_, i) => i !== index);
                            updateField(selectedField.id, { options: newOptions });
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const newOptions = [...(selectedField.options || []), 'New Option'];
                        updateField(selectedField.id, { options: newOptions });
                      }}
                    >
                      <Plus size={14} className="mr-1" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Preview</h4>
                <div className="border rounded p-3 bg-gray-50">
                  <Label className="block mb-2">
                    {selectedField.label}
                    {selectedField.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderFieldPreview(selectedField)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <Settings size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a field to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
