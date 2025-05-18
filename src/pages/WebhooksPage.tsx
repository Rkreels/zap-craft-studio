
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebhookBuilder } from "@/components/zap-creator/WebhookBuilder";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { Code, Copy, ExternalLink, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function WebhooksPage() {
  const [activeTab, setActiveTab] = useState("incoming");

  // Voice guidance for this page
  const voiceGuidanceProps = {
    elementName: "Webhooks Page",
    hoverText: "Configure and manage webhooks for integrating with external services.",
    clickText: "Create and manage webhooks to send and receive data from third-party applications."
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(voiceGuidanceProps);

  const copyEndpoint = () => {
    navigator.clipboard.writeText("https://api.example.com/webhook/123456");
    toast({
      description: "Webhook URL copied to clipboard"
    });
  };

  return (
    <div 
      className="container mx-auto py-6 space-y-6"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Webhooks</h1>
          <p className="text-gray-500">Integrate with external services using webhooks</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus size={16} className="mr-2" />
          Create Webhook
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="incoming">Incoming Webhooks</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing Webhooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="incoming">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Endpoints</CardTitle>
                <CardDescription>
                  Your unique webhook URLs for receiving data from external services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Main Webhook Endpoint</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={copyEndpoint}>
                        <Copy size={14} className="mr-1" />
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink size={14} className="mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>
                  <code className="text-sm bg-gray-100 p-2 rounded block">
                    https://api.example.com/webhook/123456
                  </code>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>Created: May 15, 2025</span>
                    <span>Last triggered: 1 hour ago</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Quick Setup</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    To integrate with external services, use this webhook URL to receive data
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <p className="text-sm text-blue-700">
                        Copy your unique webhook URL above
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <p className="text-sm text-blue-700">
                        Add this URL to the external service that will send data
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <p className="text-sm text-blue-700">
                        Configure how to handle incoming data in your workflows
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Testing Your Webhook</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    You can test your webhook with this cURL command:
                  </p>
                  <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm overflow-x-auto">
                    <code>
                      curl -X POST https://api.example.com/webhook/123456 \<br />
                      -H "Content-Type: application/json" \<br />
                      -d '{"event":"test","data":{"message":"Hello World"}}'
                    </code>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3">
                    <Code size={14} className="mr-1" />
                    Test with Sample Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          
            <Card>
              <CardHeader>
                <CardTitle>Recent Webhook Events</CardTitle>
                <CardDescription>
                  Showing the most recent data received by your webhooks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-4 bg-gray-50 p-3 border-b">
                    <div className="font-medium text-sm">Timestamp</div>
                    <div className="font-medium text-sm">Source</div>
                    <div className="font-medium text-sm">Event Type</div>
                    <div className="font-medium text-sm">Status</div>
                  </div>
                  
                  <div className="grid grid-cols-4 p-3 border-b hover:bg-gray-50 cursor-pointer">
                    <div className="text-sm">May 18, 2025 12:34 PM</div>
                    <div className="text-sm">api.example.com</div>
                    <div className="text-sm">data.updated</div>
                    <div className="text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Success
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 p-3 border-b hover:bg-gray-50 cursor-pointer">
                    <div className="text-sm">May 18, 2025 11:22 AM</div>
                    <div className="text-sm">third-party-service.com</div>
                    <div className="text-sm">user.created</div>
                    <div className="text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Success
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="text-sm">May 17, 2025 3:45 PM</div>
                    <div className="text-sm">payment-gateway.com</div>
                    <div className="text-sm">payment.completed</div>
                    <div className="text-sm">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Failed
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="outgoing">
          <WebhookBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
