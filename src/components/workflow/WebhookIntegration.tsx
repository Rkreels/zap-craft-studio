import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Rocket, ExternalLink, Trash2, Code, Key, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdvancedWebhook, WebhookAdvancedConfig } from "./AdvancedWebhook";

export interface WebhookConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers: Record<string, string>;
  bodyTemplate: string;
  advanced?: boolean;
  advancedConfig?: WebhookAdvancedConfig;
}

interface WebhookIntegrationProps {
  config: WebhookConfig;
  onChange: (config: WebhookConfig) => void;
  generatedWebhookUrl?: string;
}

export const WebhookIntegration: React.FC<WebhookIntegrationProps> = ({
  config,
  onChange,
  generatedWebhookUrl = "https://example.com/webhook/123456789"
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("incoming");
  const [headerKey, setHeaderKey] = useState("");
  const [headerValue, setHeaderValue] = useState("");
  const [isAdvancedMode, setIsAdvancedMode] = useState(config.advanced || false);

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
  
  const handleToggleAdvanced = () => {
    const newValue = !isAdvancedMode;
    setIsAdvancedMode(newValue);
    
    // Initialize advanced config if switching to advanced mode
    if (newValue && !config.advancedConfig) {
      onChange({
        ...config,
        advanced: newValue,
        advancedConfig: {
          url: config.url,
          method: config.method,
          headers: { ...config.headers },
          bodyTemplate: config.bodyTemplate,
          authType: "none",
          authConfig: {},
          useSubscription: false
        }
      });
    } else {
      onChange({
        ...config,
        advanced: newValue
      });
    }
  };
  
  const handleAdvancedConfigChange = (advancedConfig: WebhookAdvancedConfig) => {
    onChange({
      ...config,
      advancedConfig,
      // Keep basic config in sync with advanced
      url: advancedConfig.url,
      method: advancedConfig.method,
      headers: { ...advancedConfig.headers },
      bodyTemplate: advancedConfig.bodyTemplate,
    });
  };

  // If in advanced mode, render the advanced component
  if (isAdvancedMode && config.advancedConfig) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50">Advanced Mode</Badge>
            <Button 
              variant="link" 
              size="sm" 
              className="text-sm h-auto p-0" 
              onClick={handleToggleAdvanced}
            >
              Switch to Basic Mode
            </Button>
          </div>
        </div>
        
        <AdvancedWebhook
          config={config.advancedConfig}
          onChange={handleAdvancedConfigChange}
          generatedWebhookUrl={generatedWebhookUrl}
        />
      </div>
    );
  }

  // Otherwise, render the standard webhook interface
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Webhook Integration</CardTitle>
            <CardDescription>
              Configure webhooks to trigger or perform actions in your workflow
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handleToggleAdvanced}
          >
            <Code className="h-4 w-4" />
            Advanced Mode
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="incoming">Incoming Webhook</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing Webhook</TabsTrigger>
          </TabsList>
          
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
                  <Button
                    variant="outline"
                    className="ml-2"
                    onClick={() => window.open("https://webhook.site", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
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
        </Tabs>
      </CardContent>
    </Card>
  );
};
