
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Users,
  Database,
  Code,
  Webhook,
  Calendar,
  BarChart3,
  Settings,
  Plus
} from "lucide-react";
import { AdvancedWorkflowFeatures } from "@/components/workflow/AdvancedWorkflowFeatures";
import { WorkflowExecutor } from "@/components/workflow/WorkflowExecutor";

export default function AdvancedDashboard() {
  const [activeWorkflows, setActiveWorkflows] = useState(12);
  const [totalExecutions, setTotalExecutions] = useState(1247);
  const [successRate, setSuccessRate] = useState(96.8);
  const [activeTab, setActiveTab] = useState("overview");

  const recentExecutions = [
    { id: 1, name: "New Lead → CRM", status: "success", time: "2 min ago", duration: "1.2s" },
    { id: 2, name: "Form Submit → Email", status: "success", time: "5 min ago", duration: "0.8s" },
    { id: 3, name: "Payment → Invoice", status: "failed", time: "8 min ago", duration: "2.1s" },
    { id: 4, name: "Support Ticket → Slack", status: "success", time: "12 min ago", duration: "1.5s" },
    { id: 5, name: "New Order → Fulfillment", status: "success", time: "15 min ago", duration: "0.9s" }
  ];

  const topWorkflows = [
    { name: "Lead Processing", executions: 324, success: 98.1 },
    { name: "Order Management", executions: 256, success: 96.5 },
    { name: "Customer Support", executions: 189, success: 94.7 },
    { name: "Marketing Automation", executions: 167, success: 97.2 },
    { name: "Data Sync", executions: 143, success: 95.8 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Automation Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and manage your automated workflows</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="executions">Executions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <Zap className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeWorkflows}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                <Activity className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalExecutions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{successRate}%</div>
                <p className="text-xs text-muted-foreground">+0.5% improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.3s</div>
                <p className="text-xs text-muted-foreground">-0.2s faster</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Executions</CardTitle>
                <CardDescription>Latest workflow runs across your automations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentExecutions.map((execution) => (
                    <div key={execution.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        {execution.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{execution.name}</div>
                          <div className="text-xs text-gray-500">{execution.time}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{execution.duration}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Workflows</CardTitle>
                <CardDescription>Most active workflows by execution count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topWorkflows.map((workflow, index) => (
                    <div key={index} className="flex items-center justify-between p-2">
                      <div>
                        <div className="font-medium text-sm">{workflow.name}</div>
                        <div className="text-xs text-gray-500">{workflow.executions} executions</div>
                      </div>
                      <Badge variant={workflow.success > 95 ? "default" : "secondary"}>
                        {workflow.success}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-16 flex flex-col gap-1">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">New Workflow</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Database className="w-5 h-5" />
                  <span className="text-sm">Data Storage</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <Webhook className="w-5 h-5" />
                  <span className="text-sm">Webhooks</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-1">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <AdvancedWorkflowFeatures workflowId="demo" />
        </TabsContent>

        <TabsContent value="executions" className="space-y-6">
          <WorkflowExecutor 
            workflowId="demo" 
            steps={[
              { id: '1', actionName: 'Trigger: Form Submission' },
              { id: '2', actionName: 'Filter: Valid Email' },
              { id: '3', actionName: 'Action: Add to CRM' },
              { id: '4', actionName: 'Action: Send Welcome Email' },
              { id: '5', actionName: 'Action: Post to Slack' }
            ]} 
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Execution Trends</CardTitle>
                <CardDescription>Workflow execution patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Charts and analytics coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Execution Time</span>
                    <span className="font-medium">1.3s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Peak Usage Hour</span>
                    <span className="font-medium">2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Most Used Integration</span>
                    <span className="font-medium">Gmail</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Error Rate</span>
                    <span className="font-medium text-red-600">3.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure your automation environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Execution Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Max concurrent executions</span>
                      <span className="font-medium">10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Default timeout</span>
                      <span className="font-medium">30s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Retry attempts</span>
                      <span className="font-medium">3</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Email notifications</span>
                      <span className="font-medium text-green-600">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Slack notifications</span>
                      <span className="font-medium text-gray-500">Disabled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Webhook alerts</span>
                      <span className="font-medium text-green-600">Enabled</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
