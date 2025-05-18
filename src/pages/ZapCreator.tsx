
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

export default function ZapCreator() {
  const [zapName, setZapName] = useState("Untitled Zap");
  const [steps, setSteps] = useState<WorkflowStepData[]>([]);
  const [schedule, setSchedule] = useState<ScheduleConfig>();
  const [isActive, setIsActive] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("build");
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

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
    toast({
      title: "Testing your Zap",
      description: "Running a test with sample data...",
    });
    
    // Simulate test process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Test completed",
        description: "Your Zap completed successfully with test data.",
        variant: "destructive",
      });
    }, 2000);
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
          <TabsTrigger value="build">Build Workflow</TabsTrigger>
          <TabsTrigger value="transform">Data Transformation</TabsTrigger>
          <TabsTrigger value="test">Testing Tools</TabsTrigger>
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
                Connect apps and automate workflows with triggers and actions.
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
              <FormulaEditor />
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
                Run tests and view results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-100 p-4 rounded-md min-h-[200px] font-mono text-sm">
                  <p className="text-gray-500">Test output will appear here</p>
                </div>
                <div className="flex justify-start space-x-3">
                  <Button variant="outline" onClick={handleTest}>
                    Run Test
                  </Button>
                  <Button variant="outline" onClick={handleTest}>
                    Debug Mode
                  </Button>
                </div>
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
};
