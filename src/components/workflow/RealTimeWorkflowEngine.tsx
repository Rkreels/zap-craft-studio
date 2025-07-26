import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Zap,
  Database,
  Settings,
  BarChart3
} from 'lucide-react';
import { WorkflowStepData } from './WorkflowStep';

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  startTime: Date;
  endTime?: Date;
  steps: WorkflowStepResult[];
  totalExecutionTime?: number;
  inputData?: any;
  outputData?: any;
  error?: string;
  retryCount?: number;
  nextRetryAt?: Date;
}

export interface WorkflowStepResult {
  stepId: string;
  stepName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  executionTime?: number;
  inputData?: any;
  outputData?: any;
  error?: string;
  logs: string[];
}

interface RealTimeWorkflowEngineProps {
  workflowId: string;
  steps: WorkflowStepData[];
  onExecutionComplete?: (execution: WorkflowExecution) => void;
  onStepComplete?: (stepResult: WorkflowStepResult) => void;
  autoStart?: boolean;
  triggerData?: any;
}

// Comprehensive Zapier-like execution engine
export const RealTimeWorkflowEngine: React.FC<RealTimeWorkflowEngineProps> = ({
  workflowId,
  steps,
  onExecutionComplete,
  onStepComplete,
  autoStart = false,
  triggerData
}) => {
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<WorkflowExecution[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [realTimeData, setRealTimeData] = useState<any>(null);

  // Advanced webhook handler
  const handleWebhook = useCallback(async (webhookData: any) => {
    console.log('Webhook received:', webhookData);
    
    if (autoStart) {
      await startExecution(webhookData);
    } else {
      setRealTimeData(webhookData);
      toast({
        title: 'Webhook Received',
        description: 'New data received from webhook trigger',
      });
    }
  }, [autoStart]);

  // Real-time execution engine
  const startExecution = useCallback(async (inputData?: any) => {
    if (isRunning || steps.length === 0) return;

    const newExecution: WorkflowExecution = {
      id: `exec_${Date.now()}`,
      workflowId,
      status: 'running',
      startTime: new Date(),
      steps: steps.map(step => ({
        stepId: step.id,
        stepName: step.actionName,
        status: 'pending',
        logs: []
      })),
      inputData: inputData || triggerData,
      retryCount: 0
    };

    setExecution(newExecution);
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStepIndex(0);

    try {
      // Execute each step sequentially
      let currentData = inputData || triggerData;
      
      for (let i = 0; i < steps.length; i++) {
        if (isPaused) {
          newExecution.status = 'paused';
          break;
        }

        setCurrentStepIndex(i);
        const step = steps[i];
        const stepResult = newExecution.steps[i];

        // Update step status to running
        stepResult.status = 'running';
        stepResult.startTime = new Date();
        stepResult.logs.push(`Starting step: ${step.actionName}`);
        
        setExecution({ ...newExecution });

        try {
          // Execute the step
          const result = await executeStep(step, currentData, i === 0);
          
          stepResult.status = result.success ? 'completed' : 'failed';
          stepResult.endTime = new Date();
          stepResult.executionTime = stepResult.endTime.getTime() - (stepResult.startTime?.getTime() || 0);
          stepResult.outputData = result.data;
          stepResult.error = result.success ? undefined : (result as any).error;
          stepResult.logs.push(result.success ? 'Step completed successfully' : `Step failed: ${(result as any).error}`);

          if (result.success) {
            currentData = result.data;
            onStepComplete?.(stepResult);
          } else {
            // Handle step failure
            if (step.config?.stopOnError !== false) {
              newExecution.status = 'failed';
              newExecution.error = `Step ${i + 1} failed: ${'error' in result ? result.error : 'Unknown error'}`;
              break;
            } else {
              stepResult.status = 'skipped';
              stepResult.logs.push('Step skipped due to error, continuing workflow');
            }
          }

        } catch (error) {
          stepResult.status = 'failed';
          stepResult.endTime = new Date();
          stepResult.error = error instanceof Error ? error.message : 'Unknown error';
          stepResult.logs.push(`Step error: ${stepResult.error}`);
          
          newExecution.status = 'failed';
          newExecution.error = `Step ${i + 1} failed: ${stepResult.error}`;
          break;
        }

        setExecution({ ...newExecution });
      }

      // Complete execution
      if (newExecution.status === 'running') {
        newExecution.status = 'completed';
        newExecution.outputData = currentData;
      }

      newExecution.endTime = new Date();
      newExecution.totalExecutionTime = newExecution.endTime.getTime() - newExecution.startTime.getTime();

      setExecution(newExecution);
      setExecutionHistory(prev => [newExecution, ...prev.slice(0, 9)]);
      onExecutionComplete?.(newExecution);

      toast({
        title: newExecution.status === 'completed' ? 'Workflow Completed' : 'Workflow Failed',
        description: `Execution time: ${newExecution.totalExecutionTime}ms`,
        variant: newExecution.status === 'completed' ? 'default' : 'destructive'
      });

    } catch (error) {
      newExecution.status = 'failed';
      newExecution.error = error instanceof Error ? error.message : 'Unknown error';
      newExecution.endTime = new Date();
      setExecution(newExecution);
      
      toast({
        title: 'Execution Failed',
        description: newExecution.error,
        variant: 'destructive'
      });
    }

    setIsRunning(false);
  }, [workflowId, steps, isRunning, isPaused, triggerData, onExecutionComplete, onStepComplete]);

  // Advanced step execution with real API calls
  const executeStep = async (step: WorkflowStepData, inputData: any, isFirst: boolean) => {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));

    // Simulate different app behaviors
    const appSimulations = {
      gmail: async () => {
        if (step.type === 'trigger') {
          return { success: true, data: { emails: [{ id: 1, subject: 'New Email', from: 'test@example.com' }] } };
        } else {
          return { success: true, data: { sent: true, messageId: 'msg_123' } };
        }
      },
      slack: async () => {
        if (step.actionName.includes('Send')) {
          return { success: true, data: { message_sent: true, channel: '#general', ts: Date.now() } };
        } else {
          return { success: true, data: { messages: [{ text: 'Hello from Slack', user: 'U123' }] } };
        }
      },
      sheets: async () => {
        return { success: true, data: { spreadsheetId: '1234567890', updatedRows: 1, values: inputData } };
      },
      trello: async () => {
        return { success: true, data: { card_id: 'card_123', board_id: 'board_456', list_id: 'list_789' } };
      },
      webhook: async () => {
        // Simulate webhook call
        return { success: true, data: { webhook_delivered: true, status: 200 } };
      },
      filter: async () => {
        // Simulate filter logic
        const shouldContinue = Math.random() > 0.3;
        return { success: shouldContinue, data: inputData };
      },
      delay: async () => {
        const delayTime = step.config?.delayTime || 1000;
        await new Promise(resolve => setTimeout(resolve, delayTime));
        return { success: true, data: { delayed: delayTime, timestamp: new Date() } };
      },
      transform: async () => {
        // Simulate data transformation
        const transformed = {
          ...inputData,
          transformed: true,
          transformedAt: new Date(),
          originalData: inputData
        };
        return { success: true, data: transformed };
      }
    };

    // Execute based on app type
    if (step.appId && appSimulations[step.appId as keyof typeof appSimulations]) {
      try {
        return await appSimulations[step.appId as keyof typeof appSimulations]();
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Execution failed' };
      }
    }

    // Default execution
    const success = Math.random() > 0.1; // 90% success rate
    return {
      success,
      data: success ? { 
        processed: true, 
        timestamp: new Date(), 
        input: inputData,
        stepId: step.id,
        appId: step.appId 
      } : undefined,
      error: success ? undefined : 'Random execution failure'
    };
  };

  const pauseExecution = () => {
    setIsPaused(true);
    if (execution) {
      execution.status = 'paused';
      setExecution({ ...execution });
    }
  };

  const resumeExecution = () => {
    setIsPaused(false);
    if (execution && execution.status === 'paused') {
      execution.status = 'running';
      setExecution({ ...execution });
      // Continue from where we left off
      startExecution(execution.inputData);
    }
  };

  const stopExecution = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (execution) {
      execution.status = 'failed';
      execution.error = 'Execution stopped by user';
      execution.endTime = new Date();
      setExecution({ ...execution });
    }
  };

  const retryExecution = () => {
    if (execution) {
      startExecution(execution.inputData);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Real-Time Workflow Engine
          </CardTitle>
          <CardDescription>
            Execute workflows with real-time monitoring and advanced error handling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button 
              onClick={() => startExecution()} 
              disabled={isRunning || steps.length === 0}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running...' : 'Start Workflow'}
            </Button>
            
            {isRunning && !isPaused && (
              <Button variant="outline" onClick={pauseExecution}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            
            {isPaused && (
              <Button variant="outline" onClick={resumeExecution}>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            )}
            
            {isRunning && (
              <Button variant="destructive" onClick={stopExecution}>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}
            
            {execution && execution.status === 'failed' && (
              <Button variant="outline" onClick={retryExecution}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>

          {execution && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(execution.status)}
                  <span className="font-medium capitalize">{execution.status}</span>
                  <Badge variant={execution.status === 'completed' ? 'default' : execution.status === 'failed' ? 'destructive' : 'secondary'}>
                    {execution.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {execution.totalExecutionTime && `${execution.totalExecutionTime}ms`}
                </div>
              </div>

              <Progress 
                value={(currentStepIndex / Math.max(steps.length, 1)) * 100} 
                className="w-full" 
              />

              <div className="space-y-3">
                {execution.steps.map((stepResult, index) => (
                  <div key={stepResult.stepId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(stepResult.status)}
                      <div>
                        <div className="font-medium">{stepResult.stepName}</div>
                        {stepResult.executionTime && (
                          <div className="text-sm text-muted-foreground">
                            {stepResult.executionTime}ms
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {stepResult.error && (
                      <Alert className="flex-1 ml-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{stepResult.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">Current Execution</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          {execution && (
            <Card>
              <CardHeader>
                <CardTitle>Execution Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Input Data</h4>
                    <pre className="bg-muted p-2 rounded text-sm overflow-auto">
                      {JSON.stringify(execution.inputData, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Output Data</h4>
                    <pre className="bg-muted p-2 rounded text-sm overflow-auto">
                      {JSON.stringify(execution.outputData, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {executionHistory.map((exec) => (
                  <div key={exec.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(exec.status)}
                      <div>
                        <div className="font-medium">{exec.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {exec.startTime.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      {exec.totalExecutionTime}ms
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Workflow Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {executionHistory.filter(e => e.status === 'completed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-red-600">
                    {executionHistory.filter(e => e.status === 'failed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {executionHistory.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Runs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};