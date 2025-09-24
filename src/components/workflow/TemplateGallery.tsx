import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Heart, Search, Star, Zap, Loader2 } from "lucide-react";
import { TemplateDetails } from "./TemplateDetails";
import { useTemplateManager } from "@/hooks/useTemplateManager";

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
  previewImage?: string;
  author?: string;
  lastUpdated?: string;
  usageCount?: number;
  requiredAccounts?: string[];
  workflowSteps?: string[];
  steps?: any[];
  schedule?: any;
}

interface TemplateGalleryProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ 
  onSelectTemplate 
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { 
    templates, 
    isLoading, 
    getFeaturedTemplates, 
    getPopularTemplates, 
    getNewTemplates,
    searchTemplates,
    isApplying 
  } = useTemplateManager();
  
  // Fallback template data if needed
  const fallbackTemplates: WorkflowTemplate[] = [
    {
      id: "template-1",
      name: "Gmail to Slack Notification",
      description: "Get Slack messages when new emails with specific labels arrive in Gmail",
      category: "Communication",
      featured: true,
      popular: true,
      steps: [
        {
          id: "trigger-1",
          type: "trigger",
          appId: "gmail",
          appName: "Gmail",
          actionName: "New Email",
          configured: true,
          config: {}
        },
        {
          id: "action-1",
          type: "action",
          appId: "slack",
          appName: "Slack",
          actionName: "Send Channel Message",
          configured: true,
          config: {}
        }
      ]
    },
    {
      id: "template-2",
      name: "Twitter to Google Sheets",
      description: "Save tweets matching your search criteria to a Google Sheets spreadsheet",
      category: "Social Media",
      new: true,
      steps: [
        {
          id: "trigger-1",
          type: "trigger",
          appId: "twitter",
          appName: "Twitter",
          actionName: "New Search Mention",
          configured: true,
          config: {}
        },
        {
          id: "action-1",
          type: "action",
          appId: "sheets",
          appName: "Google Sheets",
          actionName: "Add Row",
          configured: true,
          config: {}
        }
      ]
    },
    {
      id: "template-3",
      name: "Shopify Order to Trello Card",
      description: "Create a Trello card for each new order in your Shopify store",
      category: "E-commerce",
      popular: true,
      steps: [
        {
          id: "trigger-1",
          type: "trigger",
          appId: "shopify",
          appName: "Shopify",
          actionName: "New Order",
          configured: true,
          config: {}
        },
        {
          id: "action-1",
          type: "action",
          appId: "trello",
          appName: "Trello",
          actionName: "Create Card",
          configured: true,
          config: {}
        }
      ]
    },
    {
      id: "template-4",
      name: "Lead Form to CRM",
      description: "Automatically add new form submissions as leads in your CRM",
      category: "Marketing",
      featured: true,
      steps: [
        {
          id: "trigger-1",
          type: "trigger",
          appId: "forms",
          appName: "Form Service",
          actionName: "New Submission",
          configured: true,
          config: {}
        },
        {
          id: "action-1",
          type: "action",
          appId: "crm",
          appName: "CRM System",
          actionName: "Create Lead",
          configured: true,
          config: {}
        }
      ]
    },
    {
      id: "template-5",
      name: "Invoice Paid to Thank You Email",
      description: "Send an automated thank you email when an invoice is paid",
      category: "Finance",
      steps: [
        {
          id: "trigger-1",
          type: "trigger",
          appId: "accounting",
          appName: "Accounting Software",
          actionName: "Invoice Paid",
          configured: true,
          config: {}
        },
        {
          id: "action-1",
          type: "action",
          appId: "email",
          appName: "Email Service",
          actionName: "Send Email",
          configured: true,
          config: {}
        }
      ]
    },
    {
      id: "template-6",
      name: "Calendar Event to Task Reminder",
      description: "Create a task reminder when new calendar events are added",
      category: "Productivity",
      new: true,
      steps: [
        {
          id: "trigger-1",
          type: "trigger",
          appId: "calendar",
          appName: "Calendar App",
          actionName: "New Event",
          configured: true,
          config: {}
        },
        {
          id: "action-1",
          type: "action",
          appId: "tasks",
          appName: "Task Manager",
          actionName: "Create Task",
          configured: true,
          config: {}
        }
      ]
    }
  ];
  
  // Get filtered templates based on active tab and search
  const getFilteredTemplates = () => {
    // Use fallback templates if no templates from API
    const availableTemplates = templates.length > 0 ? templates : fallbackTemplates;
    let filteredTemplates = availableTemplates;
    
    if (searchQuery.trim()) {
      filteredTemplates = searchTemplates(searchQuery);
      if (filteredTemplates.length === 0 && templates.length === 0) {
        // If API search returns nothing, search fallback templates
        const lowercaseQuery = searchQuery.toLowerCase();
        filteredTemplates = fallbackTemplates.filter(template => 
          template.name.toLowerCase().includes(lowercaseQuery) ||
          template.description.toLowerCase().includes(lowercaseQuery) ||
          template.category.toLowerCase().includes(lowercaseQuery)
        );
      }
    }
    
    switch (activeTab) {
      case "featured":
        return searchQuery ? filteredTemplates.filter(t => t.featured) : 
               (templates.length > 0 ? getFeaturedTemplates() : fallbackTemplates.filter(t => t.featured));
      case "popular":
        return searchQuery ? filteredTemplates.filter(t => t.popular) : 
               (templates.length > 0 ? getPopularTemplates() : fallbackTemplates.filter(t => t.popular));
      case "new":
        return searchQuery ? filteredTemplates.filter(t => t.new) : 
               (templates.length > 0 ? getNewTemplates() : fallbackTemplates.filter(t => t.new));
      default:
        return filteredTemplates;
    }
  };
  
  const filteredTemplates = getFilteredTemplates();
  
  // Use the filtered templates from the hook
  
  const handleViewDetails = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setIsDetailsOpen(true);
  };
  
  const handleUseTemplate = async (template: WorkflowTemplate) => {
    try {
      await onSelectTemplate(template);
      // Provide voice feedback
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(`Template "${template.name}" has been applied to your workflow successfully.`);
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);
      }
    } catch (error) {
      console.error('Failed to apply template:', error);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search templates..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="featured">
            <Star className="h-3.5 w-3.5 mr-1" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="popular">
            <Zap className="h-3.5 w-3.5 mr-1" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading templates...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map(template => (
                  <TemplateCard 
                    key={template.id} 
                    template={template} 
                    onViewDetails={handleViewDetails}
                    onUseTemplate={handleUseTemplate}
                    isApplying={isApplying}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-8 border border-dashed rounded-md">
                  <p className="text-gray-500">No templates found matching your search</p>
                  <p className="text-xs text-gray-400 mt-2">Try clearing your search or browse by category</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="featured" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  onViewDetails={handleViewDetails}
                  onUseTemplate={handleUseTemplate}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8 border border-dashed rounded-md">
                <p className="text-gray-500">No featured templates found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  onViewDetails={handleViewDetails}
                  onUseTemplate={handleUseTemplate}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8 border border-dashed rounded-md">
                <p className="text-gray-500">No popular templates found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="new" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  onViewDetails={handleViewDetails}
                  onUseTemplate={handleUseTemplate}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8 border border-dashed rounded-md">
                <p className="text-gray-500">No new templates found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <TemplateDetails 
        template={selectedTemplate}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
};

interface TemplateCardProps {
  template: WorkflowTemplate;
  onViewDetails: (template: WorkflowTemplate) => void;
  onUseTemplate: (template: WorkflowTemplate) => void;
  isApplying?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onViewDetails,
  onUseTemplate,
  isApplying = false
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{template.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {template.description}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="mt-[-4px]">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline">{template.category}</Badge>
          {template.featured && <Badge variant="secondary">Featured</Badge>}
          {template.new && <Badge variant="default" className="bg-green-500">New</Badge>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" onClick={() => onViewDetails(template)}>
          View Details
        </Button>
        <Button 
          size="sm" 
          className="gap-1" 
          onClick={() => onUseTemplate(template)}
          disabled={isApplying}
        >
          {isApplying ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Check className="h-3 w-3" />
          )}
          {isApplying ? 'Applying...' : 'Use'}
        </Button>
      </CardFooter>
    </Card>
  );
};
