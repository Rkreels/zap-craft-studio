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
  Clock,
  Zap,
  Activity
} from "lucide-react";
import { useIntegrationData } from "@/hooks/useIntegrationData";
import { mockApps } from "@/data/mockApps";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ConnectedApps() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("connected");
  const {
    integrations,
    connectIntegration,
    disconnectIntegration,
    isConnecting,
    isDisconnecting
  } = useIntegrationData();

  const connectedApps = integrations.filter(i => i.status === "connected");
  const disconnectedApps = integrations.filter(i => i.status === "disconnected");
  const availableApps = mockApps.filter(app => !integrations.find(i => i.id === app.id));

  const filteredConnected = connectedApps.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAvailable = availableApps.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDisconnected = disconnectedApps.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleConnect = async (appId: string) => {
    const app = mockApps.find(a => a.id === appId);
    if (!app) return;
    try {
      await connectIntegration(appId, { name: app.name, type: app.category?.toLowerCase() || "utility" });
      toast({ title: "App Connected", description: `${app.name} connected successfully.` });
    } catch {
      toast({ title: "Connection Failed", description: `Failed to connect ${app.name}.`, variant: "destructive" });
    }
  };

  const handleDisconnect = async (appId: string) => {
    const app = integrations.find(a => a.id === appId);
    if (!app) return;
    try {
      await disconnectIntegration(appId);
      toast({ title: "App Disconnected", description: `${app.name} disconnected.` });
    } catch {
      toast({ title: "Disconnection Failed", description: `Failed to disconnect ${app.name}.`, variant: "destructive" });
    }
  };

  const handleSettings = (appName: string) => {
    toast({ title: `${appName} Settings`, description: "Connection settings panel opening…" });
  };

  const getAppIcon = (appId: string) => mockApps.find(a => a.id === appId)?.icon || appId.charAt(0).toUpperCase();
  const getAppColor = (appId: string) => mockApps.find(a => a.id === appId)?.color || "bg-muted";

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Connected Apps</h1>
        <p className="text-muted-foreground">Manage your app integrations and connections in one place</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Connected", value: connectedApps.length, icon: Check, color: "text-emerald-600" },
          { label: "Available", value: availableApps.length, icon: Plus, color: "text-primary" },
          { label: "Disconnected", value: disconnectedApps.length, icon: AlertCircle, color: "text-sky-600" },
          { label: "Total Zaps Running", value: connectedApps.length * 3, icon: Zap, color: "text-secondary" },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon size={22} className={stat.color} />
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Search apps…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="connected" className="gap-2">
            <Check size={15} /> Connected ({connectedApps.length})
          </TabsTrigger>
          <TabsTrigger value="available" className="gap-2">
            <Plus size={15} /> Available ({availableApps.length})
          </TabsTrigger>
          <TabsTrigger value="disconnected" className="gap-2">
            <AlertCircle size={15} /> Disconnected ({disconnectedApps.length})
          </TabsTrigger>
        </TabsList>

        {/* CONNECTED */}
        <TabsContent value="connected" className="mt-6">
          {filteredConnected.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnected.map(app => (
                <Card key={app.id} className="border-emerald-200 bg-emerald-50/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm", getAppColor(app.id))}>
                        {getAppIcon(app.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-semibold">{app.name}</CardTitle>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 mt-1 text-xs">
                          <Check size={10} className="mr-1" /> Connected
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {app.lastSync && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock size={12} /> Last sync: {new Date(app.lastSync).toLocaleString()}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Activity size={12} /> Active workflows: {(app.id.charCodeAt(0) % 8) + 1}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleSettings(app.name)}>
                        <Settings size={12} className="mr-1" /> Settings
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive text-xs"
                        onClick={() => handleDisconnect(app.id)} disabled={isDisconnecting}>
                        <Unlink size={12} className="mr-1" /> Disconnect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-xl bg-muted/20">
              <Check size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
              <h3 className="font-semibold text-foreground mb-1">No connected apps yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Connect your first app to start automating workflows</p>
              <Button onClick={() => setActiveTab("available")}>Browse Available Apps</Button>
            </div>
          )}
        </TabsContent>

        {/* AVAILABLE */}
        <TabsContent value="available" className="mt-6">
          {filteredAvailable.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailable.map(app => (
                <Card key={app.id} className="hover:shadow-md transition-shadow border hover:border-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm", app.color || "bg-muted")}>
                        {app.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-semibold">{app.name}</CardTitle>
                        <CardDescription className="text-xs line-clamp-1">{app.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      {app.category && <Badge variant="outline" className="text-xs">{app.category}</Badge>}
                      <Button size="sm" onClick={() => handleConnect(app.id)} disabled={isConnecting} className="gap-1 ml-auto">
                        {isConnecting ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={12} />}
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-xl bg-muted/20">
              <Plus size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
              <h3 className="font-semibold text-foreground mb-1">All apps connected!</h3>
              <p className="text-muted-foreground text-sm">You've connected all available apps.</p>
            </div>
          )}
        </TabsContent>

        {/* DISCONNECTED */}
        <TabsContent value="disconnected" className="mt-6">
          {filteredDisconnected.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDisconnected.map(app => (
                <Card key={app.id} className="border-sky-200 bg-sky-50/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm", getAppColor(app.id))}>
                        {getAppIcon(app.id)}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">{app.name}</CardTitle>
                        <Badge variant="secondary" className="bg-sky-100 text-sky-700 mt-1 text-xs">
                          <AlertCircle size={10} className="mr-1" /> Disconnected
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button size="sm" className="w-full gap-1" onClick={() => handleConnect(app.id)} disabled={isConnecting}>
                      {isConnecting ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                      Reconnect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-xl bg-muted/20">
              <AlertCircle size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
              <h3 className="font-semibold text-foreground mb-1">No disconnected apps</h3>
              <p className="text-muted-foreground text-sm">All your connected apps are working properly.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
