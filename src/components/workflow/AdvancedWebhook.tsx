
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Code, 
  Copy, 
  ExternalLink, 
  Key, 
  Lock, 
  RefreshCcw, 
  Rocket, 
  Trash2,
  Plus,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export interface WebhookAdvancedConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers: Record<string, string>;
  bodyTemplate: string;
  authType: "none" | "basic" | "api_key" | "oauth2" | "custom";
  authConfig: {
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyLocation?: "header" | "query" | "body";
    apiKeyName?: string;
    token?: string;
    customAuth?: string;
  };
  useSubscription: boolean;
  subscriptionConfig?: {
    mode: "push" | "poll";
    secret?: string;
    pollingInterval?: number;
  };
}

export interface AdvancedWebhookProps {
  config: WebhookAdvancedConfig;
  onChange: (config: WebhookAdvancedConfig) => void;
  generatedWebhookUrl?: string;
}

export const AdvancedWebhook: React.FC<AdvancedWebhookProps> = ({
  config,
  onChange,
  generatedWebhookUrl = "https://example.com/webhook/123456789"
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("configuration");
  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");
  const [testResponse, setTestResponse] = useState("");

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: message,
    });
  };

  const addHeader = () => {
    if (!headerKey.trim()) return;
    
    onChange({
      ...config,
      headers: {
        ...config.headers,
        [headerKey]: headerValue
      }
    });
    
    setHeaderKey("");
    setHeaderValue("");
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...config.headers };
    delete newHeaders[key];
    onChange({
      ...config,
      headers: newHeaders
    });
  };

  const updateMethod = (method: "GET" | "POST" | "PUT" | "DELETE") => {
    onChange({ ...config, method });
  };

  const updateUrl = (url: string) => {
    onChange({ ...config, url });
  };

  const updateBodyTemplate = (bodyTemplate: string) => {
    onChange({ ...config, bodyTemplate });
  };
  
  const updateAuthType = (type: "none" | "basic" | "api_key" | "oauth2" | "custom") => {
    onChange({ 
      ...config, 
      authType: type,
      authConfig: { ...config.authConfig }
    });
  };
  
  const updateAuthConfig = <K extends keyof WebhookAdvancedConfig["authConfig"]>(
    key: K,
    value: string | number | undefined
  ) => {
    onChange({
      ...config,
      authConfig: {
        ...config.authConfig,
        [key]: value
      }
    });
  };
  
  const toggleSubscription = () => {
    onChange({
      ...config,
      useSubscription: !config.useSubscription,
      subscriptionConfig: config.subscriptionConfig || {
        mode: "push",
        secret: generateRandomString(24),
        pollingInterval: 300
      }
    });
  };
  
  const updateSubscriptionConfig = <K extends keyof NonNullable<WebhookAdvancedConfig["subscriptionConfig"]>>(
    key: K,
    value: any
  ) => {
    onChange({
      ...config,
      subscriptionConfig: {
        ...config.subscriptionConfig,
        [key]: value
      }
    });
  };
  
  const generateNewSecret = () => {
    const newSecret = generateRandomString(24);
    updateSubscriptionConfig("secret", newSecret);
    
    toast({
      title: "New webhook secret generated",
      description: "Make sure to update your endpoint with this new secret."
    });
  };
  
  const handleTestRequest = () => {
    setTestResponse("Sending test request...");
    
    // Simulate API request
    setTimeout(() => {
      setTestResponse(`
HTTP/1.1 200 OK
Content-Type: application/json
Date: ${new Date().toUTCString()}

{
  "success": true,
  "message": "Webhook received successfully",
  "timestamp": "${new Date().toISOString()}",
  "request_id": "req_${Math.random().toString(36).substring(2, 15)}"
}
      `);
    }, 1500);
  };
  
  // Helper function to generate random string
  const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Webhook Integration</CardTitle>
        <CardDescription>
          Configure webhooks with advanced authentication and subscription options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="incoming">Incoming Webhook</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing Webhook</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configuration">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <Label>Webhook Subscription</Label>
                  <Switch 
                    checked={config.useSubscription} 
                    onCheckedChange={toggleSubscription} 
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Enable webhook subscriptions to receive updates automatically
                </p>
              </div>
              
              {config.useSubscription && (
                <div className="pt-2 pb-2 pl-4 border-l-2 border-gray-200 space-y-4">
                  <div>
                    <Label htmlFor="subscription-mode">Subscription Mode</Label>
                    <Select
                      value={config.subscriptionConfig?.mode}
                      onValueChange={(value: "push" | "poll") => 
                        updateSubscriptionConfig("mode", value)
                      }
                    >
                      <SelectTrigger id="subscription-mode">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="push">Push-based (real-time)</SelectItem>
                        <SelectItem value="poll">Poll-based (interval)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Push mode receives updates in real-time, poll mode checks periodically
                    </p>
                  </div>
                  
                  {config.subscriptionConfig?.mode === "push" && (
                    <div>
                      <Label htmlFor="webhook-secret">Webhook Secret</Label>
                      <div className="flex mt-1.5">
                        <Input
                          id="webhook-secret"
                          value={config.subscriptionConfig?.secret}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          className="ml-2"
                          onClick={() => copyToClipboard(
                            config.subscriptionConfig?.secret || "",
                            "Webhook secret copied to clipboard"
                          )}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="ml-2"
                          onClick={generateNewSecret}
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Used to verify webhook authenticity. Keep this secret secure.
                      </p>
                    </div>
                  )}
                  
                  {config.subscriptionConfig?.mode === "poll" && (
                    <div>
                      <Label htmlFor="polling-interval">Polling Interval (seconds)</Label>
                      <Select
                        value={config.subscriptionConfig?.pollingInterval?.toString()}
                        onValueChange={(value) => 
                          updateSubscriptionConfig("pollingInterval", parseInt(value))
                        }
                      >
                        <SelectTrigger id="polling-interval">
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">1 minute</SelectItem>
                          <SelectItem value="300">5 minutes</SelectItem>
                          <SelectItem value="900">15 minutes</SelectItem>
                          <SelectItem value="1800">30 minutes</SelectItem>
                          <SelectItem value="3600">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="incoming">
            <div className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">Your Webhook URL</Label>
                <div className="flex mt-1.5">
                  <Input
                    id="webhook-url"
                    value={generatedWebhookUrl}
                    readOnly
                    className="flex-1 bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    className="ml-2"
                    onClick={() => copyToClipboard(
                      generatedWebhookUrl,
                      "Webhook URL copied to clipboard"
                    )}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Use this URL to send data to your workflow
                </p>
              </div>
              
              <div>
                <Label>Test Your Webhook</Label>
                <div className="flex justify-end mt-2">
                  <Button variant="outline" className="gap-2">
                    <Rocket className="h-4 w-4" />
                    Send Test Request
                  </Button>
                </div>
              </div>
              
              <div className="pt-2">
                <Label>Sample Payload</Label>
                <Textarea
                  className="font-mono text-sm mt-1.5"
                  value={`{
  "event": "new_record",
  "data": {
    "id": 123,
    "name": "Sample",
    "created_at": "${new Date().toISOString()}"
  }
}`}
                  readOnly
                  rows={6}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="outgoing">
            <div className="space-y-4">
              <div>
                <Label htmlFor="method">HTTP Method</Label>
                <div className="flex gap-2 mt-1.5">
                  {(["GET", "POST", "PUT", "DELETE"] as const).map((method) => (
                    <Button
                      key={method}
                      variant={config.method === method ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateMethod(method)}
                    >
                      {method}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="target-url">Target URL</Label>
                <Input
                  id="target-url"
                  placeholder="https://api.example.com/endpoint"
                  value={config.url}
                  onChange={(e) => updateUrl(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <Label>Headers</Label>
                </div>
                
                <div className="mt-1.5 space-y-2">
                  {Object.entries(config.headers).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <Input value={key} readOnly className="flex-1" />
                      <Input value={value} readOnly className="flex-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHeader(key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Header name"
                      value={headerKey}
                      onChange={(e) => setHeaderKey(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={headerValue}
                      onChange={(e) => setHeaderValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={addHeader}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="body-template">Request Body Template</Label>
                <Textarea
                  id="body-template"
                  className="font-mono text-sm mt-1.5"
                  placeholder={`{
  "data": "{{step1.output}}",
  "timestamp": "{{timestamp}}"
}`}
                  value={config.bodyTemplate}
                  onChange={(e) => updateBodyTemplate(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {'{{variable}}'} syntax to include dynamic data from previous steps
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="authentication">
            <div className="space-y-4">
              <div>
                <Label htmlFor="auth-type">Authentication Type</Label>
                <Select
                  value={config.authType}
                  onValueChange={(value: "none" | "basic" | "api_key" | "oauth2" | "custom") => 
                    updateAuthType(value)
                  }
                >
                  <SelectTrigger id="auth-type">
                    <SelectValue placeholder="Select authentication type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Authentication</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                    <SelectItem value="api_key">API Key</SelectItem>
                    <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {config.authType === "basic" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="auth-username">Username</Label>
                    <Input
                      id="auth-username"
                      value={config.authConfig.username || ""}
                      onChange={(e) => updateAuthConfig("username", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="auth-password">Password</Label>
                    <Input
                      id="auth-password"
                      type="password"
                      value={config.authConfig.password || ""}
                      onChange={(e) => updateAuthConfig("password", e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {config.authType === "api_key" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="api-key-name">API Key Name</Label>
                    <Input
                      id="api-key-name"
                      value={config.authConfig.apiKeyName || ""}
                      onChange={(e) => updateAuthConfig("apiKeyName", e.target.value)}
                      placeholder="X-API-Key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-key-value">API Key</Label>
                    <Input
                      id="api-key-value"
                      type="password"
                      value={config.authConfig.apiKey || ""}
                      onChange={(e) => updateAuthConfig("apiKey", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-key-location">API Key Location</Label>
                    <Select
                      value={config.authConfig.apiKeyLocation || "header"}
                      onValueChange={(value: "header" | "query" | "body") => 
                        updateAuthConfig("apiKeyLocation", value)
                      }
                    >
                      <SelectTrigger id="api-key-location">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">Header</SelectItem>
                        <SelectItem value="query">Query Parameter</SelectItem>
                        <SelectItem value="body">Request Body</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {config.authType === "oauth2" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="oauth-token">OAuth 2.0 Token</Label>
                    <Input
                      id="oauth-token"
                      type="password"
                      value={config.authConfig.token || ""}
                      onChange={(e) => updateAuthConfig("token", e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {config.authType === "custom" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="custom-auth">Custom Authentication</Label>
                    <Textarea
                      id="custom-auth"
                      value={config.authConfig.customAuth || ""}
                      onChange={(e) => updateAuthConfig("customAuth", e.target.value)}
                      rows={6}
                      className="font-mono text-sm"
                      placeholder="// JavaScript code to handle custom auth\nfunction generateAuth(request) {\n  const timestamp = Date.now();\n  const signature = computeHmac(timestamp, secretKey);\n  request.headers['X-Timestamp'] = timestamp;\n  request.headers['X-Signature'] = signature;\n  return request;\n}"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="testing">
            <div className="space-y-4">
              <div>
                <Label>Test Request</Label>
                <div className="flex justify-end mt-2">
                  <Button 
                    className="gap-2"
                    onClick={handleTestRequest}
                  >
                    <Rocket className="h-4 w-4" />
                    Send Test Request
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>Response</Label>
                <Textarea
                  className="font-mono text-sm mt-1.5"
                  value={testResponse}
                  readOnly
                  rows={10}
                  placeholder="Response will appear here after testing..."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
