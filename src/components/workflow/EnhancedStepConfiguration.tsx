import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZapierButton } from '@/components/ui/zapier-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Settings, TestTube, ChevronRight, Zap, Database, Filter, Code, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WorkflowStepData } from './WorkflowStep';
import { AppItem } from '@/components/zap-creator/AppSelector';
import { TriggerEvent } from '@/components/zap-creator/EventSelector';

interface EnhancedStepConfigurationProps {
  step: WorkflowStepData;
  onUpdate: (updatedStep: WorkflowStepData) => void;
  onTest?: () => void;
  apps: AppItem[];
  events: TriggerEvent[];
}

export function EnhancedStepConfiguration({
  step,
  onUpdate,
  onTest,
  apps,
  events
}: EnhancedStepConfigurationProps) {
  const [activeTab, setActiveTab] = useState('app');
  const [testData, setTestData] = useState('');
  const [isConfigured, setIsConfigured] = useState(step.configured);

  const selectedApp = apps.find(app => app.id === step.appId);
  const selectedEvent = events.find(event => event.id === step.eventId);

  const handleAppChange = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if (app) {
      onUpdate({
        ...step,
        appId: app.id,
        appName: app.name,
        eventId: '',
        actionName: 'Choose an event',
        configured: false
      });
      setActiveTab('event');
    }
  };

  const handleEventChange = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      onUpdate({
        ...step,
        eventId: event.id,
        actionName: event.name,
        configured: true
      });
      setIsConfigured(true);
      setActiveTab('configure');
    }
  };

  const updateStepConfig = (key: string, value: any) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        [key]: value
      }
    });
  };

  if (!selectedApp) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {step.type === 'trigger' ? 'Choose Trigger App' : 'Choose Action App'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app) => (
              <div
                key={app.id}
                onClick={() => handleAppChange(app.id)}
                className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${app.color}`}
                  >
                    {app.icon}
                  </div>
                  <div>
                    <h3 className="font-medium group-hover:text-primary">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">{app.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${selectedApp.color}`}>
                {selectedApp.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{selectedApp.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent ? selectedEvent.name : 'Configure this step'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConfigured && (
                <Badge variant="default" className="bg-success">
                  <div className="w-2 h-2 rounded-full bg-white mr-1" />
                  Configured
                </Badge>
              )}
              {onTest && (
                <ZapierButton variant="outline" size="sm" onClick={onTest}>
                  <TestTube className="h-4 w-4" />
                  Test
                </ZapierButton>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="app" disabled={!selectedApp}>
            App
          </TabsTrigger>
          <TabsTrigger value="event" disabled={!selectedApp}>
            Event
          </TabsTrigger>
          <TabsTrigger value="configure" disabled={!selectedEvent}>
            Configure
          </TabsTrigger>
          <TabsTrigger value="test" disabled={!isConfigured}>
            Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="app" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold ${selectedApp.color}`}>
                  {selectedApp.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{selectedApp.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedApp.description}</p>
                </div>
                <Button variant="outline" onClick={() => handleAppChange('')}>
                  Change App
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="event" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Choose {step.type === 'trigger' ? 'Trigger' : 'Action'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventChange(event.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedEvent?.id === event.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configure {selectedEvent?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Connection */}
              <div className="space-y-3">
                <Label>Account</Label>
                <Select value={step.config?.accountId || ''} onValueChange={(value) => updateStepConfig('accountId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account-1">john@example.com</SelectItem>
                    <SelectItem value="account-2">team@company.com</SelectItem>
                    <SelectItem value="new">+ Connect new account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Fields based on event type */}
              {selectedEvent?.id === 'new-email' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>From Email</Label>
                    <Input 
                      placeholder="sender@example.com"
                      value={step.config?.fromEmail || ''}
                      onChange={(e) => updateStepConfig('fromEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject Contains</Label>
                    <Input 
                      placeholder="Optional filter"
                      value={step.config?.subjectFilter || ''}
                      onChange={(e) => updateStepConfig('subjectFilter', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {selectedEvent?.id === 'send-email' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Input 
                      placeholder="recipient@example.com"
                      value={step.config?.toEmail || ''}
                      onChange={(e) => updateStepConfig('toEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input 
                      placeholder="Email subject"
                      value={step.config?.subject || ''}
                      onChange={(e) => updateStepConfig('subject', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Body</Label>
                    <Textarea 
                      placeholder="Email content"
                      value={step.config?.body || ''}
                      onChange={(e) => updateStepConfig('body', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Advanced Options */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Advanced Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Skip if error</Label>
                      <p className="text-sm text-muted-foreground">Continue workflow even if this step fails</p>
                    </div>
                    <Switch 
                      checked={step.config?.skipOnError || false}
                      onCheckedChange={(checked) => updateStepConfig('skipOnError', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Delay after step (seconds)</Label>
                    <Input 
                      type="number"
                      placeholder="0"
                      value={step.config?.delay || ''}
                      onChange={(e) => updateStepConfig('delay', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Test {selectedEvent?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  We'll run this step with sample data to make sure it's working correctly.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Sample Data (JSON)</Label>
                <Textarea 
                  placeholder='{"name": "John Doe", "email": "john@example.com"}'
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                  rows={4}
                />
              </div>

              <ZapierButton onClick={onTest} className="w-full">
                <TestTube className="h-4 w-4" />
                Run Test
              </ZapierButton>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}