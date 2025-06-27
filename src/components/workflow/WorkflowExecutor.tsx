
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Activity 
} from 'lucide-react';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';
import { WorkflowStepData } from './WorkflowStep';
import { useVoiceGuidance } from '@/components/voice-assistant/withVoiceGuidance';

interface WorkflowExecutorProps {
  workflowId: string;
  steps: WorkflowStepData[];
  onExecutionComplete?: (result: any) => void;
}

export const WorkflowExecutor: React.FC<WorkflowExecutorProps> = ({
  workflowId,
  steps,
  onExecutionComplete
}) => {
  const { 
    executions, 
    currentExecution, 
    executeWorkflow, 
    pauseExecution, 
    resumeExecution 
  } = useWorkflowExecution();
  
  const [inputData, setInputData] = useState('{}');

  const voiceGuidanceProps = {
    elementName: "Workflow Executor",
    hoverText: "Execute your workflow with real-time monitoring and step-by-step progress tracking",
    clickText: "Run, pause, or monitor your automated workflow execution with detailed feedback"
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(voiceGuidanceProps);

  const handleExecute = async () => {
    try {
      const data = JSON.parse(inputData);
      const result = await executeWorkflow(workflowId, steps, data);
      if (onExecutionComplete) {
        onExecutionComplete(result);
      }
    } catch (error) {
      console.error('Failed to parse input data:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <Activity className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="space-y-6"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Workflow Execution</span>
            {currentExecution && (
              <Badge className={getStatusColor(currentExecution.status)}>
                {currentExecution.status.toUpperCase()}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Data (JSON)</label>
            <textarea
              className="w-full h-32 p-3 border rounded-md font-mono text-sm"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder='{"key": "value", "data": "sample input"}'
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleExecute}
              disabled={currentExecution?.status === 'running'}
              className="flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Execute Workflow</span>
            </Button>
            
            {currentExecution?.status === 'running' && (
              <Button 
                variant="outline"
                onClick={() => pauseExecution(currentExecution.id)}
                className="flex items-center space-x-2"
              >
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </Button>
            )}
            
            {currentExecution?.status === 'paused' && (
              <Button 
                variant="outline"
                onClick={() => resumeExecution(currentExecution.id)}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Resume</span>
              </Button>
            )}
          </div>
          
          {currentExecution && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {currentExecution.steps.length} / {steps.length} steps
                </span>
              </div>
              
              <Progress 
                value={(currentExecution.steps.length / steps.length) * 100} 
                className="w-full"
              />
              
              <div className="space-y-2">
                <h4 className="font-medium">Step Results</h4>
                {currentExecution.steps.map((stepResult, index) => {
                  const step = steps.find(s => s.id === stepResult.stepId);
                  return (
                    <div key={stepResult.stepId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(stepResult.status)}
                        <div>
                          <p className="font-medium text-sm">
                            {step?.appName || 'Unknown Step'}: {step?.actionName || 'Unknown Action'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Executed in {stepResult.executionTime}ms
                          </p>
                        </div>
                      </div>
                      
                      {stepResult.error && (
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-xs text-red-600">{stepResult.error}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {currentExecution.status === 'completed' && currentExecution.totalExecutionTime && (
                <div className="p-4 bg-green-50 rounded-md">
                  <p className="text-sm text-green-800">
                    ✅ Workflow completed successfully in {currentExecution.totalExecutionTime}ms
                  </p>
                </div>
              )}
              
              {currentExecution.status === 'failed' && (
                <div className="p-4 bg-red-50 rounded-md">
                  <p className="text-sm text-red-800">
                    ❌ Workflow execution failed. Check the step results above for details.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {executions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Execution History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {executions.slice().reverse().slice(0, 5).map((execution) => (
                <div key={execution.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(execution.status)}>
                      {execution.status}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">
                        {execution.startTime.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {execution.steps.length} steps executed
                      </p>
                    </div>
                  </div>
                  
                  {execution.totalExecutionTime && (
                    <span className="text-sm text-gray-500">
                      {execution.totalExecutionTime}ms
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
