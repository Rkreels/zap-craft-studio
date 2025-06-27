
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Code, 
  Database, 
  GitBranch, 
  Repeat, 
  Shield, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Timer,
  Cpu,
  Network
} from "lucide-react";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";

interface AdvancedFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: "available" | "beta" | "coming_soon";
  category: string;
}

const advancedFeatures: AdvancedFeature[] = [
  {
    id: "multi-step-unlimited",
    name: "Unlimited Workflow Steps",
    description: "Create workflows with unlimited steps and complex logic",
    icon: Zap,
    status: "available",
    category: "Core"
  },
  {
    id: "custom-code",
    name: "Custom Code Execution",
    description: "Run JavaScript/Python code within your workflows",
    icon: Code,
    status: "beta",
    category: "Advanced"
  },
  {
    id: "data-storage",
    name: "Workflow Data Storage",
    description: "Store and retrieve data between workflow runs",
    icon: Database,
    status: "available",
    category: "Data"
  },
  {
    id: "parallel-execution",
    name: "Parallel Path Execution",
    description: "Execute multiple workflow paths simultaneously",
    icon: GitBranch,
    status: "beta",
    category: "Advanced"
  },
  {
    id: "advanced-retry",
    name: "Smart Retry Logic",
    description: "Intelligent retry mechanisms with exponential backoff",
    icon: Repeat,
    status: "available",
    category: "Reliability"
  },
  {
    id: "advanced-auth",
    name: "Enterprise Authentication",
    description: "SAML, LDAP, and custom OAuth implementations",
    icon: Shield,
    status: "coming_soon",
    category: "Security"
  },
  {
    id: "cron-scheduling",
    name: "Advanced Scheduling",
    description: "Cron expressions and complex time-based triggers",
    icon: Clock,
    status: "available",
    category: "Scheduling"
  },
  {
    id: "error-recovery",
    name: "Automatic Error Recovery",
    description: "Self-healing workflows with intelligent error handling",
    icon: AlertTriangle,
    status: "beta",
    category: "Reliability"
  },
  {
    id: "performance-optimization",
    name: "Performance Optimization",
    description: "Automatic workflow optimization and caching",
    icon: Cpu,
    status: "available",
    category: "Performance"
  },
  {
    id: "multi-region",
    name: "Multi-Region Deployment",
    description: "Deploy workflows across multiple geographic regions",
    icon: Network,
    status: "coming_soon",
    category: "Infrastructure"
  }
];

export const AdvancedWorkflowFeatures: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [customCodeInput, setCustomCodeInput] = useState("");
  const [cronExpression, setCronExpression] = useState("");

  const voiceGuidanceProps = {
    elementName: "Advanced Workflow Features",
    hoverText: "Explore advanced workflow capabilities and enterprise features",
    clickText: "Configure advanced features for your automation workflows"
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(voiceGuidanceProps);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "beta": return "bg-yellow-100 text-yellow-800";
      case "coming_soon": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available": return "Available";
      case "beta": return "Beta";
      case "coming_soon": return "Coming Soon";
      default: return "Unknown";
    }
  };

  const categories = [...new Set(advancedFeatures.map(f => f.category))];

  return (
    <div className="space-y-6" onMouseEnter={handleMouseEnter} onClick={handleClick}>
      <Card>
        <CardHeader>
          <CardTitle>Advanced Workflow Features</CardTitle>
          <CardDescription>
            Enterprise-grade features for complex automation workflows
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="code-execution">Code Execution</TabsTrigger>
              <TabsTrigger value="scheduling">Advanced Scheduling</TabsTrigger>
              <TabsTrigger value="reliability">Reliability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {advancedFeatures
                      .filter(feature => feature.category === category)
                      .map(feature => (
                        <Card 
                          key={feature.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedFeature(feature.id)}
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <feature.icon className="h-5 w-5 text-purple-600" />
                              <Badge className={getStatusColor(feature.status)}>
                                {getStatusText(feature.status)}
                              </Badge>
                            </div>
                            <h4 className="font-medium mb-1">{feature.name}</h4>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                  <Separator />
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="code-execution" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5" />
                    <span>Custom Code Execution</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Beta</Badge>
                  </CardTitle>
                  <CardDescription>
                    Execute custom JavaScript or Python code within your workflows
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Custom Code (JavaScript)</Label>
                    <textarea
                      className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                      placeholder="// Enter your JavaScript code here
function processData(input) {
  // Transform your data
  return {
    processed: true,
    result: input.data.toUpperCase(),
    timestamp: new Date().toISOString()
  };
}

// Return the result
return processData(inputData);"
                      value={customCodeInput}
                      onChange={(e) => setCustomCodeInput(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Validate Code
                    </Button>
                    <Button>
                      <Zap className="h-4 w-4 mr-2" />
                      Test Execution
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h5 className="font-medium mb-2">Available Variables:</h5>
                    <ul className="text-sm space-y-1">
                      <li><code>inputData</code> - Data from previous step</li>
                      <li><code>meta</code> - Workflow metadata</li>
                      <li><code>env</code> - Environment variables</li>
                      <li><code>utils</code> - Utility functions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="scheduling" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Advanced Scheduling</span>
                  </CardTitle>
                  <CardDescription>
                    Configure complex time-based triggers with cron expressions
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Cron Expression</Label>
                    <Input
                      placeholder="0 9 * * MON-FRI"
                      value={cronExpression}
                      onChange={(e) => setCronExpression(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      Example: "0 9 * * MON-FRI" runs at 9 AM on weekdays
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Common Patterns</Label>
                      <div className="space-y-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          onClick={() => setCronExpression("0 9 * * *")}
                        >
                          Daily at 9 AM
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          onClick={() => setCronExpression("0 9 * * MON")}
                        >
                          Monday at 9 AM
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          onClick={() => setCronExpression("0 */2 * * *")}
                        >
                          Every 2 hours
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Next Executions</Label>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <div className="space-y-1">
                          <div>Next: Today at 9:00 AM</div>
                          <div>Then: Tomorrow at 9:00 AM</div>
                          <div>Then: Day after at 9:00 AM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button>
                    <Timer className="h-4 w-4 mr-2" />
                    Apply Schedule
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reliability" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Repeat className="h-5 w-5" />
                      <span>Smart Retry Logic</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Retry Attempts</Label>
                      <Input type="number" defaultValue="3" min="1" max="10" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Backoff Strategy</Label>
                      <select className="w-full p-2 border rounded">
                        <option value="exponential">Exponential Backoff</option>
                        <option value="linear">Linear Backoff</option>
                        <option value="fixed">Fixed Delay</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Initial Delay (seconds)</Label>
                      <Input type="number" defaultValue="1" min="1" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Error Recovery</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Error Handling Strategy</Label>
                      <select className="w-full p-2 border rounded">
                        <option value="stop">Stop on Error</option>
                        <option value="continue">Continue on Error</option>
                        <option value="retry">Retry on Error</option>
                        <option value="skip">Skip Failed Steps</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Error Notification</Label>
                      <div className="space-y-1">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Email notifications</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Slack notifications</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Webhook alerts</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
