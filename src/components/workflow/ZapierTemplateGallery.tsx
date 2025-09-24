import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZapierButton } from '@/components/ui/zapier-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Star, Zap, TrendingUp, Clock, Filter } from 'lucide-react';
import { useTemplateManager, WorkflowTemplate } from '@/hooks/useTemplateManager';
import { LoadingState, EmptyState } from '@/components/ui/loading-state';

interface ZapierTemplateGalleryProps {
  onTemplateSelect: (template: WorkflowTemplate) => void;
}

const fallbackTemplates: WorkflowTemplate[] = [
  {
    id: 'gmail-slack',
    name: 'Gmail to Slack',
    description: 'Send Slack messages for new Gmail emails',
    category: 'Communication',
    tags: ['gmail', 'slack', 'email', 'notifications'],
    featured: true,
    popular: true,
    new: false,
    usageCount: 15420,
    rating: 4.8,
    steps: [
      {
        id: 'trigger-gmail',
        type: 'trigger',
        appId: 'gmail',
        appName: 'Gmail',
        actionName: 'New Email',
        eventId: 'new-email',
        configured: true,
        config: {}
      },
      {
        id: 'action-slack',
        type: 'action',
        appId: 'slack',
        appName: 'Slack',
        actionName: 'Send Channel Message',
        eventId: 'send-message',
        configured: true,
        config: {}
      }
    ]
  },
  {
    id: 'sheets-hubspot',
    name: 'Google Sheets to HubSpot',
    description: 'Create HubSpot contacts from new Google Sheets rows',
    category: 'CRM',
    tags: ['sheets', 'hubspot', 'contacts', 'lead-generation'],
    featured: true,
    popular: true,
    new: false,
    usageCount: 12350,
    rating: 4.7,
    steps: [
      {
        id: 'trigger-sheets',
        type: 'trigger',
        appId: 'sheets',
        appName: 'Google Sheets',
        actionName: 'New Spreadsheet Row',
        eventId: 'new-row',
        configured: true,
        config: {}
      },
      {
        id: 'action-hubspot',
        type: 'action',
        appId: 'hubspot',
        appName: 'HubSpot',
        actionName: 'Create Contact',
        eventId: 'create-contact',
        configured: true,
        config: {}
      }
    ]
  },
  {
    id: 'trello-gmail',
    name: 'Trello to Gmail',
    description: 'Send Gmail emails when Trello cards are updated',
    category: 'Productivity',
    tags: ['trello', 'gmail', 'project-management', 'notifications'],
    featured: false,
    popular: true,
    new: false,
    usageCount: 8900,
    rating: 4.6,
    steps: [
      {
        id: 'trigger-trello',
        type: 'trigger',
        appId: 'trello',
        appName: 'Trello',
        actionName: 'Card Updated',
        eventId: 'card-updated',
        configured: true,
        config: {}
      },
      {
        id: 'action-gmail',
        type: 'action',
        appId: 'gmail',
        appName: 'Gmail',
        actionName: 'Send Email',
        eventId: 'send-email',
        configured: true,
        config: {}
      }
    ]
  },
  {
    id: 'mailchimp-slack',
    name: 'Mailchimp to Slack',
    description: 'Notify Slack when new Mailchimp subscribers join',
    category: 'Marketing',
    tags: ['mailchimp', 'slack', 'email-marketing', 'subscribers'],
    featured: false,
    popular: false,
    new: true,
    usageCount: 1200,
    rating: 4.9,
    steps: [
      {
        id: 'trigger-mailchimp',
        type: 'trigger',
        appId: 'mailchimp',
        appName: 'Mailchimp',
        actionName: 'New Subscriber',
        eventId: 'new-subscriber',
        configured: true,
        config: {}
      },
      {
        id: 'action-slack',
        type: 'action',
        appId: 'slack',
        appName: 'Slack',
        actionName: 'Send Channel Message',
        eventId: 'send-message',
        configured: true,
        config: {}
      }
    ]
  }
];

export function ZapierTemplateGallery({ onTemplateSelect }: ZapierTemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { templates, isLoading, error } = useTemplateManager();

  const allTemplates = templates.length > 0 ? templates : fallbackTemplates;

  const categories = [
    { id: 'all', label: 'All Templates', icon: Filter },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'popular', label: 'Popular', icon: TrendingUp },
    { id: 'new', label: 'New', icon: Clock },
    { id: 'Communication', label: 'Communication', icon: Zap },
    { id: 'CRM', label: 'CRM', icon: Zap },
    { id: 'Productivity', label: 'Productivity', icon: Zap },
    { id: 'Marketing', label: 'Marketing', icon: Zap },
  ];

  const getFilteredTemplates = () => {
    let filtered = allTemplates;

    // Filter by category
    if (activeCategory === 'featured') {
      filtered = filtered.filter(t => t.featured);
    } else if (activeCategory === 'popular') {
      filtered = filtered.filter(t => t.popular);
    } else if (activeCategory === 'new') {
      filtered = filtered.filter(t => t.new);
    } else if (activeCategory !== 'all') {
      filtered = filtered.filter(t => t.category === activeCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();

  if (isLoading) {
    return <LoadingState message="Loading templates..." />;
  }

  if (error) {
    return (
      <EmptyState 
        title="Failed to load templates"
        description="There was an error loading the template gallery. Please try again."
        action={<Button onClick={() => window.location.reload()}>Retry</Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Template Gallery</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {filteredTemplates.length === 0 ? (
            <EmptyState 
              title="No templates found"
              description={searchQuery ? "Try adjusting your search criteria" : "No templates available for this category"}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {template.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                      {template.featured && (
                        <Badge variant="default" className="bg-warning text-warning-foreground">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Template Apps */}
                    <div className="flex items-center gap-2">
                      {template.steps?.slice(0, 3).map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {step.appName?.[0] || 'A'}
                            </span>
                          </div>
                          {index < 2 && (
                            <div className="w-4 h-0.5 bg-gradient-to-r from-primary to-secondary mx-1" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{template.usageCount?.toLocaleString()} uses</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span>{template.rating}/5</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {template.tags && (
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <ZapierButton
                        variant="zapier"
                        size="sm"
                        onClick={() => onTemplateSelect(template)}
                        className="flex-1"
                      >
                        <Zap className="h-4 w-4" />
                        Use this Zap
                      </ZapierButton>
                      
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
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