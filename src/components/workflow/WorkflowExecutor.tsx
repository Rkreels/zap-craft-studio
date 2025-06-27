
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Activity,
  Zap
} from "lucide-react";

interface ExecutionStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  error?: string;
  data?: any;
}

interface WorkflowExecutorProps {
  workflowId: string;
  steps: any[];
  onExecute?: (result: any) => void;
}

export const WorkflowExecutor: React.FC<WorkflowExecutorProps> = ({ 
  workflowId, 
  steps, 
  onExecute 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [executionId, setExecutionId] = useState<string>('');

  useEffect(() => {
    // Initialize execution steps
    const initialSteps: ExecutionStep[] = steps.map((step, index) => ({
      id: step.id || `step-${index}`,
      name: step.actionName || `Step ${index + 1}`,
      status: 'pending'
    }));
    setExecutionSteps(initialSteps);
  }, [steps]);

  const startExecution = async () => {
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setProgress(0);
    setExecutionId(`exec_${Date.now()}`);

    // Reset all steps to pending
    setExecutionSteps(prev => prev.map(step => ({
      ...step,
      status: 'pending',
      startTime: undefined,
      endTime: undefined,
      error: undefined
    })));

    // Execute steps sequentially
    for (let i = 0; i < executionSteps.length; i++) {
      if (isPaused) break;
      
      setCurrentStepIndex(i);
      await executeStep(i);
      setProgress(((i + 1) / executionSteps.length) * 100);
    }

    setIsRunning(false);
  };

  const executeStep = async (stepIndex: number) => {
    return new Promise((resolve) => {
      // Update step status to running
      setExecutionSteps(prev => prev.map((step, index) => 
        index === stepIndex 
          ? { ...step, status: 'running', startTime: new Date() }
          : step
      ));

      // Simulate step execution
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        
        setExecutionSteps(prev => prev.map((step, index) => 
          index === stepIndex 
            ? { 
                ...step, 
                status: success ? 'completed' : 'failed',
                endTime: new Date(),
                duration: 1000 + Math.random() * 2000,
                error: success ? undefined : 'Simulated error for testing'
              }
            : step
        ));

        resolve(success);
      }, 1000 + Math.random() * 2000);
    });
  };

  const pauseExecution = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const resumeExecution = () => {
    setIsPaused(false);
    setIsRunning(true);
    // Continue from current step
  };

  const stopExecution = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setProgress(0);
  };

  const retryFailedSteps = () => {
    // Reset failed steps and retry
    setExecutionSteps(prev => prev.map(step => 
      step.status === 'failed' 
        ? { ...step, status: 'pending', error: undefined }
        : step
    ));
  };

  const getStatusIcon = (status: ExecutionStep['status']) => {
    switch (status) {
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'skipped':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ExecutionStep['status']) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      completed: 'success',
      failed: 'destructive',
      skipped: 'outline'
    } as const;

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Workflow Execution
          </CardTitle>
          <CardDescription>
            Monitor and control workflow execution in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Execution Controls */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={startExecution} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Start'}
            </Button>
            <Button 
              onClick={pauseExecution} 
              disabled={!isRunning}
              variant="outline"
            >
              <Pause className="w-4 h-4" />
              Pause
            </Button>
            <Button 
              onClick={resumeExecution} 
              disabled={!isPaused}
              variant="outline"
            >
              <Play className="w-4 h-4" />
              Resume
            </Button>
            <Button 
              onClick={stopExecution} 
              disabled={!isRunning && !isPaused}
              variant="outline"
            >
              <Square className="w-4 h-4" />
              Stop
            </Button>
            <Button 
              onClick={retryFailedSteps} 
              variant="outline"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Failed
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Execution Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Execution ID</div>
              <div className="font-mono">{executionId || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-500">Current Step</div>
              <div>{currentStepIndex + 1} of {executionSteps.length}</div>
            </div>
            <div>
              <div className="text-gray-500">Status</div>
              <div>{isRunning ? 'Running' : isPaused ? 'Paused' : 'Stopped'}</div>
            </div>
            <div>
              <div className="text-gray-500">Duration</div>
              <div>--:--</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Execution Details */}
      <Card>
        <CardHeader>
          <CardTitle>Execution Steps</CardTitle>
          <CardDescription>
            Detailed view of each step's execution status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {executionSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  index === currentStepIndex && isRunning ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(step.status)}
                  <div>
                    <div className="font-medium">{step.name}</div>
                    {step.error && (
                      <div className="text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {step.error}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {step.duration && (
                    <span className="text-sm text-gray-500">
                      {Math.round(step.duration)}ms
                    </span>
                  )}
                  {getStatusBadge(step.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
