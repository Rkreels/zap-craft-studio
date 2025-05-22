
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, ArrowRight } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export interface FieldMapping {
  id: string;
  sourceField: string;
  targetField: string;
  transformationType: "direct" | "template" | "formula" | "conditional";
  transformationValue: string;
}

export interface DataTransformConfig {
  mappings: FieldMapping[];
  rawMode: boolean;
  customCode: string;
}

interface DataTransformerProps {
  config: DataTransformConfig;
  onChange: (config: DataTransformConfig) => void;
  sourceFields: Array<{ id: string; label: string }>;
  targetFields: Array<{ id: string; label: string }>;
}

export const DataTransformer: React.FC<DataTransformerProps> = ({
  config,
  onChange,
  sourceFields,
  targetFields
}) => {
  const [activeTab, setActiveTab] = useState(config.rawMode ? "code" : "visual");

  const addMapping = () => {
    const newMapping: FieldMapping = {
      id: `mapping-${Date.now()}`,
      sourceField: sourceFields[0]?.id || "",
      targetField: targetFields[0]?.id || "",
      transformationType: "direct",
      transformationValue: ""
    };
    
    onChange({
      ...config,
      mappings: [...config.mappings, newMapping]
    });
  };
  
  const updateMapping = (id: string, updates: Partial<FieldMapping>) => {
    onChange({
      ...config,
      mappings: config.mappings.map(mapping => 
        mapping.id === id ? { ...mapping, ...updates } : mapping
      )
    });
  };
  
  const removeMapping = (id: string) => {
    onChange({
      ...config,
      mappings: config.mappings.filter(mapping => mapping.id !== id)
    });
  };
  
  const toggleMode = (mode: "visual" | "code") => {
    setActiveTab(mode);
    onChange({
      ...config,
      rawMode: mode === "code"
    });
  };
  
  const updateCustomCode = (code: string) => {
    onChange({
      ...config,
      customCode: code
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Transformation</CardTitle>
        <CardDescription>
          Map and transform data between your workflow steps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={toggleMode}>
          <TabsList className="mb-4">
            <TabsTrigger value="visual">Visual Mapping</TabsTrigger>
            <TabsTrigger value="code">Custom Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual">
            <div className="space-y-4">
              {config.mappings.length === 0 ? (
                <div className="text-center py-6 text-gray-500 border border-dashed rounded-md">
                  No field mappings yet. Add one below.
                </div>
              ) : (
                config.mappings.map(mapping => (
                  <div key={mapping.id} className="flex items-center gap-2">
                    <Select
                      value={mapping.sourceField}
                      onValueChange={(value) => updateMapping(mapping.id, { sourceField: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Source field" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceFields.map(field => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    
                    <Select
                      value={mapping.targetField}
                      onValueChange={(value) => updateMapping(mapping.id, { targetField: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Target field" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetFields.map(field => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={mapping.transformationType}
                      onValueChange={(value: any) => 
                        updateMapping(mapping.id, { transformationType: value })
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Transformation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">Direct</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                        <SelectItem value="formula">Formula</SelectItem>
                        <SelectItem value="conditional">Conditional</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {mapping.transformationType !== "direct" && (
                      <Input 
                        className="flex-1"
                        value={mapping.transformationValue}
                        onChange={(e) => 
                          updateMapping(mapping.id, { transformationValue: e.target.value })
                        }
                        placeholder={
                          mapping.transformationType === "template" 
                            ? "{{value}} - formatted" 
                            : mapping.transformationType === "formula" 
                              ? "{{value}} * 100" 
                              : "if {{value}} == 'x' then 'y' else 'z'"
                        }
                      />
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMapping(mapping.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
              
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={addMapping}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Field Mapping
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="code">
            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-code">Custom Transformation Code</Label>
                <Textarea
                  id="custom-code"
                  className="font-mono text-sm mt-1.5"
                  value={config.customCode}
                  onChange={(e) => updateCustomCode(e.target.value)}
                  rows={15}
                  placeholder={`// Define a function that transforms the input data
function transform(inputData) {
  // Create the output object
  const output = {};
  
  // Map and transform fields
  output.name = inputData.full_name.toUpperCase();
  output.email = inputData.email_address;
  
  // Add calculated fields
  output.greeting = "Hello, " + inputData.full_name.split(" ")[0];
  
  // Conditional logic
  if (inputData.status === "active") {
    output.statusLabel = "Active User";
    output.statusColor = "green";
  } else {
    output.statusLabel = "Inactive User";
    output.statusColor = "gray";
  }
  
  return output;
}`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Write custom JavaScript code to transform your data. The input data is available 
                  as the first parameter to your function.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
