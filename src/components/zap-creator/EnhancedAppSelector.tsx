import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Grid, List, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockApps, AppItem } from "@/data/mockApps";
import { useIntegrationData } from "@/hooks/useIntegrationData";
import { toast } from "@/hooks/use-toast";

interface EnhancedAppSelectorProps {
  selectedApp: AppItem | null;
  onSelectApp: (app: AppItem) => void;
  availableApps?: AppItem[];
  className?: string;
  showConnected?: boolean;
}

export const EnhancedAppSelector: React.FC<EnhancedAppSelectorProps> = ({
  selectedApp,
  onSelectApp,
  availableApps = mockApps,
  className,
  showConnected = true
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { integrations, connectIntegration, isConnecting } = useIntegrationData();
  
  const categories = ["all", ...new Set(availableApps.map(app => app.category).filter(Boolean))];
  
  const connectedAppIds = integrations
    .filter(integration => integration.status === 'connected')
    .map(integration => integration.id);
  
  const filteredApps = availableApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || app.category === categoryFilter;
    const isConnected = connectedAppIds.includes(app.id);
    
    if (showConnected) {
      return matchesSearch && matchesCategory;
    }
    return matchesSearch && matchesCategory && isConnected;
  });

  const handleConnectApp = async (app: AppItem) => {
    try {
      await connectIntegration(app.id, {
        name: app.name,
        type: app.category?.toLowerCase() || 'utility'
      });
      
      toast({
        title: "App Connected",
        description: `${app.name} has been connected successfully.`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${app.name}.`,
        variant: "destructive",
      });
    }
  };
  
  if (selectedApp) {
    const isConnected = connectedAppIds.includes(selectedApp.id);
    
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={cn("w-12 h-12 rounded-md flex items-center justify-center text-white font-bold mr-3", selectedApp.color || "bg-gray-500")}>
                {selectedApp.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{selectedApp.name}</h3>
                  {isConnected && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Check size={12} className="mr-1" />
                      Connected
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{selectedApp.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isConnected && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleConnectApp(selectedApp)}
                  disabled={isConnecting}
                >
                  <Plus size={14} className="mr-1" />
                  Connect
                </Button>
              )}
              <Button variant="outline" onClick={() => onSelectApp(null as any)}>
                Change
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Choose an app</CardTitle>
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
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search apps..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category)}
                className="text-xs"
              >
                {category === "all" ? "All" : category}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredApps.map(app => {
              const isConnected = connectedAppIds.includes(app.id);
              return (
                <Card 
                  key={app.id} 
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    isConnected 
                      ? "border-green-300 bg-green-50 hover:border-green-400" 
                      : "hover:border-purple-300 hover:shadow-md"
                  )}
                  onClick={() => onSelectApp(app)}
                >
                  <CardContent className="p-4 flex flex-col items-center relative">
                    {isConnected && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          <Check size={10} />
                        </Badge>
                      </div>
                    )}
                    <div className={cn("w-12 h-12 rounded-md flex items-center justify-center text-white font-bold mb-2", app.color || "bg-gray-500")}>
                      {app.icon}
                    </div>
                    <p className="text-center font-medium text-sm">{app.name}</p>
                    {app.category && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {app.category}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredApps.map(app => {
              const isConnected = connectedAppIds.includes(app.id);
              return (
                <div 
                  key={app.id}
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-md cursor-pointer transition-all duration-200",
                    isConnected 
                      ? "border-green-300 bg-green-50 hover:bg-green-100" 
                      : "hover:bg-gray-50 hover:border-purple-300"
                  )}
                  onClick={() => onSelectApp(app)}
                >
                  <div className="flex items-center">
                    <div className={cn("w-8 h-8 rounded-md flex items-center justify-center text-white font-bold mr-3", app.color || "bg-gray-500")}>
                      {app.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{app.name}</p>
                        {isConnected && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <Check size={12} className="mr-1" />
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{app.description || "Connect this app to your workflow"}</p>
                    </div>
                  </div>
                  
                  {app.category && (
                    <Badge variant="outline" className="text-xs">
                      {app.category}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {filteredApps.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Search size={32} className="mx-auto" />
            </div>
            <p className="text-gray-500">No apps found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};