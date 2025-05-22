
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZapHeader } from "@/components/zap-creator/ZapHeader";
import { EnhancedWorkflowBuilder } from "@/components/workflow/EnhancedWorkflowBuilder";
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
import { AlertCircle, Play, Code, Activity } from "lucide-react";

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

  // Voice guidance for workflow builder
  const workflowVoiceProps = {
    elementName: "Workflow Builder",
    hoverText: zapCreatorScripts.workflowBuilder.hover,
    clickText: zapCreatorScripts.workflowBuilder.click
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(workflowVoiceProps);

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

  const handleTest = () => {
    setIsLoading(true);
    setTestOutput("Starting test...\n");
    
    toast({
      title: "Testing your Zap",
      description: "Running a test with sample data...",
    });
    
    // Simulate test process with step-by-step output
    setTimeout(() => {
      setTestOutput(prev => prev + "Initializing workflow...\n");
      
      setTimeout(() => {
        setTestOutput(prev => prev + "Running trigger step...\n");
        
        setTimeout(() => {
          setTestOutput(prev => prev + "Trigger successful - received sample data\n");
          setTestOutput(prev => prev + "{\n  \"id\": 12345,\n  \"name\": \"Test Item\",\n  \"status\": \"active\",\n  \"created\": \"2025-05-22T14:30:00Z\"\n}\n");
          
          setTimeout(() => {
            setTestOutput(prev => prev + "Processing conditions...\n");
            
            setTimeout(() => {
              setTestOutput(prev => prev + "Conditions met. Proceeding with action steps...\n");
              
              setTimeout(() => {
                setTestOutput(prev => prev + "Running action steps...\n");
                
                setTimeout(() => {
                  setTestOutput(prev => prev + "All steps completed successfully!\n");
                  setTestOutput(prev => prev + "Test completed in 1.23 seconds\n");
                  
                  setIsLoading(false);
                  
                  // Update monitoring stats
                  setMonitoringData(prev => ({
                    ...prev,
                    runs: prev.runs + 1,
                    successful: prev.successful + 1,
                    lastRun: new Date(),
                    avgRunTime: prev.runs === 0 ? 1.23 : (prev.avgRunTime * prev.runs + 1.23) / (prev.runs + 1)
                  }));
                  
                  toast({
                    title: "Test completed",
                    description: "Your Zap completed successfully with test data.",
                    variant: "destructive",
                  });
                }, 600);
              }, 500);
            }, 400);
          }, 400);
        }, 600);
      }, 500);
    }, 400);
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

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <ZapHeader 
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
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-6">
          <TabsTrigger value="build" className="flex items-center gap-1">
            Build Workflow
          </TabsTrigger>
          <TabsTrigger value="transform" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            Data Transformation
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-1">
            <Play className="h-4 w-4" />
            Testing Tools
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Monitoring
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
              <EnhancedWorkflowBuilder 
                onSave={handleWorkflowUpdate}
                initialSteps={steps.length ? steps : undefined}
                initialSchedule={schedule}
              />
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
                onClick={() => handleSave()} 
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? "Saving..." : "Save Transformations"}
              </Button>
            </CardFooter>
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
                  <h3 className="text-lg font-semibold mb-2">Webhook Testing</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Configure and test webhook integrations
                  </p>
                  
                  <WebhookIntegration
                    config={webhookConfig}
                    onChange={setWebhookConfig}
                    generatedWebhookUrl={`https://api.example.com/webhooks/receive/${Date.now().toString(36)}`}
                  />
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
