import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Star, Zap, Users, TrendingUp, Clock, ArrowRight, Sparkles } from "lucide-react";
import { mockApps } from "@/data/mockApps";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const categories = [
    { id: "all", name: "All", icon: Sparkles },
    { id: "productivity", name: "Productivity", icon: Zap },
    { id: "marketing", name: "Marketing", icon: TrendingUp },
    { id: "sales", name: "Sales", icon: Users },
    { id: "finance", name: "Finance", icon: Clock },
  ];

  const templates = [
    {
      id: "1",
      name: "Google Sheets to Slack",
      description: "Send Slack notifications when new rows are added to Google Sheets",
      uses: 12500,
      rating: 4.8,
      category: "productivity",
      apps: ["Google Sheets", "Slack"],
      difficulty: "Easy",
      timeToSetup: "2 min"
    },
    {
      id: "2", 
      name: "Gmail to Trello",
      description: "Create Trello cards from new Gmail emails with specific labels",
      uses: 8300,
      rating: 4.7,
      category: "productivity",
      apps: ["Gmail", "Trello"],
      difficulty: "Easy",
      timeToSetup: "3 min"
    },
    {
      id: "3",
      name: "Shopify to MailChimp",
      description: "Add new Shopify customers to MailChimp lists automatically",
      uses: 15200,
      rating: 4.9,
      category: "marketing",
      apps: ["Shopify", "MailChimp"],
      difficulty: "Medium",
      timeToSetup: "5 min"
    },
    {
      id: "4",
      name: "Twitter to Google Sheets",
      description: "Save new tweets matching search criteria to a spreadsheet",
      uses: 9800,
      rating: 4.6,
      category: "marketing",
      apps: ["Twitter", "Google Sheets"],
      difficulty: "Easy",
      timeToSetup: "3 min"
    },
    {
      id: "5",
      name: "Stripe to QuickBooks",
      description: "Create invoices in QuickBooks for new Stripe charges",
      uses: 11400,
      rating: 4.8,
      category: "finance",
      apps: ["Stripe", "QuickBooks"],
      difficulty: "Medium",
      timeToSetup: "7 min"
    },
    {
      id: "6",
      name: "Calendly to Salesforce",
      description: "Create or update Salesforce contacts from new Calendly invitees",
      uses: 6200,
      rating: 4.5,
      category: "sales",
      apps: ["Calendly", "Salesforce"],
      difficulty: "Medium",
      timeToSetup: "6 min"
    },
  ];

  const filteredApps = mockApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "all" || app.category === selectedCategory)
  );

  const filteredTemplates = templates.filter(template =>
    (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     template.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === "all" || template.category === selectedCategory)
  );

  const handleUseTemplate = (template: any) => {
    toast({
      title: "Loading template...",
      description: `Setting up "${template.name}" workflow`,
    });
    // Navigate to workflow builder with template
    navigate("/zaps/create", { state: { template } });
  };

  const handleAppSelect = (app: any) => {
    toast({
      title: `${app.name} selected`,
      description: "Opening workflow builder...",
    });
    navigate("/zaps/create", { state: { app } });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Discover</h1>
        <p className="text-muted-foreground">Explore apps, templates, and automation ideas to boost your productivity</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search apps, templates, and workflows..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <category.icon size={14} />
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">
            <TrendingUp size={16} className="mr-2" />
            Popular Templates ({filteredTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="apps">
            <Zap size={16} className="mr-2" />
            Apps ({filteredApps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4 mt-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates found matching your search</p>
              <Button variant="link" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-2">{template.name}</CardTitle>
                      <Badge variant="secondary" className="ml-2 flex items-center gap-1">
                        <Star size={12} className="fill-current" />
                        {template.rating}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {template.apps.map((app, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {template.uses.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {template.timeToSetup}
                        </span>
                      </div>
                      <Badge variant={template.difficulty === "Easy" ? "default" : "secondary"} className="text-xs">
                        {template.difficulty}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <Zap size={14} className="mr-1" />
                      Use Template
                      <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="apps" className="space-y-4 mt-6">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No apps found matching your search</p>
              <Button variant="link" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredApps.map(app => (
                <Card 
                  key={app.id} 
                  className="hover:shadow-md transition-all cursor-pointer hover:scale-105 transform border-2 hover:border-primary/50"
                  onClick={() => handleAppSelect(app)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className={`w-14 h-14 rounded-xl ${app.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                      {app.icon}
                    </div>
                    <h3 className="font-medium mb-1 text-sm">{app.name}</h3>
                    {app.popular && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp size={10} className="mr-1" />
                        Popular
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
