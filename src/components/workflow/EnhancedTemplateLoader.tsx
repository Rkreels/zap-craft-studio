import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Check, Download, Search, Star, Zap, Loader2 } from 'lucide-react';
import { TemplateGallery, WorkflowTemplate } from './TemplateGallery';
import { useTemplateManager } from '@/hooks/useTemplateManager';
import { toast } from '@/hooks/use-toast';

interface EnhancedTemplateLoaderProps {
  onTemplateApply: (template: WorkflowTemplate) => Promise<void>;
  trigger?: React.ReactNode;
}

export const EnhancedTemplateLoader: React.FC<EnhancedTemplateLoaderProps> = ({
  onTemplateApply,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  const { templates, isLoading, getFeaturedTemplates } = useTemplateManager();
  
  const handleTemplateApply = async (template: WorkflowTemplate) => {
    try {
      setIsApplying(true);
      await onTemplateApply(template);
      setIsOpen(false);
      
      toast({
        title: 'Template Applied',
        description: `"${template.name}" has been successfully applied to your workflow.`,
      });
    } catch (error) {
      console.error('Failed to apply template:', error);
      toast({
        title: 'Failed to Apply Template',
        description: 'There was an error applying the template. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  const defaultTrigger = (
    <Button variant="outline" className="gap-2">
      <Download className="h-4 w-4" />
      Browse Templates
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Workflow Templates
          </DialogTitle>
          <DialogDescription>
            Choose from our collection of pre-built workflows to get started quickly.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading templates...</span>
            </div>
          ) : (
            <TemplateGallery 
              onSelectTemplate={handleTemplateApply}
            />
          )}
        </div>
        
        {isApplying && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Applying template...</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};