
import { useState, useEffect } from "react";
import { WorkflowBuilder } from "@/components/workflow/WorkflowBuilder";
import { toast } from "@/hooks/use-toast";
import { 
  Button,
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, PlayCircle, PauseCircle, Trash2, Clock, ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function ZapCreator() {
  const [zapName, setZapName] = useState("Untitled Zap");
  const [steps, setSteps] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (steps.length > 0) {
      const timer = setTimeout(() => {
        handleSave(steps, false);
      }, 30000); // Auto-save every 30 seconds
      return () => clearTimeout(timer);
    }
  }, [steps]);

  const handleSave = (currentSteps, showToast = true) => {
    setIsLoading(true);
    // In a real app, we would save this to a database
    console.log("Saving workflow:", currentSteps);
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
      variant: isActive ? "default" : "success",
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
        variant: "success",
      });
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Top bar with controls */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div className="flex-1">
            <Input
              type="text"
              value={zapName}
              onChange={(e) => setZapName(e.target.value)}
              className="text-2xl font-bold border-0 border-b-2 border-transparent focus:border-purple-500 focus:outline-none focus:ring-0 bg-transparent w-full p-0"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={isLoading}
              onClick={handleTest}
            >
              <PlayCircle size={16} />
              Test
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={isLoading}
              onClick={() => handleSave(steps)}
            >
              <Save size={16} />
              Save
            </Button>
            
            <Button
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={`gap-1 ${isActive ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
              onClick={toggleActivation}
              disabled={isLoading}
            >
              {isActive ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
              {isActive ? "Turn Off" : "Turn On"}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 size={16} className="mr-2" />
                  Delete Zap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          {lastSaved && (
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              Last saved {new Date(lastSaved).toLocaleTimeString()}
            </div>
          )}
          {isActive && (
            <Badge className="ml-2 bg-green-100 text-green-700 border border-green-200">
              Active
            </Badge>
          )}
        </div>
      </div>

      {/* Workflow Builder Component */}
      <Card className="mt-6 border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Build your workflow</CardTitle>
          <CardDescription>
            Connect apps and automate workflows with triggers and actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkflowBuilder onSave={handleSave} />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={handleTest} disabled={isLoading}>
            Test Zap
          </Button>
          <Button 
            onClick={() => handleSave(steps)} 
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
