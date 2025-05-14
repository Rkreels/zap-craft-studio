
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WorkflowStepData } from "./WorkflowStep";
import { WorkflowStepsList } from "./WorkflowStepsList";
import { StepConfigPanel } from "./StepConfigPanel";
import { AppItem } from "@/components/zap-creator/AppSelector";
import { TriggerEvent } from "@/components/zap-creator/EventSelector";
import { mockApps, getTriggerEventsForApp, getActionEventsForApp } from "@/data/mockApps";
import { toast } from "@/components/ui/use-toast";

interface EnhancedWorkflowBuilderProps {
  onSave?: (steps: WorkflowStepData[]) => void;
  initialSteps?: WorkflowStepData[];
}

export const EnhancedWorkflowBuilder = ({
  onSave,
  initialSteps = []
}: EnhancedWorkflowBuilderProps) => {
  const [steps, setSteps] = useState<WorkflowStepData[]>(initialSteps.length ? initialSteps : [
    {
      id: "trigger-1",
      type: "trigger",
      appId: "",
      appName: "",
      actionName: "Choose an app & event",
      configured: false,
      config: {}
    }
  ]);
  
  const [activeStepId, setActiveStepId] = useState<string>(steps[0]?.id || "");
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TriggerEvent | null>(null);
  const [configStage, setConfigStage] = useState<'app' | 'event' | 'config'>('app');
  
  // Get the active step
  const activeStep = steps.find(step => step.id === activeStepId) || steps[0];
  const activeStepIndex = steps.findIndex(step => step.id === activeStepId);
  
  // Get events for the selected app
  const events = activeStep?.type === 'trigger' 
    ? getTriggerEventsForApp(selectedApp?.id || '') 
    : getActionEventsForApp(selectedApp?.id || '');
  
  // Reset selected event when app changes
  useEffect(() => {
    setSelectedEvent(null);
    
    if (selectedApp) {
      setConfigStage('event');
    } else {
      setConfigStage('app');
    }
  }, [selectedApp]);
  
  // Update step when event is selected
  useEffect(() => {
    if (selectedApp && selectedEvent) {
      const updatedSteps = steps.map(step => {
        if (step.id === activeStepId) {
          return {
            ...step,
            appId: selectedApp.id,
            appName: selectedApp.name,
            actionName: selectedEvent.name,
            eventId: selectedEvent.id,
            configured: true
          };
        }
        return step;
      });
      
      setSteps(updatedSteps);
      setConfigStage('config');
      
      if (onSave) {
        onSave(updatedSteps);
      }
      
      toast({
        title: "Step configured",
        description: `${selectedApp.name} ${selectedEvent.name} has been configured.`,
      });
    }
  }, [selectedEvent, selectedApp, activeStepId]);
  
  // Set the selectedApp when the active step changes
  useEffect(() => {
    if (activeStep?.appId) {
      const app = mockApps.find(app => app.id === activeStep.appId);
      if (app) {
        setSelectedApp(app);
        
        if (activeStep.eventId) {
          const events = activeStep.type === 'trigger' 
            ? getTriggerEventsForApp(app.id) 
            : getActionEventsForApp(app.id);
            
          const event = events.find(e => e.id === activeStep.eventId);
          if (event) {
            setSelectedEvent(event);
            setConfigStage('config');
          } else {
            setConfigStage('event');
          }
        } else {
          setConfigStage('event');
        }
      } else {
        setSelectedApp(null);
        setConfigStage('app');
      }
    } else {
      setSelectedApp(null);
      setSelectedEvent(null);
      setConfigStage('app');
    }
  }, [activeStepId]);
  
  const addStep = (afterStepId: string) => {
    const newStepId = `action-${Date.now()}`;
    const afterIndex = steps.findIndex(step => step.id === afterStepId);
    
    const newStep: WorkflowStepData = {
      id: newStepId,
      type: "action",
      appId: "",
      appName: "",
      actionName: "Choose an app & action",
      configured: false,
      config: {}
    };
    
    const newSteps = [
      ...steps.slice(0, afterIndex + 1),
      newStep,
      ...steps.slice(afterIndex + 1)
    ];
    
    setSteps(newSteps);
    setActiveStepId(newStepId);
    setSelectedApp(null);
    setSelectedEvent(null);
    setConfigStage('app');
    
    if (onSave) {
      onSave(newSteps);
    }
  };
  
  const deleteStep = (stepId: string) => {
    // Can't delete the trigger
    if (steps.find(step => step.id === stepId)?.type === "trigger") {
      return;
    }
    
    const newSteps = steps.filter(step => step.id !== stepId);
    setSteps(newSteps);
    
    // If we deleted the active step, set the first one as active
    if (activeStepId === stepId) {
      setActiveStepId(newSteps[0]?.id || "");
    }
    
    if (onSave) {
      onSave(newSteps);
    }
    
    toast({
      title: "Step removed",
      description: "The step has been removed from your workflow.",
    });
  };
  
  // Handle app selection
  const handleAppSelect = (app: AppItem) => {
    setSelectedApp(app);
  };
  
  // Handle event selection
  const handleEventSelect = (event: TriggerEvent) => {
    setSelectedEvent(event);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Steps sidebar */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg border border-gray-200 p-4">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Workflow Steps</h3>
          <p className="text-gray-500 text-sm">Configure the steps in your workflow</p>
        </div>

        <WorkflowStepsList 
          steps={steps}
          activeStepId={activeStepId}
          setActiveStepId={setActiveStepId}
          deleteStep={deleteStep}
          addStep={addStep}
        />
      </div>
      
      {/* Configuration panel */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200">
        {activeStepId && (
          <StepConfigPanel
            activeStep={activeStep}
            configStage={configStage}
            selectedApp={selectedApp}
            selectedEvent={selectedEvent}
            events={events}
            handleAppSelect={handleAppSelect}
            handleEventSelect={handleEventSelect}
          />
        )}
      </div>
    </div>
  );
};
