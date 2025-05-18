
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, FileCode, FileText } from "lucide-react";
import { FormulaEditor } from "@/components/data-transformation/FormulaEditor";
import { toast } from "@/hooks/use-toast";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { useInterfaceManager } from "@/hooks/useInterfaceManager";
import { InterfaceItem } from "@/types/interfaces";

export default function DataTransformationPage() {
  const [activeTab, setActiveTab] = useState("formula");
  const [selectedInterfaceId, setSelectedInterfaceId] = useState<string | null>(null);
  
  const { getPreviewImage } = useInterfaceManager();

  // Sample data for the page
  const sampleData = {
    customer: {
      name: "John Doe",
      email: "john@example.com",
      id: "CUST-123"
    },
    order: {
      id: "ORD-456",
      items: [
        { name: "Product 1", price: 29.99, quantity: 2 },
        { name: "Product 2", price: 49.99, quantity: 1 }
      ],
      total: 109.97,
      date: new Date().toISOString()
    }
  };

  // Sample interfaces that can be transformed
  const availableInterfaces: InterfaceItem[] = [
    {
      id: "tr-1",
      name: "Customer Form Submission",
      type: "form",
      description: "Data from customer registration form",
      preview: getPreviewImage("form"),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "published",
      fields: [
        { id: "cf-1", name: "name", type: "text", required: true, label: "Full Name" },
        { id: "cf-2", name: "email", type: "email", required: true, label: "Email" },
        { id: "cf-3", name: "phone", type: "tel", required: false, label: "Phone" },
        { id: "cf-4", name: "message", type: "textarea", required: true, label: "Message" }
      ],
      viewCount: 145
    }
  ];
  
  // Voice guidance
  const pageVoiceProps = {
    elementName: "Data Transformation Tools",
    hoverText: "These tools help you map, filter, and transform data between different systems.",
    clickText: "Use the formula editor to create custom data transformations with functions and operators."
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(pageVoiceProps);

  // Handle saving formula
  const handleSaveFormula = (formula: string) => {
    console.log("Saved formula:", formula);
    toast({
      title: "Formula saved",
      description: "Your data transformation formula has been saved."
    });
  };

  // Select an interface to transform
  const handleSelectInterface = (interfaceId: string) => {
    setSelectedInterfaceId(interfaceId);
  };

  return (
    <div 
      className="container mx-auto py-6"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Data Transformation</h1>
          <p className="text-gray-500">Map, filter, and transform data between systems</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Save Transformations
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4 w-[400px]">
          <TabsTrigger value="formula">Formula Editor</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="formula">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Available Data</CardTitle>
                <CardDescription>Source data to transform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Sample Data</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono overflow-auto max-h-[400px]">
                      <pre>{JSON.stringify(sampleData, null, 2)}</pre>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-sm mb-2">Interfaces</h3>
                    <div className="space-y-2">
                      {availableInterfaces.map(item => (
                        <div 
                          key={item.id}
                          className={`p-2 border rounded flex items-center cursor-pointer ${
                            selectedInterfaceId === item.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                          }`}
                          onClick={() => handleSelectInterface(item.id)}
                        >
                          <FileText size={16} className="text-gray-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-3">
              <FormulaEditor 
                initialFormula="CONCAT(customer.name, ' <', customer.email, '>')"
                onSave={handleSaveFormula}
                sampleData={sampleData}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mapping">
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping</CardTitle>
              <CardDescription>
                Map fields between source and destination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1 border rounded-md p-4">
                  <h3 className="font-medium mb-3">Source</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-sm font-medium">customer.name</p>
                      <p className="text-xs text-gray-500">String</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-sm font-medium">customer.email</p>
                      <p className="text-xs text-gray-500">String</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-sm font-medium">order.total</p>
                      <p className="text-xs text-gray-500">Number</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <ArrowRight size={24} className="text-gray-400" />
                </div>
                
                <div className="flex-1 border rounded-md p-4">
                  <h3 className="font-medium mb-3">Destination</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-sm font-medium">fullName</p>
                      <p className="text-xs text-gray-500">String</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-sm font-medium">contactEmail</p>
                      <p className="text-xs text-gray-500">String</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-sm font-medium">invoiceAmount</p>
                      <p className="text-xs text-gray-500">Number</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Transformation Templates</CardTitle>
              <CardDescription>
                Common data transformation patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 cursor-pointer hover:border-purple-300">
                <div className="flex items-center mb-3">
                  <Code className="text-purple-500 mr-2" size={20} />
                  <h3 className="font-medium">JSON to CSV</h3>
                </div>
                <p className="text-sm text-gray-500">Convert JSON data to CSV format</p>
              </div>
              
              <div className="border rounded-lg p-4 cursor-pointer hover:border-purple-300">
                <div className="flex items-center mb-3">
                  <FileCode className="text-purple-500 mr-2" size={20} />
                  <h3 className="font-medium">XML to JSON</h3>
                </div>
                <p className="text-sm text-gray-500">Convert XML data to JSON format</p>
              </div>
              
              <div className="border rounded-lg p-4 cursor-pointer hover:border-purple-300">
                <div className="flex items-center mb-3">
                  <FileText className="text-purple-500 mr-2" size={20} />
                  <h3 className="font-medium">Date Formatting</h3>
                </div>
                <p className="text-sm text-gray-500">Format dates between different standards</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
