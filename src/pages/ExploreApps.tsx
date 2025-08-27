import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Grid, List, Plus } from "lucide-react";
import { mockApps, AppItem } from "@/data/mockApps";
import { useIntegrationData } from "@/hooks/useIntegrationData";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ExploreApps() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { connectIntegration, isConnecting } = useIntegrationData();

  const categories = ["all", "Email", "Communication", "Productivity", "Storage", "Marketing", "Finance", "CRM", "Social Media", "Utilities"];

  const filteredApps = mockApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleConnectApp = async (app: AppItem) => {
    try {
      await connectIntegration(app.id, {
        name: app.name,
        type: app.category?.toLowerCase() || 'utility'
      });
      
      toast({
        title: "App Connected",
        description: `${app.name} has been connected to your account successfully.`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${app.name}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Apps</h1>
        <p className="text-gray-600">Connect your favorite apps and services to automate your workflows</p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search for apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

      {/* Popular Apps Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Popular Apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {mockApps.filter(app => app.popular).map(app => (
            <AppCard 
              key={app.id} 
              app={app} 
              viewMode="grid"
              onConnect={handleConnectApp}
              isConnecting={isConnecting}
            />
          ))}
        </div>
      </section>

      {/* All Apps Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          All Apps ({filteredApps.length})
        </h2>
        
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredApps.map(app => (
              <AppCard 
                key={app.id} 
                app={app} 
                viewMode="grid"
                onConnect={handleConnectApp}
                isConnecting={isConnecting}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApps.map(app => (
              <AppCard 
                key={app.id} 
                app={app} 
                viewMode="list"
                onConnect={handleConnectApp}
                isConnecting={isConnecting}
              />
            ))}
          </div>
        )}
      </section>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No apps found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}

interface AppCardProps {
  app: AppItem;
  viewMode: "grid" | "list";
  onConnect: (app: AppItem) => void;
  isConnecting: boolean;
}

const AppCard: React.FC<AppCardProps> = ({ app, viewMode, onConnect, isConnecting }) => {
  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold", app.color || "bg-gray-500")}>
                {app.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{app.name}</h3>
                <p className="text-gray-600 text-sm">{app.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  {app.category && (
                    <Badge variant="outline" className="text-xs">
                      {app.category}
                    </Badge>
                  )}
                  {app.popular && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                      Popular
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button 
              onClick={() => onConnect(app)}
              disabled={isConnecting}
              className="gap-2"
            >
              <Plus size={16} />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold", app.color || "bg-gray-500")}>
            {app.icon}
          </div>
          {app.popular && (
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
              Popular
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardTitle className="text-base mb-2">{app.name}</CardTitle>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{app.description}</p>
        
        <div className="flex items-center justify-between">
          {app.category && (
            <Badge variant="outline" className="text-xs">
              {app.category}
            </Badge>
          )}
          <Button 
            size="sm" 
            onClick={() => onConnect(app)}
            disabled={isConnecting}
            className="gap-1"
          >
            <Plus size={14} />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};