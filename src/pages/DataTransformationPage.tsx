
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormulaEditor } from "@/components/data-transformation/FormulaEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { transformForExport, filterByDateRange, mapFieldType, generateSampleData } from "@/utils/dataTransformationUtils";

export default function DataTransformationPage() {
  const [activeTab, setActiveTab] = useState("mapping");
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [targetFormat, setTargetFormat] = useState<'html' | 'json' | 'airtable' | 'notion'>('html');
  const [transformedResult, setTransformedResult] = useState<string>("");
  
  // Voice guidance
  const pageVoiceProps = {
    elementName: "Data Transformation Page",
    hoverText: "This page contains tools for transforming data between different systems and formats.",
    clickText: "You can map fields, transform data, and preview the results."
  };
  const pageGuidance = useVoiceGuidance(pageVoiceProps);
  
  // Sample data for demonstration
  const sampleInterfaceData = {
    id: "sample-1",
    name: "Customer Feedback Form",
    type: "form",
    description: "Collect customer feedback and suggestions",
    preview: "https://placehold.co/600x400/e2e8f0/64748b?text=Form+Interface",
    createdAt: "2025-05-01T10:00:00Z",
    updatedAt: "2025-05-15T14:30:00Z",
    status: "published",
    fields: [
      { id: "field-1", name: "fullName", type: "text", required: true, label: "Full Name" },
      { id: "field-2", name: "email", type: "email", required: true, label: "Email Address" },
      { id: "field-3", name: "rating", type: "number", required: true, label: "Rating (1-5)" },
      { id: "field-4", name: "feedback", type: "text", required: false, label: "Feedback" },
      { id: "field-5", name: "subscribe", type: "checkbox", required: false, label: "Subscribe to newsletter" }
    ],
    viewCount: 120
  };
  
  // Handle export
  const handleExport = () => {
    const result = transformForExport([sampleInterfaceData], exportFormat);
    setTransformedResult(result);
  };
  
  // Handle field mapping
  const handleMapFields = () => {
    const mappedFields = sampleInterfaceData.fields?.map(field => {
      return {
        original: field.name,
        originalType: field.type,
        mappedType: mapFieldType(field.type, targetFormat),
        required: field.required
      };
    });
    
    setTransformedResult(JSON.stringify(mappedFields, null, 2));
  };
  
  // Handle generate sample data
  const handleGenerateSample = () => {
    const sampleData = generateSampleData(sampleInterfaceData);
    setTransformedResult(JSON.stringify(sampleData, null, 2));
  };
  
  return (
    <div 
      className="max-w-7xl mx-auto p-4"
      onMouseEnter={pageGuidance.handleMouseEnter}
      onClick={pageGuidance.handleClick}
    >
      <h1 className="text-2xl font-bold mb-6">Data Transformation Tools</h1>
      
      <Tabs defaultValue="mapping" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="formulas">Formula Editor</TabsTrigger>
          <TabsTrigger value="export">Data Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mapping">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Field Type Mapping</CardTitle>
                <CardDescription>
                  Map fields between different platforms and formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Target Platform</label>
                    <Select value={targetFormat} onValueChange={(value: 'html' | 'json' | 'airtable' | 'notion') => setTargetFormat(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="airtable">Airtable</SelectItem>
                        <SelectItem value="notion">Notion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleMapFields}>Map Fields</Button>
                  <Button variant="outline" onClick={handleGenerateSample}>Generate Sample Data</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[400px] text-xs">
                  {transformedResult || "Result will appear here"}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="formulas">
          <FormulaEditor 
            initialFormula="CONCAT(name, ' <', email, '>')"
            onSave={(formula) => console.log("Saved formula:", formula)}
            sampleData={{
              name: "John Doe", 
              email: "john@example.com", 
              rating: 5,
              created_at: "2025-05-15T14:30:00Z"
            }}
          />
        </TabsContent>
        
        <TabsContent value="export">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  Export your interface data to different formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Export Format</label>
                    <Select value={exportFormat} onValueChange={(value: 'json' | 'csv') => setExportFormat(value as 'json' | 'csv')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleExport}>Export</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Export Result</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[400px] text-xs">
                  {transformedResult || "Export result will appear here"}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
