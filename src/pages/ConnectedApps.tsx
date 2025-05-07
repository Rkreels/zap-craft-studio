
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, RefreshCw, ExternalLink, MoreVertical, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock connected apps data
const connectedApps = [
  {
    id: "gmail",
    name: "Gmail",
    icon: "G",
    status: "connected",
    accountName: "john.doe@gmail.com",
    lastUsed: "2 days ago"
  },
  {
    id: "slack",
    name: "Slack",
    icon: "S",
    status: "connected",
    accountName: "Acme Inc",
    lastUsed: "1 hour ago"
  },
  {
    id: "sheets",
    name: "Google Sheets",
    icon: "GS",
    status: "connected",
    accountName: "john.doe@gmail.com",
    lastUsed: "5 days ago"
  },
  {
    id: "trello",
    name: "Trello",
    icon: "T",
    status: "error",
    accountName: "John Doe",
    lastUsed: "1 month ago",
    errorMessage: "Authentication token expired"
  }
];

// Popular apps for the "Add Connection" section
const popularApps = [
  { id: "drive", name: "Google Drive", icon: "GD" },
  { id: "dropbox", name: "Dropbox", icon: "D" },
  { id: "notion", name: "Notion", icon: "N" },
  { id: "mailchimp", name: "Mailchimp", icon: "M" },
  { id: "airtable", name: "Airtable", icon: "A" },
  { id: "asana", name: "Asana", icon: "As" }
];

export default function ConnectedApps() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddApps, setShowAddApps] = useState(false);

  const filteredApps = connectedApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.accountName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReconnect = (appId) => {
    toast({
      title: "Reconnecting...",
      description: "You'll be redirected to authenticate with this service.",
    });
    // In a real app, this would redirect to OAuth flow
  };

  const handleRemoveConnection = (appId) => {
    const confirmRemove = confirm("Are you sure you want to remove this connection?");
    if (confirmRemove) {
      toast({
        title: "Connection removed",
        description: "The connection has been successfully removed.",
        variant: "default",
      });
      // In a real app, we'd remove from the database
    }
  };

  const handleConnect = (appId) => {
    toast({
      title: "Connecting to " + appId,
      description: "You'll be redirected to authorize this connection.",
    });
    // In a real app, this would redirect to OAuth flow
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Connected Apps</h1>
        <p className="text-gray-600">Manage your app connections and authentication</p>
      </div>

      {/* Connected apps section */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Connections</CardTitle>
            <CardDescription>Apps and services you've connected to your account</CardDescription>
          </div>
          <Button onClick={() => setShowAddApps(!showAddApps)} className="gap-1">
            <Plus size={16} />
            Add Connection
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search connections..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredApps.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No connected apps match your search.</p>
            ) : (
              filteredApps.map(app => (
                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-sm uppercase font-bold">
                      {app.icon}
                    </div>
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        {app.status === "connected" ? (
                          <>
                            <Check size={14} className="text-green-500 mr-1" />
                            <span>{app.accountName} • Last used {app.lastUsed}</span>
                          </>
                        ) : (
                          <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                            Connection error
                          </Badge>
                        )}
                      </div>
                      {app.errorMessage && (
                        <p className="text-xs text-red-500 mt-1">{app.errorMessage}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {app.status === "error" && (
                      <Button size="sm" variant="outline" onClick={() => handleReconnect(app.id)}>
                        <RefreshCw size={14} className="mr-1" />
                        Reconnect
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleReconnect(app.id)}>
                          <RefreshCw size={14} className="mr-2" /> Reconnect
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open("https://example.com", "_blank")}>
                          <ExternalLink size={14} className="mr-2" /> View app details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleRemoveConnection(app.id)}
                          className="text-red-600"
                        >
                          Remove connection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add connection section */}
      {showAddApps && (
        <Card>
          <CardHeader>
            <CardTitle>Add a new connection</CardTitle>
            <CardDescription>Connect your accounts to use in your Zaps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {popularApps.map(app => (
                <div 
                  key={app.id}
                  className="border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleConnect(app.id)}
                >
                  <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-sm uppercase font-bold">
                    {app.icon}
                  </div>
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-xs text-gray-500">Connect your account</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="mt-4 w-full" variant="outline">
              Browse all apps
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
