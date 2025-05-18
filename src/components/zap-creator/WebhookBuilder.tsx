
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { Copy, Play, Plus, Save } from "lucide-react";

export function WebhookBuilder() {
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [webhookHeaders, setWebhookHeaders] = useState<{key: string, value: string}[]>([
    { key: "Content-Type", value: "application/json" }
  ]);
  const [webhookMethod, setWebhookMethod] = useState<string>("POST");
  const [webhookBody, setWebhookBody] = useState<string>(JSON.stringify({
    event: "example_event",
    data: {
      timestamp: "{{timestamp}}",
      user_id: "{{user_id}}",
      action: "{{action}}"
    }
  }, null, 2));
  const [isAuthEnabled, setIsAuthEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("config");

  // Voice guidance
  const voiceGuidanceProps = {
    elementName: "Webhook Builder",
    hoverText: "Configure webhooks to send and receive data between your app and external services.",
    clickText: "Set up webhook URLs, headers, and payload formats for integration with third-party services."
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(voiceGuidanceProps);

  const addHeader = () => {
    setWebhookHeaders([...webhookHeaders, { key: "", value: "" }]);
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...webhookHeaders];
    newHeaders[index][field] = value;
    setWebhookHeaders(newHeaders);
  };

  const removeHeader = (index: number) => {
    const newHeaders = [...webhookHeaders];
    newHeaders.splice(index, 1);
    setWebhookHeaders(newHeaders);
  };

  const handleSaveWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: "URL required",
        description: "Please enter a webhook URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Webhook saved",
        description: "Your webhook configuration has been saved."
      });
    }, 800);
  };

  const handleTestWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: "URL required",
        description: "Please enter a webhook URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Test successful",
        description: "The webhook was tested successfully."
      });
    }, 1500);
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      description: "Webhook URL copied to clipboard"
    });
  };

  return (
    <Card className="border-gray-200 shadow-sm" 
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}>
      <CardHeader>
        <CardTitle>Webhook Configuration</CardTitle>
        <CardDescription>
          Set up webhooks to connect with external services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="test">Test & Debug</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="webhook-url"
                    value={webhookUrl} 
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://example.com/webhook" 
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
                    <Copy size={16} className="mr-2" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>HTTP Method</Label>
                <Select value={webhookMethod} onValueChange={setWebhookMethod}>
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Headers</Label>
                  <Button variant="outline" size="sm" onClick={addHeader}>
                    <Plus size={16} className="mr-2" />
                    Add Header
                  </Button>
                </div>

                <div className="space-y-3">
                  {webhookHeaders.map((header, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input 
                        placeholder="Header name" 
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        className="flex-1"
                      />
                      <Input 
                        placeholder="Value" 
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeHeader(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-body">Request Body</Label>
                <Textarea 
                  id="webhook-body"
                  value={webhookBody} 
                  onChange={(e) => setWebhookBody(e.target.value)}
                  placeholder="{}" 
                  className="font-mono min-h-[180px]"
                />
                <p className="text-xs text-gray-500">
                  Use {{variable}} syntax to include dynamic values in your webhook payload.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="auth-enabled" 
                  checked={isAuthEnabled}
                  onCheckedChange={setIsAuthEnabled}
                />
                <Label htmlFor="auth-enabled">Enable Authentication</Label>
              </div>

              {isAuthEnabled && (
                <div className="p-4 border border-gray-200 rounded-md space-y-3">
                  <Select defaultValue="basic">
                    <SelectTrigger>
                      <SelectValue placeholder="Authentication Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="api-key">API Key</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Username" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Password" />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="test">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Test Payload</Label>
                <Textarea 
                  placeholder="Enter test data" 
                  className="min-h-[150px] font-mono"
                  defaultValue={`{
  "timestamp": "${new Date().toISOString()}",
  "user_id": "test-user-123",
  "action": "test-action"
}`}
                />
              </div>

              <div className="space-y-2">
                <Label>Response</Label>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 min-h-[150px] font-mono text-sm">
                  <p className="text-gray-500">Response will appear here after testing</p>
                </div>
              </div>

              <Button onClick={handleTestWebhook} disabled={isLoading}>
                <Play size={16} className="mr-2" />
                Test Webhook
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Recent webhook requests and responses</p>
              
              <div className="border border-gray-200 rounded-md">
                <div className="p-3 border-b flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">POST Request</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    200 OK
                  </span>
                </div>
                <div className="p-3 text-sm font-mono overflow-auto max-h-[100px] bg-gray-50">
                  {"{ \"status\": \"success\", \"message\": \"Data received\" }"}
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md">
                <div className="p-3 border-b flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">POST Request</p>
                    <p className="text-xs text-gray-500">10 minutes ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    200 OK
                  </span>
                </div>
                <div className="p-3 text-sm font-mono overflow-auto max-h-[100px] bg-gray-50">
                  {"{ \"status\": \"success\", \"message\": \"Data received\" }"}
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md">
                <div className="p-3 border-b flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">POST Request</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    404 Not Found
                  </span>
                </div>
                <div className="p-3 text-sm font-mono overflow-auto max-h-[100px] bg-gray-50">
                  {"{ \"error\": \"Resource not found\" }"}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
        <Button 
          onClick={handleSaveWebhook}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Save size={16} className="mr-2" />
          {isLoading ? "Saving..." : "Save Webhook Configuration"}
        </Button>
      </CardFooter>
    </Card>
  );
}
