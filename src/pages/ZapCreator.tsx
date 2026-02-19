import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast"; // Notice updated path for toast
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnhancedZapHeader } from "@/components/workflow/EnhancedZapHeader";
import { ZapierWorkflowSteps } from "@/components/workflow/ZapierWorkflowSteps";
import { ZapierTemplateGallery } from "@/components/workflow/ZapierTemplateGallery";
import { WorkflowStepData } from "@/components/workflow/WorkflowStep";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { zapCreatorScripts } from "@/data/voiceScripts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormulaEditor } from "@/components/data-transformation/FormulaEditor";
import { ScheduleConfig } from "@/components/workflow/ScheduleBuilder";
import VersionHistoryDialog from "@/components/interfaces/VersionHistoryDialog";
import { WebhookIntegration, WebhookConfig } from "@/components/workflow/WebhookIntegration";
import { DataTransformer, DataTransformConfig } from "@/components/workflow/DataTransformer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TemplateGallery } from "@/components/workflow/TemplateGallery";
import { EnhancedTemplateLoader } from "@/components/workflow/EnhancedTemplateLoader";
import { WorkflowSaveManager } from "@/components/workflow/WorkflowSaveManager";
import { TeamCollaboration } from "@/components/workflow/TeamCollaboration";
import { ConditionalLogic } from "@/components/workflow/ConditionalLogic";
import { PathBranching, BranchPath } from "@/components/workflow/PathBranching";
import { ZapierIntegrationHub } from "@/components/workflow/ZapierIntegrationHub";
import { IntegrationDirectory } from "@/components/workflow/IntegrationDirectory";
import { AccountConnection, ConnectedAccount } from "@/components/workflow/AccountConnection";
import { AdvancedWebhook } from "@/components/workflow/AdvancedWebhook";
import { 
  AlertCircle, 
  Play, 
  Code, 
  Activity, 
  FileText, 
  Users, 
  Settings,
  Zap,
  Grid,
  Webhook,
  GitBranch,
  Key,
  Network
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWorkflowExecution } from "@/hooks/useWorkflowExecution";
import { WorkflowExecutor } from "@/components/workflow/WorkflowExecutor";
import { useTemplateManager } from "@/hooks/useTemplateManager";

// Define the ZapHeaderProps type to fix TypeScript error
interface ZapHeaderProps {
  zapName: string;
  setZapName: React.Dispatch<React.SetStateAction<string>>;
  isActive: boolean;
  toggleActivation: () => void;
  handleSave: (showToast?: boolean) => void;
  handleTest: () => void;
  handleDelete: () => void;
  lastSaved: Date | null;
  isLoading: boolean;
  onViewVersionHistory: () => void;
}

