
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  MessageSquare, 
  Calendar, 
  ShoppingCart, 
  FileText, 
  Database,
  Mail
} from "lucide-react";
import { WorkflowStepData } from "./WorkflowStep";
import { ScheduleConfig } from "./ScheduleBuilder";
import { useToast } from "@/components/ui/use-toast";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  popularity: number;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  steps: WorkflowStepData[];
  schedule?: ScheduleConfig;
  createdBy: string;
  isOfficial: boolean;
}

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();

  // Sample pre-built templates
  const templates: Template[] = [
    {
      id: "template-1",
      name: "New Lead Notification",
      description: "Send a notification when a new lead is created in your CRM system.",
      category: "sales",
      tags: ["crm", "notification", "sales"],
      popularity: 4.8,
      complexity: "beginner",
      steps: [
        {
          id: "trigger-1",
          type: "trigger",
          appId: "crm",
          appName: "CRM System",
          actionName: "New Lead Created",
          configured: true,
          config: {}
        },
        {
          id: "action-1",
          type: "action",
          appId: "slack",
          appName: "Slack",
          actionName: "Send Message",
          configured: true,
          config: {}
        }
      ],
      createdBy: "Zapier Team",
      isOfficial: true
    },
    {
      id: "template-2",
      name: "Calendar to Task Integration",
      description: "Create tasks from new calendar events automatically.",
      category: "productivity",
      tags: ["calendar", "tasks", "automation"],
      popularity: 4.5,
      complexity: "beginner",
      steps: [
        {
          id: "trigger-1",
          type: "trigger",
          appId: "calendar",
          appName: "Google Calendar",
          actionName: "New Event Created",
          configured: true,
          config: {}
        },
        {
          id: "action-1",
          type: "action",
          appId: "asana",
          appName: "Asana",
          actionName: "Create Task",
          configured: true,
          config: {}
        }
      ],
      createdBy: "Productivity Team",
      isOfficial: true
    },
    {
      id: "template-3",
      name: "Multi-step Email Campaign",
      description: "Send a series of timed emails to new subscribers.",
      category: "marketing",
      tags: ["email", "automation", "marketing"],
      popularity: 4.7,
      complexity: "intermediate",
      steps: [
        {
          id: "trigger-1",
          type: "trigger",
          appId: "form",
          appName: "Form Submission",
          actionName: "New Subscriber",
          configured: true,
          config: {}
        },
        {
          id: "action-1",
          type: "action",
          appId: "email",
          appName: "Email",
          actionName: "Send Welcome Email",
          configured: true,
          config: {}
        },
        {
          id: "action-2",
          type: "action",
          appId: "delay",
          appName: "Delay",
          actionName: "Wait 2 Days",
          configured: true,
          config: {}
        },
        {
          id: "action-3",
          type: "action",
          appId: "email",
          appName: "Email",
          actionName: "Send Follow-up",
          configured: true,
          config: {}
        }
      ],
      schedule: {
        frequency: "daily",
        time: "09:00",
        active: true
      },
      createdBy: "Marketing Team",
      isOfficial: true
    },
    {
      id: "template-4",
      name: "Order Fulfillment Workflow",
      description: "Process orders from your e-commerce platform to your fulfillment system.",
      category: "ecommerce",
      tags: ["orders", "inventory", "shipping"],
      popularity: 4.6,
      complexity: "advanced",
      steps: [
        {
          id: "trigger-1",
          type: "trigger",
          appId: "shopify",
          appName: "Shopify",
          actionName: "New Paid Order",
          configured: true,
          config: {}
        },
        {
          id: "action-1",
          type: "action",
          appId: "inventory",
          appName: "Inventory System",
          actionName: "Check Stock",
          configured: true,
          config: {}
        },
        {
          id: "action-2",
          type: "action",
          appId: "shipping",
          appName: "Shipping Partner",
          actionName: "Create Shipment",
          configured: true,
          config: {}
        },
        {
          id: "action-3",
          type: "action",
          appId: "email",
          appName: "Email",
          actionName: "Send Tracking Info",
          configured: true,
          config: {}
        }
      ],
      createdBy: "E-commerce Solutions",
      isOfficial: true
    }
  ];

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: Template) => {
    onSelectTemplate(template);
    toast({
      title: "Template Selected",
      description: `"${template.name}" template has been applied to your workflow.`,
    });
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sales":
        return <ShoppingCart className="h-5 w-5" />;
      case "productivity":
        return <Clock className="h-5 w-5" />;
      case "marketing":
        return <Mail className="h-5 w-5" />;
      case "ecommerce":
        return <ShoppingCart className="h-5 w-5" />;
      case "content":
        return <FileText className="h-5 w-5" />;
      case "database":
        return <Database className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  // Get icon for complexity
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4 flex w-full flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(template.category)}
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    {template.isOfficial && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Official
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{template.popularity}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" /> 
                      <span>{Math.floor(Math.random() * 900) + 100} users</span>
                    </div>
                    <Badge className={getComplexityColor(template.complexity)}>
                      {template.complexity}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    className="w-full"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {["sales", "productivity", "marketing", "ecommerce", "content"].map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(template.category)}
                          <CardTitle className="text-base">{template.name}</CardTitle>
                        </div>
                        {template.isOfficial && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Official
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{template.popularity}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-500" /> 
                          <span>{Math.floor(Math.random() * 900) + 100} users</span>
                        </div>
                        <Badge className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 py-10 text-center">
                  <p className="text-gray-500">No templates found in this category matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
