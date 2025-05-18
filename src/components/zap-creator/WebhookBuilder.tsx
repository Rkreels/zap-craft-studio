
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Code, Copy, PlayCircle, Plus, Save, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function WebhookBuilder() {
  const [activeTab, setActiveTab] = useState("setup");
  const [webhookUrl, setWebhookUrl] = useState("https://");
  const [requestMethod, setRequestMethod] = useState("POST");
  const [payload, setPayload] = useState('{\n  "event": "{{trigger.event}}",\n  "data": {\n    "id": "{{data.id}}",\n    "timestamp": "{{timestamp}}"\n  }\n}');
  const [headers, setHeaders] = useState([{ key: "Content-Type", value: "application/json" }]);
  const [variables, setVariables] = useState([{ name: "timestamp", value: "{{now}}" }]);
  const [webhookName, setWebhookName] = useState("");
  const [authType, setAuthType] = useState("none");
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  
  // Add new header field
  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };
  
  // Update header value
  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][field] = value;
    setHeaders(updatedHeaders);
  };
  
  // Remove header
  const removeHeader = (index: number) => {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(index, 1);
    setHeaders(updatedHeaders);
  };
  
  // Add new variable
  const addVariable = () => {
    setVariables([...variables, { name: "", value: "" }]);
  };
  
  // Update variable
  const updateVariable = (index: number, field: "name" | "value", value: string) => {
    const updatedVars = [...variables];
    updatedVars[index][field] = value;
    setVariables(updatedVars);
  };
  
  // Remove variable
  const removeVariable = (index: number) => {
    const updatedVars = [...variables];
    updatedVars.splice(index, 1);
    setVariables(updatedVars);
  };
  
  // Handle test webhook
  const testWebhook = () => {
    toast({
      title: "Testing webhook",
      description: "Request sent successfully to " + webhookUrl
    });
  };
  
  // Handle save webhook
  const saveWebhook = () => {
    toast({
      title: "Webhook saved",
      description: `${webhookName || "Unnamed webhook"} has been saved`
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create Outgoing Webhook</h2>
          <p className="text-gray-500">Send data to external services when events occur</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={webhookEnabled} 
              onCheckedChange={setWebhookEnabled} 
              id="webhook-status"
            />
            <Label htmlFor="webhook-status">
              {webhookEnabled ? "Enabled" : "Disabled"}
            </Label>
          </div>
          <Button variant="outline" onClick={testWebhook}>
            <PlayCircle size={16} className="mr-2" />
            Test
          </Button>
          <Button onClick={saveWebhook}>
            <Save size={16} className="mr-2" />
            Save Webhook
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <Input
              placeholder="Webhook Name"
              value={webhookName}
              onChange={(e) => setWebhookName(e.target.value)}
              className="mb-4"
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="setup" className="text-sm">Setup</TabsTrigger>
                <TabsTrigger value="headers" className="text-sm">Headers</TabsTrigger>
                <TabsTrigger value="variables" className="text-sm">Variables</TabsTrigger>
                <TabsTrigger value="auth" className="text-sm">Auth</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>{activeTab === "setup" ? "Webhook Setup" : 
                activeTab === "headers" ? "HTTP Headers" :
                activeTab === "variables" ? "Variables" : "Authentication"}</CardTitle>
            </CardHeader>
            <CardContent>
              <TabsContent value="setup" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input 
                    value={webhookUrl} 
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://api.example.com/webhook"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>HTTP Method</Label>
                  <Select value={requestMethod} onValueChange={setRequestMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Request Body (JSON)</Label>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => navigator.clipboard.writeText(payload)}
                    >
                      <Copy size={14} />
                    </Button>
                    <textarea 
                      className="w-full h-64 p-3 font-mono text-sm border border-gray-300 rounded-md"
                      value={payload}
                      onChange={(e) => setPayload(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Use {{variable}} syntax to include dynamic values
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="headers" className="space-y-4 mt-0">
                {headers.map((header, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="space-y-2 flex-1">
                      <Label>Header Name</Label>
                      <Input 
                        value={header.key}
                        onChange={(e) => updateHeader(index, "key", e.target.value)}
                        placeholder="Content-Type"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label>Value</Label>
                      <Input 
                        value={header.value}
                        onChange={(e) => updateHeader(index, "value", e.target.value)}
                        placeholder="application/json"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => removeHeader(index)}
                    >
                      <div className="h-4 w-4 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white">×</span>
                      </div>
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline" onClick={addHeader} className="mt-2">
                  <Plus size={14} className="mr-1" />
                  Add Header
                </Button>
              </TabsContent>
              
              <TabsContent value="variables" className="space-y-4 mt-0">
                {variables.map((variable, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="space-y-2 flex-1">
                      <Label>Variable Name</Label>
                      <Input 
                        value={variable.name}
                        onChange={(e) => updateVariable(index, "name", e.target.value)}
                        placeholder="timestamp"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label>Value</Label>
                      <Input 
                        value={variable.value}
                        onChange={(e) => updateVariable(index, "value", e.target.value)}
                        placeholder="{{now}}"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => removeVariable(index)}
                    >
                      <div className="h-4 w-4 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white">×</span>
                      </div>
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline" onClick={addVariable} className="mt-2">
                  <Plus size={14} className="mr-1" />
                  Add Variable
                </Button>
                
                <div className="bg-gray-50 p-4 rounded-md mt-6">
                  <h4 className="font-medium mb-2">Available Variables</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="text-sm">
                      <code className="bg-gray-200 p-1 rounded">{'{{now}}'}</code>
                      <span className="ml-2 text-gray-600">Current timestamp</span>
                    </div>
                    <div className="text-sm">
                      <code className="bg-gray-200 p-1 rounded">{'{{trigger.event}}'}</code>
                      <span className="ml-2 text-gray-600">Trigger event name</span>
                    </div>
                    <div className="text-sm">
                      <code className="bg-gray-200 p-1 rounded">{'{{data.id}}'}</code>
                      <span className="ml-2 text-gray-600">Record ID</span>
                    </div>
                    <div className="text-sm">
                      <code className="bg-gray-200 p-1 rounded">{'{{user.email}}'}</code>
                      <span className="ml-2 text-gray-600">Current user email</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="auth" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label>Authentication Type</Label>
                  <Select value={authType} onValueChange={setAuthType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Authentication</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="apikey">API Key</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {authType === "basic" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input placeholder="Username" />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" placeholder="Password" />
                    </div>
                  </div>
                )}
                
                {authType === "bearer" && (
                  <div className="space-y-2 mt-4">
                    <Label>Bearer Token</Label>
                    <Input placeholder="Bearer token" />
                  </div>
                )}
                
                {authType === "apikey" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>API Key Name</Label>
                      <Input placeholder="API-Key" />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key Value</Label>
                      <Input placeholder="your-api-key-value" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Add As</Label>
                      <Select defaultValue="header">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="header">Header</SelectItem>
                          <SelectItem value="query">Query Parameter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline">
          Cancel
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={testWebhook}>
            <PlayCircle size={16} className="mr-2" />
            Test Webhook
          </Button>
          <Button onClick={saveWebhook}>
            <ArrowRight size={16} className="mr-2" />
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
