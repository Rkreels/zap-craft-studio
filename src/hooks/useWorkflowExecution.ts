
import { useState, useCallback } from 'react';
import { WorkflowStepData } from '@/components/workflow/WorkflowStep';
import { toast } from '@/hooks/use-toast';

export interface WorkflowExecutionResult {
  stepId: string;
  status: 'success' | 'error' | 'running';
  data?: any;
  error?: string;
  executionTime: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startTime: Date;
  endTime?: Date;
  steps: WorkflowExecutionResult[];
  totalExecutionTime?: number;
}

export const useWorkflowExecution = () => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecution | null>(null);

  const executeWorkflow = useCallback(async (workflowId: string, steps: WorkflowStepData[], inputData?: any) => {
    const executionId = `exec_${Date.now()}`;
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      status: 'running',
      startTime: new Date(),
      steps: []
    };

    setCurrentExecution(execution);
    setExecutions(prev => [...prev, execution]);

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const startTime = Date.now();
        
        // Simulate step execution
        const result = await executeStep(step, inputData, i === 0);
        const executionTime = Date.now() - startTime;

        const stepResult: WorkflowExecutionResult = {
          stepId: step.id,
          status: result.success ? 'success' : 'error',
          data: result.data,
          error: result.error,
          executionTime
        };

        execution.steps.push(stepResult);
        
        if (!result.success) {
          execution.status = 'failed';
          execution.endTime = new Date();
          break;
        }

        inputData = result.data; // Pass data to next step
      }

      if (execution.status === 'running') {
        execution.status = 'completed';
        execution.endTime = new Date();
        execution.totalExecutionTime = execution.endTime.getTime() - execution.startTime.getTime();
      }

      setCurrentExecution(execution);
      toast({
        title: execution.status === 'completed' ? 'Workflow completed successfully' : 'Workflow failed',
        description: `Execution time: ${execution.totalExecutionTime || 0}ms`,
        variant: execution.status === 'completed' ? 'default' : 'destructive'
      });

    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      setCurrentExecution(execution);
    }

    return execution;
  }, []);

  const executeStep = async (step: WorkflowStepData, inputData: any, isFirst: boolean) => {
    // Simulate API calls and processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

    const mockResponses = {
      gmail: { emails: [{ id: 1, subject: 'Test Email', from: 'test@example.com' }] },
      slack: { message_sent: true, channel: '#general' },
      sheets: { rows_updated: 5, spreadsheet_id: '1234567890' },
      trello: { card_created: true, card_id: 'card_123' }
    };

    if (step.appId && mockResponses[step.appId as keyof typeof mockResponses]) {
      return {
        success: true,
        data: mockResponses[step.appId as keyof typeof mockResponses]
      };
    }

    return {
      success: Math.random() > 0.1, // 90% success rate
      data: { processed: true, timestamp: new Date().toISOString(), input: inputData },
      error: Math.random() > 0.9 ? 'Random execution error' : undefined
    };
  };

  const pauseExecution = useCallback((executionId: string) => {
    setExecutions(prev => prev.map(exec => 
      exec.id === executionId ? { ...exec, status: 'paused' as const } : exec
    ));
  }, []);

  const resumeExecution = useCallback((executionId: string) => {
    setExecutions(prev => prev.map(exec => 
      exec.id === executionId ? { ...exec, status: 'running' as const } : exec
    ));
  }, []);

  return {
    executions,
    currentExecution,
    executeWorkflow,
    pauseExecution,
    resumeExecution
  };
};
