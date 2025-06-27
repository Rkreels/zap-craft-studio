
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  GitBranch, 
  Timer, 
  Code, 
  Database, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Zap
} from "lucide-react";

interface AdvancedWorkflowFeaturesProps {
  workflowId: string;
  onUpdate?: (features: any) => void;
}

export const AdvancedWorkflowFeatures: React.FC<AdvancedWorkflowFeaturesProps> = ({ 
  workflowId, 
  onUpdate 
}) => {
  const [features, setFeatures] = useState({
    filters: [],
    paths: [],
    schedules: [],
    customCode: '',
    storage: {},
    errorHandling: {
      retries: 3,
      timeout: 30,
      fallback: null
    },
    monitoring: {
      alerts: true,
      logging: true,
      analytics: true
    }
  });

  const [activeTab, setActiveTab] = useState("filters");

  const addFilter = () => {
    const newFilter = {
      id: Date.now(),
      field: '',
      operator: 'equals',
      value: '',
      enabled: true
    };
    setFeatures(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }));
  };

  const addPath = () => {
    const newPath = {
      id: Date.now(),
      name: 'New Path',
      condition: '',
      actions: [],
      enabled: true
    };
    setFeatures(prev => ({
      ...prev,
      paths: [...prev.paths, newPath]
    }));
  };

  const addSchedule = () => {
    const newSchedule = {
      id: Date.now(),
      type: 'interval',
      value: '5',
      unit: 'minutes',
      enabled: true
    };
    setFeatures(prev => ({
      ...prev,
      schedules: [...prev.schedules, newSchedule]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Workflow Features</h2>
          <p className="text-gray-600">Configure advanced automation capabilities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Test Workflow
          </Button>
          <Button size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Activate
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="paths">Paths</TabsTrigger>
          <TabsTrigger value="schedules">Schedule</TabsTrigger>
          <TabsTrigger value="code">Custom Code</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Conditions
              </CardTitle>
              <CardDescription>
                Only run actions when data meets specific conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.filters.map((filter: any, index) => (
                <div key={filter.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <Input placeholder="Field name" className="flex-1" />
                  <select className="px-3 py-2 border rounded">
                    <option>equals</option>
                    <option>contains</option>
                    <option>greater than</option>
                    <option>less than</option>
                    <option>is empty</option>
                    <option>is not empty</option>
                  </select>
                  <Input placeholder="Value" className="flex-1" />
                  <Switch />
                  <Button variant="ghost" size="sm">×</Button>
                </div>
              ))}
              <Button onClick={addFilter} variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Add Filter
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paths" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Conditional Paths
              </CardTitle>
              <CardDescription>
                Create different workflows based on conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.paths.map((path: any) => (
                <div key={path.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Input placeholder="Path name" defaultValue={path.name} />
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">3 actions</Badge>
                      <Switch />
                      <Button variant="ghost" size="sm">×</Button>
                    </div>
                  </div>
                  <Input placeholder="Condition (e.g., status equals 'active')" />
                  <div className="text-sm text-gray-500">
                    Actions: Send email → Update database → Post to Slack
                  </div>
                </div>
              ))}
              <Button onClick={addPath} variant="outline" className="w-full">
                <GitBranch className="w-4 h-4 mr-2" />
                Add Path
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Schedule & Triggers
              </CardTitle>
              <CardDescription>
                Run workflows on a schedule or based on time conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.schedules.map((schedule: any) => (
                <div key={schedule.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <select className="px-3 py-2 border rounded">
                    <option>Every</option>
                    <option>Daily at</option>
                    <option>Weekly on</option>
                    <option>Monthly on</option>
                    <option>Cron expression</option>
                  </select>
                  <Input placeholder="5" className="w-20" />
                  <select className="px-3 py-2 border rounded">
                    <option>minutes</option>
                    <option>hours</option>
                    <option>days</option>
                  </select>
                  <Switch />
                  <Button variant="ghost" size="sm">×</Button>
                </div>
              ))}
              <Button onClick={addSchedule} variant="outline" className="w-full">
                <Timer className="w-4 h-4 mr-2" />
                Add Schedule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Custom Code
              </CardTitle>
              <CardDescription>
                Add custom JavaScript or Python code to your workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Code Language</Label>
                <select className="w-full px-3 py-2 border rounded">
                  <option>JavaScript</option>
                  <option>Python</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Custom Code</Label>
                <textarea 
                  className="w-full h-48 p-3 border rounded font-mono text-sm"
                  placeholder="// Your custom code here
function transform(inputData) {
  // Process the data
  return {
    ...inputData,
    processed: true,
    timestamp: new Date().toISOString()
  };
}"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Test Code</Button>
                <Button size="sm">Save Code</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Storage
              </CardTitle>
              <CardDescription>
                Store and retrieve data between workflow runs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Store Value</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input placeholder="Key name" />
                    <Input placeholder="Value" />
                    <Button size="sm" className="w-full">Store</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Retrieve Value</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input placeholder="Key name" />
                    <Button size="sm" className="w-full">Retrieve</Button>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-2">
                <Label>Stored Values</Label>
                <div className="space-y-1">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">user_count</span>
                    <span className="text-sm text-gray-600">1,234</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">last_sync</span>
                    <span className="text-sm text-gray-600">2024-01-15</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Monitoring & Error Handling
              </CardTitle>
              <CardDescription>
                Configure alerts, retries, and error handling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Error Handling</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Retries</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <Label>Timeout (seconds)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Fallback Action</Label>
                  <select className="w-full px-3 py-2 border rounded">
                    <option>None</option>
                    <option>Send notification</option>
                    <option>Run alternate workflow</option>
                    <option>Stop workflow</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Monitoring</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Email alerts on failure</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Detailed logging</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Performance analytics</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Webhook notifications</span>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notification Email</Label>
                <Input type="email" placeholder="admin@company.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
