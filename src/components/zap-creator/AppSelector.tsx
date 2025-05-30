
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  color?: string;
  popular?: boolean;
  category?: string;
}

interface AppSelectorProps {
  selectedApp: AppItem | null;
  onSelectApp: (app: AppItem) => void;
  availableApps: AppItem[];
  className?: string;
}

export const AppSelector: React.FC<AppSelectorProps> = ({
  selectedApp,
  onSelectApp,
  availableApps,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const filteredApps = availableApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (selectedApp) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={cn("w-12 h-12 rounded-md flex items-center justify-center text-white font-bold mr-3", selectedApp.color || "bg-gray-100")}>
                {selectedApp.icon}
              </div>
              <div>
                <h3 className="font-semibold">{selectedApp.name}</h3>
                <p className="text-sm text-gray-500">{selectedApp.description}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => onSelectApp(null as any)}>
              Change
            </Button>
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
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search apps..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
