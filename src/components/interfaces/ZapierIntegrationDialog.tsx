
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CodeXml } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ZapierIntegrationDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  interfaces: any[];
}

const ZapierIntegrationDialog: React.FC<ZapierIntegrationDialogProps> = ({
  isOpen,
  setIsOpen,
  interfaces
}) => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTriggerZapierWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Triggering Zapier webhook:", webhookUrl);

    try {
      // Since we're using no-cors, we won't get a proper response status
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
          interfaces: interfaces.filter(item => item.status === "published").map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            url: `${window.location.origin}/interface/${item.id}`
          }))
        }),
      });

      toast({
        title: "Request Sent",
        description: "The request was sent to Zapier. Please check your Zap's history to confirm it was triggered.",
      });
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description: "Failed to trigger the Zapier webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CodeXml size={18} />
            Connect to Zapier
          </DialogTitle>
          <DialogDescription>
            Integrate your interfaces with Zapier to automate workflows
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium mb-1">What you can do with Zapier</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Automatically create records in your CRM when a form is submitted</li>
              <li>Send email notifications when interfaces are published</li>
              <li>Update spreadsheets with interface analytics</li>
              <li>Create calendar events for publishing schedules</li>
            </ul>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Your Zapier Webhook URL
            </label>
            <Input
              placeholder="https://hooks.zapier.com/your-webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Create a Zapier webhook trigger and paste the URL here
            </p>
          </div>
          
          <div className="border rounded-md p-4">
            <h4 className="font-medium mb-2">Data that will be sent to Zapier</h4>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-auto">
              {JSON.stringify({
                timestamp: new Date().toISOString(),
                triggered_from: "your-app.com",
                interfaces: [
                  {
                    id: "interface-id",
                    name: "Example Interface",
                    type: "form",
                    url: "https://your-app.com/interface/example-id"
                  }
                ]
              }, null, 2)}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleTriggerZapierWebhook}
            disabled={isLoading || !webhookUrl}
          >
            {isLoading ? "Connecting..." : "Connect & Test"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ZapierIntegrationDialog;
