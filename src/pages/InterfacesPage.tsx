
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Layout, Table, Grid, Settings, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data for interfaces
const mockInterfaces = [
  {
    id: "interface-1",
    name: "Customer Dashboard",
    description: "Main dashboard for customer data visualization",
    type: "dashboard",
    lastEdited: "2025-05-13T10:20:00Z",
    status: "published",
  },
  {
    id: "interface-2",
    name: "Product Catalog",
    description: "Interactive product catalog for internal teams",
    type: "form",
    lastEdited: "2025-05-12T14:15:00Z",
    status: "draft",
  },
  {
    id: "interface-3",
    name: "Sales Performance",
    description: "Sales metrics and KPIs for the management team",
    type: "dashboard",
    lastEdited: "2025-05-10T09:30:00Z",
    status: "published",
  },
  {
    id: "interface-4",
    name: "Inventory Management",
    description: "System for tracking and managing inventory levels",
    type: "form",
    lastEdited: "2025-05-08T16:45:00Z",
    status: "published",
  },
  {
    id: "interface-5",
    name: "Customer Feedback Form",
    description: "Form for collecting customer feedback and suggestions",
    type: "form",
    lastEdited: "2025-05-05T11:10:00Z",
    status: "draft",
  },
];

const templateCategories = [
  { id: "dashboards", name: "Dashboards", count: 12 },
  { id: "forms", name: "Forms", count: 8 },
  { id: "reports", name: "Reports", count: 6 },
  { id: "tables", name: "Tables", count: 10 },
  { id: "charts", name: "Charts", count: 7 },
];

const templates = [
  {
    id: "template-1",
    name: "Analytics Dashboard",
    description: "Track key metrics in real-time",
    category: "dashboards",
    image: "/placeholder.svg",
  },
  {
    id: "template-2",
    name: "Customer Survey Form",
    description: "Collect and analyze customer feedback",
    category: "forms",
    image: "/placeholder.svg",
  },
  {
    id: "template-3",
    name: "Sales Report",
    description: "Visualize sales performance data",
    category: "reports",
    image: "/placeholder.svg",
  },
  {
    id: "template-4",
    name: "Inventory Table",
    description: "Track and manage product inventory",
    category: "tables",
    image: "/placeholder.svg",
  },
  {
    id: "template-5",
    name: "Financial Dashboard",
    description: "Monitor financial KPIs",
    category: "dashboards",
    image: "/placeholder.svg",
  },
  {
    id: "template-6",
    name: "Project Management Board",
    description: "Track project tasks and progress",
    category: "dashboards",
    image: "/placeholder.svg",
  },
];

export default function InterfacesPage() {
  const [activeTab, setActiveTab] = useState("my-interfaces");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [interfaces, setInterfaces] = useState(mockInterfaces);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleCreateInterface = () => {
    toast({
      title: "Create new interface",
      description: "Building a new interface from scratch",
    });
  };

  const handleUseTemplate = (templateId: string, templateName: string) => {
    toast({
      title: "Template selected",
      description: `Creating interface from template: ${templateName}`,
    });
  };

  const handleOpenInterface = (id: string, name: string) => {
    toast({
      title: "Opening interface",
      description: `Opening ${name} for editing`,
    });
  };
  
  const handlePublish = (id: string) => {
    setInterfaces(interfaces.map(item => 
      item.id === id ? { ...item, status: "published" } : item
    ));
    
    toast({
      title: "Interface published",
      description: "Your interface is now live and accessible",
    });
  };

  // Filter interfaces based on search
  const filteredInterfaces = interfaces.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Interfaces</h1>
            <p className="text-gray-600">Create and manage customizable interfaces for your data</p>
          </div>
          <Button 
            onClick={handleCreateInterface} 
            className="bg-purple-600 hover:bg-purple-700 self-start"
          >
            <Plus size={16} className="mr-2" />
            New Interface
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto mb-6 grid grid-cols-2 md:flex">
          <TabsTrigger value="my-interfaces">My Interfaces</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder={`Search ${activeTab === "templates" ? "templates" : "interfaces"}...`}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="my-interfaces" className="mt-0">
          {filteredInterfaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInterfaces.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="mt-1">{item.description}</CardDescription>
                      </div>
                      <div className="flex-shrink-0">
                        {item.type === "dashboard" ? (
                          <Layout size={20} className="text-purple-500" />
                        ) : item.type === "form" ? (
                          <Grid size={20} className="text-blue-500" />
                        ) : (
                          <Table size={20} className="text-green-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last edited: {formatDate(item.lastEdited)}</span>
                      <span className={`${
                        item.status === "published" ? "text-green-600" : "text-amber-600"
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenInterface(item.id, item.name)}>
                      <Settings size={16} className="mr-1.5" /> Edit
                    </Button>
                    {item.status === "draft" ? (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handlePublish(item.id)}>
                        Publish
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <ExternalLink size={16} className="mr-1.5" /> View
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No interfaces found. Create your first interface or use a template.</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={handleCreateInterface}>
                <Plus size={16} className="mr-2" /> Create Interface
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="mt-0">
          {/* Template categories */}
          <div className="flex overflow-x-auto mb-6 pb-2 gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              className={selectedCategory === "all" ? "bg-purple-600 hover:bg-purple-700" : ""}
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Button>
            {templateCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={selectedCategory === category.id ? "bg-purple-600 hover:bg-purple-700" : ""}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          {/* Templates grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img 
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardFooter className="border-t pt-4 flex justify-end">
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => handleUseTemplate(template.id, template.name)}>
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No templates match your search criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}>
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
