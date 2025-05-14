
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

export default function ZapCreator() {
  const [zapName, setZapName] = useState("Untitled Zap");
  const [steps, setSteps] = useState<WorkflowStepData[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleWorkflowUpdate = (updatedSteps: WorkflowStepData[]) => {
    setSteps(updatedSteps);
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
      />

      <Card className="mt-6 border-gray-200 shadow-sm">
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
    </div>
  );
}
