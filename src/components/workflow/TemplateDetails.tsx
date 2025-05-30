
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Zap } from "lucide-react";
import { WorkflowTemplate } from "./TemplateGallery";

interface TemplateDetailsProps {
  template: WorkflowTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: WorkflowTemplate) => void;
}

export const TemplateDetails: React.FC<TemplateDetailsProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate
}) => {
  if (!template) return null;
  
  const handleUseTemplate = () => {
    onUseTemplate(template);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{template.name}</DialogTitle>
            {template.featured && (
              <Badge variant="secondary" className="ml-2">Featured</Badge>
            )}
            {template.category && (
              <Badge variant="outline">{template.category}</Badge>
            )}
          </div>
          <DialogDescription className="text-base py-2">
            {template.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {template.previewImage && (
            <div className="rounded-md overflow-hidden border">
              <img 
                src={template.previewImage} 
                alt={template.name} 
                className="w-full h-auto object-cover" 
              />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Template Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3">
                <p className="text-sm font-medium">Created by</p>
                <p>{template.author || 'Zapier Team'}</p>
              </Card>
              
              <Card className="p-3">
                <p className="text-sm font-medium">Last Updated</p>
                <p>{template.lastUpdated || '2 weeks ago'}</p>
              </Card>
              
              <Card className="p-3">
                <p className="text-sm font-medium">Steps</p>
                <p>{template.steps?.length || '3'} steps</p>
              </Card>
              
              <Card className="p-3">
                <p className="text-sm font-medium">Used by</p>
                <p>{template.usageCount || '243'} users</p>
              </Card>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">What You'll Need</h3>
            <ul className="list-disc pl-5 space-y-1">
              {template.requiredAccounts?.map((account, index) => (
                <li key={index}>{account}</li>
              )) || (
                <>
                  <li>A Gmail account</li>
                  <li>A Slack workspace</li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Steps</h3>
            <ol className="list-decimal pl-5 space-y-2">
              {template.workflowSteps?.map((step, index) => (
                <li key={index} className="pl-1">{step}</li>
              )) || (
                <>
                  <li>Gmail - When a new email arrives with attachment</li>
                  <li>Slack - Send the attachment to a channel</li>
                  <li>Gmail - Mark the email as read</li>
                </>
              )}
            </ol>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between border-t pt-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
            <Button onClick={handleUseTemplate} className="gap-1">
              <Zap className="h-4 w-4" />
              Use Template
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