export default function ZapCreator() {
  const [zapName, setZapName] = useState("Untitled Zap");
  const [steps, setSteps] = useState<WorkflowStepData[]>([]);
  const [schedule, setSchedule] = useState<ScheduleConfig>();
  const [isActive, setIsActive] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("build");
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [testOutput, setTestOutput] = useState("");
  const [monitoringData, setMonitoringData] = useState({
    runs: 0,
    successful: 0,
    failed: 0,
    lastRun: null as Date | null,
    avgRunTime: 0
  });
  const [paths, setPaths] = useState<BranchPath[]>([]);
  const [activePathId, setActivePathId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Record<string, ConnectedAccount[]>>({
    gmail: [],
    slack: [],
    trello: [],
    sheets: []
  });

  // Voice guidance for workflow builder
  const workflowVoiceProps = {
    elementName: "Workflow Builder",
    hoverText: zapCreatorScripts.workflowBuilder.hover,
    clickText: zapCreatorScripts.workflowBuilder.click
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(workflowVoiceProps);
  const isMobile = useIsMobile();
  const templateManager = useTemplateManager();

  // Add the workflow execution hook
  const { executeWorkflow } = useWorkflowExecution();

  // Auto-save functionality
  useEffect(() => {
    if (steps.length > 0) {
      const timer = setTimeout(() => {
        handleSave(false);
      }, 30000); // Auto-save every 30 seconds
      return () => clearTimeout(timer);
    }
  }, [steps]);

  const handleSave = (showToast = true) => {
    setIsLoading(true);
    // In a real app, we would save this to a database
    console.log("Saving workflow:", steps);
    console.log("With schedule:", schedule);
    setTimeout(() => {
      setLastSaved(new Date());
      setIsLoading(false);
      
      if (showToast) {
        toast({
          title: "Workflow saved",
          description: "Your Zap has been saved successfully.",
        });
      }
    }, 800); // Simulate network delay
  };

  const toggleActivation = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Zap deactivated" : "Zap activated",
      description: isActive 
        ? "Your Zap is now turned off and will not run." 
        : "Your Zap is now live and will run automatically.",
      variant: isActive ? "default" : "destructive",
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this Zap?")) {
      toast({
        title: "Zap deleted",
        description: "Your Zap has been permanently deleted.",
        variant: "destructive",
      });
      // In a real app, we would navigate back to the zap listing
    }
  };

  const handleWorkflowUpdate = (updatedSteps: WorkflowStepData[], updatedSchedule?: ScheduleConfig) => {
    setSteps(updatedSteps);
    if (updatedSchedule) {
      setSchedule(updatedSchedule);
    }
  };
  
  const handleRestoreVersion = (versionId: string) => {
    // In a real app, this would restore the workflow from the version history
    console.log(`Restoring version ${versionId}`);
    toast({
      title: "Version restored",
      description: "Your workflow has been restored to a previous version.",
    });
  };
  
  // Sample fields for data transformation demo
  const sourceFields = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "status", label: "Status" },
    { id: "created_at", label: "Created At" }
  ];
  
  const targetFields = [
    { id: "customer_name", label: "Customer Name" },
    { id: "customer_email", label: "Customer Email" },
    { id: "contact", label: "Contact" },
    { id: "user_status", label: "User Status" },
    { id: "registration_date", label: "Registration Date" }
  ];
  
  // Sample data transform config
  const [dataTransformConfig, setDataTransformConfig] = useState<DataTransformConfig>({
    mappings: [
      {
        id: "mapping-1",
        sourceField: "name",
        targetField: "customer_name",
        transformationType: "direct",
        transformationValue: ""
      },
      {
        id: "mapping-2",
        sourceField: "email",
        targetField: "customer_email",
        transformationType: "direct",
        transformationValue: ""
      }
    ],
    rawMode: false,
    customCode: ""
  });
  
  // Sample webhook config
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>({
    url: "https://hooks.zapier.com/hooks/catch/123456/abcdefg/",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    bodyTemplate: "{\n  \"data\": \"{{step1.output}}\",\n  \"timestamp\": \"{{timestamp}}\"\n}"
  });

  // Handle template selection with real functionality
  const handleTemplateSelect = async (template: any) => {
    try {
      setIsLoading(true);
      
      // Apply template steps and configuration
      const templateSteps = template.steps?.map((step: any) => ({
        ...step,
        id: `${step.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        configured: true
      })) || [];
      
      setSteps(templateSteps);
      
      if (template.schedule) {
        setSchedule(template.schedule);
      }
      
      const templateName = `Copy of ${template.name}`;
      setZapName(templateName);
      setActiveTab("build");
      
      // Save the workflow immediately
      const workflowData = {
        name: templateName,
        steps: templateSteps,
        schedule: template.schedule,
        isActive: false,
        templateId: template.id
      };
      
      // Use the API service to create the workflow
      const { apiService } = await import('@/services/api');
      await apiService.createWorkflow(workflowData);
      
      setLastSaved(new Date());
      
      toast({
        title: "Template applied successfully",
        description: `The "${template.name}" template has been loaded and saved to your workflow.`,
      });
      
      // Voice feedback
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(
          `Template "${template.name}" loaded successfully. Your workflow now has ${templateSteps.length} configured steps. You can test it or make further customizations.`
        );
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);
      }
      
    } catch (error) {
      console.error('Failed to apply template:', error);
      toast({
        title: "Failed to apply template",
        description: "There was an error loading the template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock apps for integration directory
  const mockApps = [
    { id: "gmail", name: "Gmail", icon: "G", color: "bg-red-500", description: "Connect your Gmail account", category: "Email" },
    { id: "slack", name: "Slack", icon: "S", color: "bg-green-500", description: "Send messages to Slack", category: "Communication" },
    { id: "sheets", name: "Google Sheets", icon: "Sh", color: "bg-green-600", description: "Work with spreadsheet data", category: "Productivity" },
    { id: "trello", name: "Trello", icon: "T", color: "bg-blue-500", description: "Manage Trello boards and cards", category: "Productivity" },
    { id: "twitter", name: "Twitter", icon: "Tw", color: "bg-blue-400", description: "Connect to Twitter API", category: "Social Media" },
    { id: "dropbox", name: "Dropbox", icon: "D", color: "bg-blue-600", description: "Manage files in Dropbox", category: "Storage" },
    { id: "mailchimp", name: "Mailchimp", icon: "M", color: "bg-orange-500", description: "Email marketing automation", category: "Marketing" },
    { id: "stripe", name: "Stripe", icon: "S", color: "bg-purple-500", description: "Process payments", category: "Finance" },
    { id: "salesforce", name: "Salesforce", icon: "SF", color: "bg-blue-700", description: "CRM and customer data", category: "CRM" },
    { id: "asana", name: "Asana", icon: "A", color: "bg-red-400", description: "Task and project management", category: "Productivity" },
    { id: "facebook", name: "Facebook", icon: "F", color: "bg-blue-600", description: "Connect to Facebook", category: "Social Media" },
    { id: "hubspot", name: "HubSpot", icon: "H", color: "bg-orange-500", description: "Marketing and CRM", category: "Marketing" }
  ];
  
  // Handle account connections
  const handleConnectAccount = (service: string, account: ConnectedAccount) => {
    setAccounts(prev => ({
      ...prev,
      [service]: [...(prev[service] || []), account]
    }));
  };
  
  const handleDisconnectAccount = (service: string, accountId: string) => {
    setAccounts(prev => ({
      ...prev,
      [service]: (prev[service] || []).filter(acc => acc.id !== accountId)
    }));
  };
  
  // Path branching handlers
  const handleAddPath = () => {
    const newPath: BranchPath = {
      id: `path-${Date.now()}`,
      name: `Path ${paths.length + 1}`,
      conditions: {
        id: `condition-${Date.now()}`,
        type: "all",
        conditions: []
      },
      steps: []
    };
    
    setPaths([...paths, newPath]);
    setActivePathId(newPath.id);
  };
  
  const handleDeletePath = (pathId: string) => {
    setPaths(paths.filter(p => p.id !== pathId));
    if (activePathId === pathId) {
      setActivePathId(null);
    }
  };
  
  const handleUpdatePathConditions = (pathId: string, conditions: any) => {
    setPaths(paths.map(p => 
      p.id === pathId ? { ...p, conditions } : p
    ));
  };
  
  const handlePathStepClick = (pathId: string, stepId: string) => {
    setActivePathId(pathId);
    // You would also set the active step ID here in a real implementation
  };
  
  const handleAddStepToPath = (pathId: string) => {
    setPaths(paths.map(p => {
      if (p.id === pathId) {
        return {
          ...p,
          steps: [...p.steps, {
            id: `step-${Date.now()}`,
            type: "action",
            appId: "",
            appName: "",
            actionName: "Choose an app & action",
            configured: false,
            config: {}
          }]
        };
      }
      return p;
    }));
  };

  const handleTest = async () => {
    setIsLoading(true);
    setTestOutput("Starting test...\n");
    
    toast({
      title: "Testing your Zap",
      description: "Running a test with sample data...",
    });
    
    try {
      // Use the real workflow execution
      const testData = {
        id: 12345,
        name: "Test Item",
        email: "test@example.com",
        status: "active",
        tags: ["important", "customer"],
        created: new Date().toISOString(),
        metadata: {
          source: "API",
          importance: "high"
        }
      };

      const execution = await executeWorkflow(`zap-${Date.now()}`, steps, testData);
      
      setTestOutput(prev => prev + `Execution completed with status: ${execution.status}\n`);
      setTestOutput(prev => prev + `Total execution time: ${execution.totalExecutionTime || 0}ms\n`);
      
      execution.steps.forEach((step, index) => {
        setTestOutput(prev => prev + `Step ${index + 1}: ${step.status} (${step.executionTime}ms)\n`);
        if (step.data) {
          setTestOutput(prev => prev + `  Data: ${JSON.stringify(step.data, null, 2)}\n`);
        }
        if (step.error) {
          setTestOutput(prev => prev + `  Error: ${step.error}\n`);
        }
      });

      // Update monitoring stats with real data
      setMonitoringData(prev => ({
        runs: prev.runs + 1,
        successful: execution.status === 'completed' ? prev.successful + 1 : prev.successful,
        failed: execution.status === 'failed' ? prev.failed + 1 : prev.failed,
        lastRun: new Date(),
        avgRunTime: execution.totalExecutionTime ? 
          (prev.runs === 0 ? execution.totalExecutionTime : (prev.avgRunTime * prev.runs + execution.totalExecutionTime) / (prev.runs + 1)) :
          prev.avgRunTime
      }));
      
    } catch (error) {
      setTestOutput(prev => prev + `Error: ${error}\n`);
      setMonitoringData(prev => ({
        ...prev,
        runs: prev.runs + 1,
        failed: prev.failed + 1,
        lastRun: new Date()
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <EnhancedZapHeader 
        zapName={zapName}
        setZapName={setZapName}
        isActive={isActive}
        toggleActivation={toggleActivation}
        handleSave={handleSave}
        handleTest={handleTest}
        handleDelete={handleDelete}
        lastSaved={lastSaved}
        isLoading={isLoading}
        onViewVersionHistory={() => setIsVersionHistoryOpen(true)}
        zapStats={{
          totalRuns: monitoringData.runs,
          successRate: monitoringData.runs > 0 ? Math.round((monitoringData.successful / monitoringData.runs) * 100) : 0,
          lastRun: monitoringData.lastRun
        }}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-6 overflow-x-auto flex-nowrap">
          <TabsTrigger value="build" className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            Build Workflow
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1">
            <Grid className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="transform" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            Data Transformation
          </TabsTrigger>
          <TabsTrigger value="paths" className="flex items-center gap-1">
            <GitBranch className="h-4 w-4" />
            Paths
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-1">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-1">
            <Key className="h-4 w-4" />
            Accounts
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-1">
            <Play className="h-4 w-4" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="build">
          <Card 
            className="border-gray-200 shadow-sm"
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
          >
            <CardHeader>
              <CardTitle>Build your workflow</CardTitle>
              <CardDescription>
                Connect apps and automate workflows with triggers, actions, and conditional logic.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ZapierWorkflowSteps
                steps={steps}
                onStepsChange={(newSteps) => {
                  setSteps(newSteps);
                  handleWorkflowUpdate(newSteps, schedule);
                }}
                onTest={(stepId) => console.log('Testing step:', stepId)}
              />
              
              {steps.length > 1 && (
                <div className="mt-8">
                  <WorkflowExecutor
                    workflowId={`zap-${zapName.replace(/\s+/g, '-').toLowerCase()}`}
                    steps={steps}
                    onExecute={(result) => {
                      console.log('Workflow execution completed:', result);
                    }}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={handleTest} disabled={isLoading}>
                Test Zap
              </Button>
              <Button 
                onClick={() => handleSave()} 
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? "Saving..." : "Save & Continue"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>
                Pre-built automation templates to help you get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateGallery onSelectTemplate={handleTemplateSelect} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>App Integrations</CardTitle>
              <CardDescription>
                Browse and connect applications to use in your workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntegrationDirectory 
                availableApps={mockApps}
                onSelectApp={(app) => {
                  toast({
                    title: `${app.name} selected`,
                    description: `You selected the ${app.name} integration.`
                  });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transform">
          <Card>
            <CardHeader>
              <CardTitle>Transform your data</CardTitle>
              <CardDescription>
                Map fields and create formulas to transform data between apps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visual" className="mb-6">
                <TabsList>
                  <TabsTrigger value="visual">Visual Mapper</TabsTrigger>
                  <TabsTrigger value="formula">Formula Editor</TabsTrigger>
                </TabsList>
                <TabsContent value="visual">
                  <DataTransformer
                    config={dataTransformConfig}
                    onChange={setDataTransformConfig}
                    sourceFields={sourceFields}
                    targetFields={targetFields}
                  />
                </TabsContent>
                <TabsContent value="formula">
                  <FormulaEditor />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button 
                onClick={() => {
                  toast({
                    title: "Transformations saved",
                    description: "Your data transformations have been saved."
                  });
                }}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? "Saving..." : "Save Transformations"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="paths">
          <Card>
            <CardHeader>
              <CardTitle>Branching Paths</CardTitle>
              <CardDescription>
                Create multiple execution paths based on conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PathBranching
                parentStepId="trigger-1"
                paths={paths}
                onAddPath={handleAddPath}
                onDeletePath={handleDeletePath}
                onUpdatePathConditions={handleUpdatePathConditions}
                onPathStepClick={handlePathStepClick}
                onAddStepToPath={handleAddStepToPath}
                activePathId={activePathId}
                activeStepId={null}
              />
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button 
                onClick={() => {
                  toast({
                    title: "Paths saved",
                    description: "Your branching paths have been saved."
                  });
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save Paths
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="accounts">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>
                  Manage all your connected app accounts in one place
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AccountConnection
                  service="gmail"
                  serviceName="Gmail"
                  icon="G"
                  color="bg-red-500"
                  accounts={accounts.gmail || []}
                  onConnect={(account) => handleConnectAccount("gmail", account)}
                  onDisconnect={(accountId) => handleDisconnectAccount("gmail", accountId)}
                />
                
                <AccountConnection
                  service="slack"
                  serviceName="Slack"
                  icon="S"
                  color="bg-green-500"
                  accounts={accounts.slack || []}
                  onConnect={(account) => handleConnectAccount("slack", account)}
                  onDisconnect={(accountId) => handleDisconnectAccount("slack", accountId)}
                />
                
                <AccountConnection
                  service="sheets"
                  serviceName="Google Sheets"
                  icon="Sh"
                  color="bg-green-600"
                  accounts={accounts.sheets || []}
                  onConnect={(account) => handleConnectAccount("sheets", account)}
                  onDisconnect={(accountId) => handleDisconnectAccount("sheets", accountId)}
                />
                
                <AccountConnection
                  service="trello"
                  serviceName="Trello"
                  icon="T"
                  color="bg-blue-500"
                  accounts={accounts.trello || []}
                  onConnect={(account) => handleConnectAccount("trello", account)}
                  onDisconnect={(accountId) => handleDisconnectAccount("trello", accountId)}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Webhooks</CardTitle>
              <CardDescription>
                Create and configure webhook integrations for your workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebhookIntegration
                config={{
                  ...webhookConfig,
                  advanced: true,
                  advancedConfig: {
                    url: webhookConfig.url,
                    method: webhookConfig.method,
                    headers: webhookConfig.headers,
                    bodyTemplate: webhookConfig.bodyTemplate,
                    authType: "none",
                    authConfig: {},
                    useSubscription: true,
                    subscriptionConfig: {
                      mode: "push",
                      secret: "webhook_secret_" + Date.now().toString(36),
                      pollingInterval: 300
                    }
                  }
                }}
                onChange={setWebhookConfig}
                generatedWebhookUrl={`https://api.example.com/webhooks/receive/${Date.now().toString(36)}`}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Test your workflow</CardTitle>
              <CardDescription>
                Run tests and view detailed results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-black text-green-400 p-4 rounded-md min-h-[300px] font-mono text-sm overflow-auto whitespace-pre-wrap">
                  {testOutput || <p className="text-gray-500">Test output will appear here</p>}
                </div>
                <div className="flex justify-start space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleTest} 
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Run Test
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setTestOutput("");
                      handleTest();
                    }} 
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Code className="h-4 w-4" />
                    Debug Mode
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Sample Data</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Sample data that will be used for testing
                  </p>
                  
                  <div className="p-4 bg-gray-50 rounded-md border">
                    <pre className="text-sm overflow-auto">
{`{
  "id": 12345,
  "name": "Test Item",
  "email": "test@example.com",
  "status": "active",
  "tags": ["important", "customer"],
  "created": "${new Date().toISOString()}",
  "metadata": {
    "source": "API",
    "importance": "high"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitor">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Monitoring</CardTitle>
              <CardDescription>
                Track the performance and history of your automated workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">Total Runs</p>
                      <p className="text-3xl font-bold">{monitoringData.runs}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">Success Rate</p>
                      <p className="text-3xl font-bold text-green-500">
                        {monitoringData.runs ? 
                          `${Math.round((monitoringData.successful / monitoringData.runs) * 100)}%` : 
                          "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">Last Run</p>
                      <p className="text-3xl font-bold">
                        {monitoringData.lastRun ? 
                          new Intl.DateTimeFormat('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(monitoringData.lastRun) : 
                          "Never"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">Avg. Runtime</p>
                      <p className="text-3xl font-bold">
                        {monitoringData.avgRunTime ? 
                          `${monitoringData.avgRunTime.toFixed(2)}s` : 
                          "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                {monitoringData.runs > 0 ? (
                  <div className="border rounded-md divide-y">
                    <div className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Test Run</p>
                        <p className="text-sm text-gray-500">
                          {monitoringData.lastRun?.toLocaleString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Success
                      </span>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No activity yet</AlertTitle>
                    <AlertDescription>
                      Run a test or activate your Zap to see monitoring data
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <TeamCollaboration 
            currentUserId="current-user"
            workflowId="workflow-1"
            workflowName={zapName}
          />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Settings</CardTitle>
                <CardDescription>
                  Configure general settings for your workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Advanced Conditions</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Set global conditions that determine when this workflow should run
                  </p>
                  <ConditionalLogic 
                    conditionGroup={{
                      id: "global-conditions",
                      type: "all",
                      conditions: []
                    }}
                    onChange={() => {
                      toast({
                        title: "Conditions updated",
                        description: "Global conditions have been updated."
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Version history dialog */}
      <VersionHistoryDialog
        isOpen={isVersionHistoryOpen}
        setIsOpen={setIsVersionHistoryOpen}
        interfaceId="current-zap"
        onRestoreVersion={handleRestoreVersion}
      />
    </div>
  );
}
