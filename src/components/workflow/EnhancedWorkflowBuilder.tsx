
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Trash, Save, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkflowStep, WorkflowStepData } from "./WorkflowStep";
import { AppSelector, AppItem } from "@/components/zap-creator/AppSelector";
import { EventSelector, TriggerEvent } from "@/components/zap-creator/EventSelector";
import { mockApps, getTriggerEventsForApp, getActionEventsForApp } from "@/data/mockApps";

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
    }
  }, [selectedEvent]);
  
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
  };
  
  // Handle app selection
  const handleAppSelect = (app: AppItem) => {
    setSelectedApp(app);
  };
  
  // Handle event selection
  const handleEventSelect = (event: TriggerEvent) => {
    setSelectedEvent(event);
  };
  
  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave(steps);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Steps sidebar */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg border border-gray-200 p-4">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Workflow Steps</h3>
          <p className="text-gray-500 text-sm">Configure the steps in your workflow</p>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <WorkflowStep
              key={step.id}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
              isActive={activeStepId === step.id}
              onSelect={() => setActiveStepId(step.id)}
              onDelete={() => deleteStep(step.id)}
              onAddStep={index === steps.length - 1 ? () => addStep(step.id) : undefined}
            />
          ))}
        </div>
      </div>
      
      {/* Configuration panel */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200">
        {activeStepId && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="font-semibold text-lg">
                {activeStep?.type === "trigger" 
                  ? "Choose a Trigger" 
                  : "Choose an Action"}
              </h3>
              <p className="text-gray-500 text-sm">
                {activeStep?.type === "trigger" 
                  ? "Select the app and event that starts your workflow" 
                  : "Select what happens in this step"}
              </p>
            </div>
            
            {configStage === 'app' && (
              <AppSelector
                title="Select an App"
                description="Choose from the available apps"
                apps={mockApps}
                onSelectApp={handleAppSelect}
                selectedAppId={selectedApp?.id}
              />
            )}
            
            {configStage === 'event' && selectedApp && (
              <EventSelector
                title={activeStep?.type === "trigger" ? "Select a Trigger Event" : "Select an Action"}
                events={events}
                selectedEventId={selectedEvent?.id}
                onSelectEvent={handleEventSelect}
                appIcon={selectedApp.icon}
                appName={selectedApp.name}
                appColor={selectedApp.color}
              />
            )}
            
            {configStage === 'config' && selectedApp && selectedEvent && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-3">Configure {selectedEvent.name}</h4>
                <p className="text-sm text-gray-500 mb-4">Set up the details for this step</p>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center text-gray-500">
                  Configuration options for this step will appear here
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
