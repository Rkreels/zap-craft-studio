import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  RefreshCw,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { useSystemMonitoring } from '@/hooks/useRealTimeData';
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const generateChartData = () => {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    return {
      time: time.getHours() + ':00',
      executions: Math.floor(Math.random() * 50) + 10,
      success: Math.floor(Math.random() * 45) + 8,
      errors: Math.floor(Math.random() * 5) + 1,
      avgDuration: Math.floor(Math.random() * 2000) + 500,
    };
  });
};

interface WorkflowRun {
  id: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed';
  startTime: Date;
  duration?: number;
  steps: number;
  completedSteps: number;
}

export const RealTimeMonitoring: React.FC = () => {
  const { isOnline, metrics, health } = useSystemMonitoring();
  const [chartData, setChartData] = useState(generateChartData());
  const [activeRuns, setActiveRuns] = useState<WorkflowRun[]>([
    {
      id: 'run-1',
      workflowName: 'Gmail to Slack Notifications',
      status: 'running',
      startTime: new Date(Date.now() - 30000),
      steps: 3,
      completedSteps: 2
    },
    {
      id: 'run-2',
      workflowName: 'Form to Google Sheets',
      status: 'completed',
      startTime: new Date(Date.now() - 120000),
      duration: 1850,
      steps: 2,
      completedSteps: 2
    },
    {
      id: 'run-3',
      workflowName: 'Twitter to CRM',
      status: 'failed',
      startTime: new Date(Date.now() - 300000),
      duration: 5200,
      steps: 4,
      completedSteps: 3
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateChartData());
      
      // Update active runs
      setActiveRuns(prev => prev.map(run => {
        if (run.status === 'running') {
          const progress = Math.min(run.completedSteps + 0.1, run.steps);
          if (progress >= run.steps) {
            return {
              ...run,
              status: 'completed',
              duration: Date.now() - run.startTime.getTime(),
              completedSteps: run.steps
            };
          }
          return { ...run, completedSteps: progress };
        }
        return run;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <RefreshCw className="h-3 w-3 animate-spin" />;
      case 'completed': return <CheckCircle2 className="h-3 w-3" />;
      case 'failed': return <AlertTriangle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`rounded-lg p-4 border ${isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-medium">
              {isOnline ? 'All systems operational' : 'Connection issues detected'}
            </span>
            <Badge variant="outline" className="text-xs">
              Uptime: {(health as any)?.uptime || '99.9%'}
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeWorkflows}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRuns.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
            <Progress value={metrics.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(metrics.avgExecutionTime)}</div>
            <p className="text-xs text-muted-foreground">Per execution</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Active Runs */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="live-runs">Live Runs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Execution Trends</CardTitle>
                <CardDescription>Workflow executions over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="executions" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="success" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Analysis</CardTitle>
                <CardDescription>Errors and average duration by hour</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="errors" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="live-runs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Workflow Runs</CardTitle>
              <CardDescription>Real-time status of workflow executions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(run.status)}>
                        {getStatusIcon(run.status)}
                        <span className="ml-1 capitalize">{run.status}</span>
                      </Badge>
                      <div>
                        <p className="font-medium">{run.workflowName}</p>
                        <p className="text-sm text-muted-foreground">
                          Started {Math.floor((Date.now() - run.startTime.getTime()) / 1000)} seconds ago
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {run.status === 'running' && (
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={(run.completedSteps / run.steps) * 100} 
                            className="w-20" 
                          />
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(run.completedSteps)}/{run.steps}
                          </span>
                        </div>
                      )}
                      
                      {run.duration && (
                        <span className="text-sm text-muted-foreground">
                          {formatDuration(run.duration)}
                        </span>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                
                {activeRuns.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active workflow runs</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Average execution time trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgDuration" stroke="#ff7300" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>API Response Time</span>
                  <span className="text-green-600 font-medium">&lt; 100ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Database Connections</span>
                  <span className="text-green-600 font-medium">Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Queue Processing</span>
                  <span className="text-green-600 font-medium">Normal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Memory Usage</span>
                  <span className="text-yellow-600 font-medium">Moderate</span>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Health Check
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};