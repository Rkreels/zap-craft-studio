
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, Grid, List, Star, Tag } from "lucide-react";
import { AppItem } from "@/components/zap-creator/AppSelector";
import { cn } from "@/lib/utils";

interface IntegrationDirectoryProps {
  onSelectApp: (app: AppItem) => void;
  availableApps: AppItem[];
}

export const IntegrationDirectory: React.FC<IntegrationDirectoryProps> = ({
  onSelectApp,
  availableApps
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Mock categories for demonstration
  const categories = [
    "Email", "Social Media", "CRM", "Marketing", "Productivity", 
    "Finance", "Communication", "Analytics", "Storage", "Utilities"
  ];
  
  // Filter apps based on search and category
  const filteredApps = availableApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Directory</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search for apps..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="mt-2">
          <TabsList className="mb-4 overflow-x-auto flex-nowrap">
            <TabsTrigger value="all" onClick={() => setCategoryFilter(null)}>
              All
            </TabsTrigger>
            <TabsTrigger value="popular">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredApps.map(app => (
                  <Card 
                    key={app.id} 
                    className="cursor-pointer hover:border-purple-300 transition-colors"
                    onClick={() => onSelectApp(app)}
                  >
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className={cn("w-12 h-12 rounded-md flex items-center justify-center text-white font-bold mb-2", app.color || "bg-gray-100")}>
                        {app.icon}
                      </div>
                      <p className="text-center font-medium">{app.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredApps.map(app => (
                  <div 
                    key={app.id}
                    className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onSelectApp(app)}
                  >
                    <div className={cn("w-8 h-8 rounded-md flex items-center justify-center text-white font-bold mr-3", app.color || "bg-gray-100")}>
                      {app.icon}
                    </div>
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-gray-500">{app.description || "Connect this app to your workflow"}</p>
                    </div>
                    {app.category && (
                      <div className="ml-auto">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500 ml-1">{app.category}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* We would repeat for other tabs, but simplified for this example */}
          <TabsContent value="popular" className="mt-0">
            {/* Popular apps would be displayed here */}
            <div className="text-center py-6 text-gray-500">
              Popular apps would appear here
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
