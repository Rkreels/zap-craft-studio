
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InterfaceItem } from '@/types/interfaces';
import { toast } from '@/components/ui/use-toast';
import { Zap, Database, Send, ArrowRight, Plus, Code } from 'lucide-react';

interface ZapierIntegrationDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  interfaces: InterfaceItem[];
}

export default function ZapierIntegrationDialog({ isOpen, setIsOpen, interfaces }: ZapierIntegrationDialogProps) {
  const [activeTab, setActiveTab] = useState('quick-start');
  const [selectedInterface, setSelectedInterface] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sendData, setSendData] = useState(true);

  const handleConnectZapier = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolver => setTimeout(resolver, 1000));
    
    toast({
      title: "Zapier connected",
      description: "Your interface is now connected with Zapier",
    });
    
    setIsLoading(false);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulating the webhook call
      await new Promise(resolver => setTimeout(resolver, 800));
      
      toast({
        title: "Webhook triggered",
        description: "Test data sent successfully to your Zapier webhook",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger the webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Zapier Integration
          </DialogTitle>
          <DialogDescription>
            Connect your interfaces with thousands of apps via Zapier
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
            <TabsTrigger value="webhook">Webhook</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="quick-start" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="interface">Select Interface</Label>
                <Select 
                  value={selectedInterface} 
                  onValueChange={setSelectedInterface}
                >
                  <SelectTrigger id="interface">
                    <SelectValue placeholder="Select an interface" />
                  </SelectTrigger>
                  <SelectContent>
                    {interfaces.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-sm font-medium">Connect your interface</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Go to <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Zapier.com</a> and create a new Zap</li>
                  <li>Choose this app as your Trigger</li>
                  <li>Follow the prompts to connect your account</li>
                  <li>Configure your action steps</li>
                </ol>

                <Button 
                  onClick={handleConnectZapier} 
                  className="w-full mt-2"
                  disabled={!selectedInterface || isLoading}
                >
                  {isLoading ? "Connecting..." : "Connect with Zapier"}
                </Button>
              </div>

              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Popular Zapier Actions
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="border rounded p-2 bg-white text-xs flex items-center gap-1">
                    <span className="bg-blue-100 p-1 rounded">
                      <Send className="w-3 h-3 text-blue-600" />
                    </span>
                    <span>Send Email</span>
                  </div>
                  <div className="border rounded p-2 bg-white text-xs flex items-center gap-1">
                    <span className="bg-green-100 p-1 rounded">
                      <Database className="w-3 h-3 text-green-600" />
                    </span>
                    <span>Add to Sheet</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-4 pt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Use Zapier webhooks to trigger automations when events happen in your interface.
              </p>
              
              <div>
                <Label htmlFor="webhook-url">Zapier Webhook URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    id="webhook-url" 
                    value={webhookUrl} 
                    onChange={(e) => setWebhookUrl(e.target.value)} 
                    placeholder="https://hooks.zapier.com/..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleTestWebhook} 
                    disabled={!webhookUrl || isLoading}
                  >
                    Test
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="send-data" 
                  checked={sendData} 
                  onCheckedChange={(checked) => setSendData(!!checked)} 
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="send-data">
                    Send form data with webhook
                  </Label>
                  <p className="text-sm text-gray-500">
                    Include all form fields and metadata when triggering the webhook.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-md p-3 border">
                <h4 className="text-xs font-medium mb-1">Example webhook payload:</h4>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`{
  "form_id": "interface-123",
  "form_name": "Customer Registration Form",
  "submitted_at": "2025-05-18T14:30:00Z",
  "data": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}`}</pre>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Configure advanced integration options and custom code.
              </p>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Custom Webhook Headers
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Header name" />
                    <Input placeholder="Header value" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-1" /> Add Header
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium">Transform Data</h3>
                <p className="text-xs text-gray-500 mt-1 mb-2">
                  Write custom code to transform your data before sending to Zapier
                </p>
                <div className="bg-gray-100 p-2 rounded border text-xs font-mono h-[100px] overflow-y-auto">
{`// Example: Transform data before sending
function transform(data) {
  // Add a timestamp
  data.processed_at = new Date().toISOString();
  
  // Convert name to uppercase
  if (data.name) {
    data.name = data.name.toUpperCase();
  }
  
  return data;
}`}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} className="mr-2">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              toast({
                title: "Settings saved",
                description: "Your Zapier integration settings have been saved",
              });
              setIsOpen(false);
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
