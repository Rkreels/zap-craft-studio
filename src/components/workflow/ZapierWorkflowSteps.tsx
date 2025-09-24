import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZapierButton } from '@/components/ui/zapier-button';
import { Badge } from '@/components/ui/badge';
import { WorkflowStepData } from './WorkflowStep';
import { Plus, Settings, Trash2, AlertCircle, CheckCircle, Zap, ArrowDown, Play } from 'lucide-react';
import { EnhancedStepConfiguration } from './EnhancedStepConfiguration';
import { mockApps, getTriggerEventsForApp, getActionEventsForApp } from '@/data/mockApps';
import { AppItem } from '@/components/zap-creator/AppSelector';
import { TriggerEvent } from '@/components/zap-creator/EventSelector';

interface ZapierWorkflowStepsProps {
  steps: WorkflowStepData[];
  onStepsChange: (steps: WorkflowStepData[]) => void;
  onTest?: (stepId: string) => void;
}

export function ZapierWorkflowSteps({ steps, onStepsChange, onTest }: ZapierWorkflowStepsProps) {
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const addStep = (afterIndex: number) => {
    const newStep: WorkflowStepData = {
      id: `action-${Date.now()}`,
      type: 'action',
      appId: '',
      appName: '',
      actionName: 'Choose an app & action',
      configured: false,
      config: {}
    };

    const newSteps = [
      ...steps.slice(0, afterIndex + 1),
      newStep,
      ...steps.slice(afterIndex + 1)
    ];

    onStepsChange(newSteps);
    setActiveStepId(newStep.id);
  };

  const deleteStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step?.type === 'trigger') return; // Can't delete trigger

    const newSteps = steps.filter(s => s.id !== stepId);
    onStepsChange(newSteps);
    
    if (activeStepId === stepId) {
      setActiveStepId(null);
    }
  };

  const updateStep = (stepId: string, updatedStep: WorkflowStepData) => {
    const newSteps = steps.map(step => 
      step.id === stepId ? updatedStep : step
    );
    onStepsChange(newSteps);
  };

  const getStepIcon = (step: WorkflowStepData) => {
    if (!step.appId) return Zap;
    
    const app = mockApps.find(a => a.id === step.appId);
    if (app) {
      return () => (
        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-semibold ${app.color}`}>
          {app.icon}
        </div>
      );
    }
    return Zap;
  };

  const getStepStatus = (step: WorkflowStepData) => {
    if (!step.configured) {
      return { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', label: 'Setup required' };
    }
    return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Ready' };
  };

  const getEvents = (step: WorkflowStepData): TriggerEvent[] => {
    if (!step.appId) return [];
    return step.type === 'trigger' 
      ? getTriggerEventsForApp(step.appId)
      : getActionEventsForApp(step.appId);
  };

  if (activeStepId) {
    const activeStep = steps.find(s => s.id === activeStepId);
    if (activeStep) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveStepId(null)}
              >
                ← Back to steps
              </Button>
              <h2 className="text-xl font-semibold">
                Configure Step {steps.findIndex(s => s.id === activeStepId) + 1}
              </h2>
            </div>
          </div>

          <EnhancedStepConfiguration
            step={activeStep}
            onUpdate={(updatedStep) => updateStep(activeStepId, updatedStep)}
            onTest={() => onTest?.(activeStepId)}
            apps={mockApps}
            events={getEvents(activeStep)}
          />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Workflow Steps</h2>
        <ZapierButton
          variant="outline"
          size="sm"
          onClick={() => addStep(steps.length - 1)}
        >
          <Plus className="h-4 w-4" />
          Add Step
        </ZapierButton>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const StepIcon = getStepIcon(step);
          const status = getStepStatus(step);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              <Card className={`transition-all hover:shadow-md ${!step.configured ? 'border-warning/50' : 'border-success/50'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Step Number & Icon */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                        <StepIcon />
                      </div>

                      {/* Step Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            {step.appName || (step.type === 'trigger' ? 'Choose a trigger app' : 'Choose an action app')}
                          </h3>
                          <Badge variant={step.configured ? 'default' : 'secondary'} className={status.bg}>
                            <status.icon className={`h-3 w-3 mr-1 ${status.color}`} />
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.actionName || (step.type === 'trigger' ? 'When this happens...' : 'Do this...')}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {onTest && step.configured && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onTest(step.id)}
                        >
                          <Play className="h-4 w-4" />
                          Test
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveStepId(step.id)}
                      >
                        <Settings className="h-4 w-4" />
                        {step.configured ? 'Edit' : 'Setup'}
                      </Button>

                      {step.type !== 'trigger' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteStep(step.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connector Arrow */}
              {!isLast && (
                <>
                  <div className="flex justify-center my-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                      <ArrowDown className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* Add Step Button */}
                  <div className="flex justify-center -my-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addStep(index)}
                      className="h-6 px-2 text-xs bg-white border border-border hover:bg-primary/5"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add step
                    </Button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}