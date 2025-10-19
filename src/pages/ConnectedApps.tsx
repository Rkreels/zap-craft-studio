import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Settings, 
  Check, 
  AlertCircle, 
  Plus,
  RefreshCw,
  Unlink,
  Clock
} from "lucide-react";
import { useIntegrationData } from "@/hooks/useIntegrationData";
import { mockApps } from "@/data/mockApps";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ConnectedApps() {
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    integrations, 
    connectIntegration, 
    disconnectIntegration, 
    isConnecting, 
    isDisconnecting 
  } = useIntegrationData();

  const connectedApps = integrations.filter(integration => integration.status === 'connected');
  const disconnectedApps = integrations.filter(integration => integration.status === 'disconnected');
  const availableApps = mockApps.filter(app => 
    !integrations.find(integration => integration.id === app.id)
  );

  const filteredConnectedApps = connectedApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableApps = availableApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = async (appId: string) => {
    const app = mockApps.find(a => a.id === appId);
    if (!app) return;

    try {
      await connectIntegration(appId, {
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

  const handleDisconnect = async (appId: string) => {
    const app = integrations.find(a => a.id === appId);
    if (!app) return;

    try {
      await disconnectIntegration(appId);
      
      toast({
        title: "App Disconnected",
        description: `${app.name} has been disconnected.`,
      });
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: `Failed to disconnect ${app.name}.`,
        variant: "destructive",
      });
    }
  };

  const getAppIcon = (appId: string) => {
    const mockApp = mockApps.find(app => app.id === appId);
    return mockApp?.icon || appId.charAt(0).toUpperCase();
  };

  const getAppColor = (appId: string) => {
    const mockApp = mockApps.find(app => app.id === appId);
    return mockApp?.color || "bg-gray-500";
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Connected Apps</h1>
        <p className="text-gray-600">
          Manage your app connections and integrations in one place
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>
      </div>

      <Tabs defaultValue="connected" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connected" className="gap-2">
            <Check size={16} />
            Connected ({connectedApps.length})
          </TabsTrigger>
          <TabsTrigger value="available" className="gap-2">
            <Plus size={16} />
            Available ({availableApps.length})
          </TabsTrigger>
          <TabsTrigger value="disconnected" className="gap-2">
            <AlertCircle size={16} />
            Disconnected ({disconnectedApps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {filteredConnectedApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnectedApps.map((app) => (
                <Card key={app.id} className="border-green-200 bg-green-50/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold", getAppColor(app.id))}>
                          {getAppIcon(app.id)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{app.name}</CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <Check size={12} className="mr-1" />
                              Connected
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {app.lastSync && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Clock size={14} />
                        Last sync: {new Date(app.lastSync).toLocaleString()}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          toast({
                            title: "Settings",
                            description: `${app.name} settings will be available soon.`,
                          });
                        }}
                      >
                        <Settings size={14} className="mr-1" />
                        Settings
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(app.id)}
                        disabled={isDisconnecting}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Unlink size={14} className="mr-1" />
                        Disconnect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Check size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No connected apps</h3>
              <p className="text-gray-500 mb-4">Connect your first app to get started with automation</p>
              <Button onClick={() => {
                const availableTab = document.querySelector('[value="available"]') as HTMLElement;
                if (availableTab) {
                  availableTab.click();
                  toast({
                    title: "Switched to Available Apps",
                    description: "Browse and connect new apps",
                  });
                }
              }}>
                Browse Available Apps
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {filteredAvailableApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailableApps.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold", app.color || "bg-gray-500")}>
                        {app.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{app.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {app.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      {app.category && (
                        <Badge variant="outline" className="text-xs">
                          {app.category}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleConnect(app.id)}
                        disabled={isConnecting}
                        className="gap-1"
                      >
                        {isConnecting ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Plus size={14} />
                        )}
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Plus size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">All apps connected</h3>
              <p className="text-gray-500">You've connected all available apps!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="disconnected" className="space-y-4">
          {disconnectedApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {disconnectedApps.map((app) => (
                <Card key={app.id} className="border-orange-200 bg-orange-50/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold", getAppColor(app.id))}>
                          {getAppIcon(app.id)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{app.name}</CardTitle>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 mt-1">
                            <AlertCircle size={12} className="mr-1" />
                            Disconnected
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      size="sm"
                      onClick={() => handleConnect(app.id)}
                      disabled={isConnecting}
                      className="w-full gap-1"
                    >
                      {isConnecting ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <RefreshCw size={14} />
                      )}
                      Reconnect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <AlertCircle size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No disconnected apps</h3>
              <p className="text-gray-500">All your apps are working properly</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}