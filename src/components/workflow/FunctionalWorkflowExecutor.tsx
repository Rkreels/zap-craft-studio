import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Play, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Activity,
  Zap
} from "lucide-react";
import { WorkflowStepData } from "./WorkflowStep";
import { useWorkflowExecution } from "@/hooks/useWorkflowExecution";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FunctionalWorkflowExecutorProps {
  steps: WorkflowStepData[];
  workflowId?: string;
  onExecutionComplete?: (result: any) => void;
}

export const FunctionalWorkflowExecutor: React.FC<FunctionalWorkflowExecutorProps> = ({
  steps,
  workflowId = "test-workflow",
  onExecutionComplete
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const [totalExecutionTime, setTotalExecutionTime] = useState<number>(0);
  const [testData, setTestData] = useState(JSON.stringify({
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
  }, null, 2));

  const { executeWorkflow } = useWorkflowExecution();

  const handleExecute = async () => {
    if (steps.length === 0) {
      toast({
        title: "No Steps to Execute",
        description: "Add some steps to your workflow before testing.",
        variant: "destructive",
      });
      return;
    }

    const unconfiguredSteps = steps.filter(step => !step.configured);
    if (unconfiguredSteps.length > 0) {
      toast({
        title: "Incomplete Configuration",
        description: `Please configure all steps. ${unconfiguredSteps.length} step(s) need configuration.`,
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    setExecutionResults([]);

    try {
      let parsedTestData;
      try {
        parsedTestData = JSON.parse(testData);
      } catch (error) {
        throw new Error("Invalid test data JSON format");
      }

      const startTime = Date.now();
      const execution = await executeWorkflow(workflowId, steps, parsedTestData);
      const endTime = Date.now();
      
      setTotalExecutionTime(endTime - startTime);
      setExecutionResults(execution.steps);

      toast({
        title: execution.status === 'completed' ? "Execution Completed" : "Execution Failed",
        description: `Workflow executed in ${endTime - startTime}ms`,
        variant: execution.status === 'completed' ? "default" : "destructive",
      });

      onExecutionComplete?.(execution);

    } catch (error) {
      console.error('Execution failed:', error);
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      
      setExecutionResults([{
        stepId: 'error',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: 0
      }]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleStop = () => {
    setIsExecuting(false);
    toast({
      title: "Execution Stopped",
      description: "Workflow execution has been stopped.",
    });
  };

  const handleReset = () => {
    setExecutionResults([]);
    setTotalExecutionTime(0);
    toast({
      title: "Results Cleared",
      description: "Execution results have been cleared.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'running':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Data Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Test Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              className="font-mono text-sm min-h-[200px]"
              placeholder="Enter test data in JSON format..."
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExecute}
                disabled={isExecuting}
                className="gap-2"
              >
                {isExecuting ? (
                  <>
                    <Activity className="h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Execute Workflow
                  </>
                )}
              </Button>
              
              {isExecuting && (
                <Button variant="outline" onClick={handleStop} className="gap-2">
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}
              
              {executionResults.length > 0 && (
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Results */}
      {(executionResults.length > 0 || isExecuting) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Execution Results
              </CardTitle>
              {totalExecutionTime > 0 && (
                <Badge variant="outline">
                  Total: {totalExecutionTime}ms
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => {
                const result = executionResults.find(r => r.stepId === step.id) || 
                             (isExecuting && index === 0 ? { status: 'running' } : null);
                
                return (
                  <div 
                    key={step.id}
                    className={cn(
                      "border rounded-lg p-4 transition-all",
                      result ? "border-blue-200 bg-blue-50/50" : "border-gray-200"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-sm font-bold">
                          {step.appName?.charAt(0) || index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {step.type === 'trigger' ? 'Trigger' : `Action ${index}`}: {step.appName}
                          </h4>
                          <p className="text-sm text-gray-600">{step.actionName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {result?.executionTime && (
                          <Badge variant="outline" className="text-xs">
                            {result.executionTime}ms
                          </Badge>
                        )}
                        {result && (
                          <Badge className={cn("text-xs", getStatusColor(result.status))}>
                            {getStatusIcon(result.status)}
                            <span className="ml-1">{result.status}</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {result?.data && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-2">Output Data:</h5>
                        <pre className="bg-gray-100 rounded p-2 text-xs overflow-auto max-h-32">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {result?.error && (
                      <Alert className="mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{result.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                );
              })}
              
              {isExecuting && (
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Activity className="h-4 w-4 animate-spin" />
                    <span>Executing workflow...</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};