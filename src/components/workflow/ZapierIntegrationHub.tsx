import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZapierButton } from '@/components/ui/zapier-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Grid, Star, TrendingUp, Filter, Plus, Check } from 'lucide-react';
import { useIntegrationData } from '@/hooks/useIntegrationData';
import { LoadingState, EmptyState } from '@/components/ui/loading-state';

interface ZapierIntegrationHubProps {
  onAppSelect?: (app: any) => void;
}

const mockApps = [
  { id: "gmail", name: "Gmail", icon: "G", color: "bg-red-500", description: "Email by Google", category: "Email", rating: 4.8, connections: 2500000, verified: true },
  { id: "slack", name: "Slack", icon: "S", color: "bg-purple-500", description: "Team communication", category: "Communication", rating: 4.7, connections: 1800000, verified: true },
  { id: "sheets", name: "Google Sheets", icon: "Sh", color: "bg-green-600", description: "Online spreadsheets", category: "Productivity", rating: 4.6, connections: 2100000, verified: true },
  { id: "trello", name: "Trello", icon: "T", color: "bg-blue-500", description: "Project management", category: "Productivity", rating: 4.5, connections: 950000, verified: true },
  { id: "twitter", name: "Twitter", icon: "Tw", color: "bg-blue-400", description: "Social media platform", category: "Social Media", rating: 4.3, connections: 750000, verified: true },
  { id: "dropbox", name: "Dropbox", icon: "D", color: "bg-blue-600", description: "Cloud storage", category: "Storage", rating: 4.4, connections: 1200000, verified: true },
  { id: "mailchimp", name: "Mailchimp", icon: "M", color: "bg-yellow-500", description: "Email marketing", category: "Marketing", rating: 4.6, connections: 680000, verified: true },
  { id: "stripe", name: "Stripe", icon: "S", color: "bg-indigo-500", description: "Payment processing", category: "Finance", rating: 4.8, connections: 450000, verified: true },
  { id: "salesforce", name: "Salesforce", icon: "SF", color: "bg-blue-700", description: "CRM platform", category: "CRM", rating: 4.5, connections: 890000, verified: true },
  { id: "asana", name: "Asana", icon: "A", color: "bg-pink-500", description: "Task management", category: "Productivity", rating: 4.4, connections: 720000, verified: true },
  { id: "facebook", name: "Facebook", icon: "F", color: "bg-blue-600", description: "Social media", category: "Social Media", rating: 4.2, connections: 1100000, verified: true },
  { id: "hubspot", name: "HubSpot", icon: "H", color: "bg-orange-500", description: "Marketing CRM", category: "Marketing", rating: 4.7, connections: 340000, verified: true },
];

export function ZapierIntegrationHub({ onAppSelect }: ZapierIntegrationHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { integrations, isLoading, connectIntegration, isConnecting } = useIntegrationData();

  const categories = [
    { id: 'all', label: 'All Apps', count: mockApps.length },
    { id: 'featured', label: 'Featured', count: 8 },
    { id: 'popular', label: 'Popular', count: 12 },
    { id: 'Email', label: 'Email', count: mockApps.filter(a => a.category === 'Email').length },
    { id: 'Communication', label: 'Communication', count: mockApps.filter(a => a.category === 'Communication').length },
    { id: 'Productivity', label: 'Productivity', count: mockApps.filter(a => a.category === 'Productivity').length },
    { id: 'Marketing', label: 'Marketing', count: mockApps.filter(a => a.category === 'Marketing').length },
    { id: 'CRM', label: 'CRM', count: mockApps.filter(a => a.category === 'CRM').length },
  ];

  const getFilteredApps = () => {
    let filtered = mockApps;

    // Filter by category
    if (activeCategory === 'featured') {
      filtered = filtered.filter(a => a.verified && a.connections > 1000000);
    } else if (activeCategory === 'popular') {
      filtered = filtered.filter(a => a.connections > 500000);
    } else if (activeCategory !== 'all') {
      filtered = filtered.filter(a => a.category === activeCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredApps = getFilteredApps();
  const isConnected = (appId: string) => integrations.some((i: any) => i.service === appId);

  const handleConnect = async (app: any) => {
    if (isConnected(app.id)) return;
    
    try {
      await connectIntegration(app.id, { /* mock credentials */ });
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading integrations..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">App Directory</h2>
          <p className="text-muted-foreground">Connect your favorite apps and services</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex flex-col">
              <span className="text-xs">{category.label}</span>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {filteredApps.length === 0 ? (
            <EmptyState 
              title="No apps found"
              description={searchQuery ? "Try adjusting your search criteria" : "No apps available for this category"}
            />
          ) : (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {filteredApps.map((app) => {
                const connected = isConnected(app.id);
                
                return (
                  <Card key={app.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${app.color}`}>
                            {app.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {app.name}
                              </h3>
                              {app.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  <Check className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{app.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{(app.connections / 1000000).toFixed(1)}M+ connections</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-warning text-warning" />
                            <span>{app.rating}/5</span>
                          </div>
                        </div>

                        {/* Category */}
                        <Badge variant="outline" className="text-xs">
                          {app.category}
                        </Badge>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {connected ? (
                            <ZapierButton variant="outline" size="sm" className="flex-1" disabled>
                              <Check className="h-4 w-4" />
                              Connected
                            </ZapierButton>
                          ) : (
                            <ZapierButton
                              variant="zapier"
                              size="sm"
                              onClick={() => handleConnect(app)}
                              disabled={isConnecting}
                              className="flex-1"
                            >
                              <Plus className="h-4 w-4" />
                              {isConnecting ? 'Connecting...' : 'Connect'}
                            </ZapierButton>
                          )}
                          
                          {onAppSelect && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onAppSelect(app)}
                            >
                              Use
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}