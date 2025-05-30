
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Star, Zap, Users, TrendingUp } from "lucide-react";
import { mockApps } from "@/data/mockApps";
import { AppItem } from "@/components/zap-creator/AppSelector";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All" },
    { id: "productivity", name: "Productivity" },
    { id: "marketing", name: "Marketing" },
    { id: "sales", name: "Sales" },
    { id: "finance", name: "Finance" },
  ];

  const templates = [
    {
      id: "1",
      name: "Google Sheets to Slack",
      description: "Send Slack notifications when new rows are added to Google Sheets",
      uses: 12500,
      rating: 4.8,
      category: "productivity"
    },
    {
      id: "2", 
      name: "Gmail to Trello",
      description: "Create Trello cards from new Gmail emails",
      uses: 8300,
      rating: 4.7,
      category: "productivity"
    },
    {
      id: "3",
      name: "Shopify to MailChimp",
      description: "Add new Shopify customers to MailChimp lists",
      uses: 15200,
      rating: 4.9,
      category: "marketing"
    }
  ];

  const filteredApps = mockApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "all" || app.category === selectedCategory)
  );

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "all" || template.category === selectedCategory)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Discover</h1>
        <p className="text-gray-600">Explore apps, templates, and automation ideas</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search apps and templates..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Popular Templates</TabsTrigger>
          <TabsTrigger value="apps">Apps</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary" className="ml-2">
                      <Star size={12} className="mr-1" />
                      {template.rating}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users size={14} className="mr-1" />
                      {template.uses.toLocaleString()} uses
                    </div>
                    <Button size="sm">
                      <Zap size={14} className="mr-1" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apps" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredApps.map(app => (
              <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-lg ${app.color} flex items-center justify-center text-white mb-3`}>
                    {app.icon}
                  </div>
                  <h3 className="font-medium mb-1">{app.name}</h3>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
