
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Plus, ArrowRight, Settings, Trash, Save, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type StepType = "trigger" | "action" | "filter";

interface WorkflowStep {
  id: string;
  type: StepType;
  appId: string;
  appName: string;
  actionName: string;
  configured: boolean;
  config: Record<string, any>;
}

interface WorkflowBuilderProps {
  initialSteps?: WorkflowStep[];
  onSave?: (steps: WorkflowStep[]) => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ 
  initialSteps = [],
  onSave
}) => {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps.length ? initialSteps : [
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
  
  // Generate mock apps
  const mockApps = [
    { id: "gmail", name: "Gmail", icon: "G" },
    { id: "slack", name: "Slack", icon: "S" },
    { id: "sheets", name: "Google Sheets", icon: "Sh" },
    { id: "trello", name: "Trello", icon: "T" },
    { id: "twitter", name: "Twitter", icon: "Tw" },
  ];

  const addStep = (afterStepId: string) => {
    const newStepId = `action-${Date.now()}`;
    const afterIndex = steps.findIndex(step => step.id === afterStepId);
    
    const newStep: WorkflowStep = {
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
  };

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
            <div key={step.id} className="flex flex-col">
              <div 
                className={cn(
                  "rounded-md p-3 cursor-pointer border",
                  activeStepId === step.id 
                    ? "border-purple-500 bg-purple-50" 
                    : "border-gray-200 hover:bg-gray-50"
                )}
                onClick={() => setActiveStepId(step.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold">
                      {step.appName ? step.appName.substring(0, 1) : "?"}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-sm">
                        {step.type === "trigger" ? "Trigger" : `Action ${index}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {step.appName ? `${step.appName}: ${step.actionName}` : step.actionName}
                      </p>
                    </div>
                  </div>
                  
                  {step.type !== "trigger" && (
                    <button 
                      className="text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStep(step.id);
                      }}
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight size={16} className="text-gray-400" />
                </div>
              )}
              
              {index === steps.length - 1 && (
                <button 
                  className="mt-3 flex items-center justify-center text-purple-600 hover:bg-purple-50 border border-dashed border-purple-300 rounded-md p-2"
                  onClick={() => addStep(step.id)}
                >
                  <Plus size={16} className="mr-1" />
                  <span className="text-sm font-medium">Add step</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Configuration panel */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200">
        {activeStepId && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="font-semibold text-lg">
                {steps.find(s => s.id === activeStepId)?.type === "trigger" 
                  ? "Choose a Trigger" 
                  : "Choose an Action"}
              </h3>
              <p className="text-gray-500 text-sm">
                {steps.find(s => s.id === activeStepId)?.type === "trigger" 
                  ? "Select the app and event that starts your workflow" 
                  : "Select what happens in this step"}
              </p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Select an App</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {mockApps.map(app => (
                  <div 
                    key={app.id}
                    className="border border-gray-200 rounded-md p-3 flex flex-col items-center cursor-pointer hover:border-purple-300 hover:bg-purple-50"
                  >
                    <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-lg font-bold">
                      {app.icon}
                    </div>
                    <p className="mt-2 text-sm font-medium">{app.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Example of what configuration might look like after app selection */}
            <div className="opacity-50">
              <h4 className="font-medium mb-2">Select a Trigger Event</h4>
              <div className="border border-gray-200 rounded-md p-3 mb-2 flex items-center cursor-not-allowed">
                <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold">
                  G
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm">New Email</p>
                  <p className="text-xs text-gray-500">Triggers when a new email is received</p>
                </div>
              </div>
              <div className="border border-gray-200 rounded-md p-3 mb-2 flex items-center cursor-not-allowed">
                <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold">
                  G
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm">New Label</p>
                  <p className="text-xs text-gray-500">Triggers when an email receives a new label</p>
                </div>
              </div>
              <div className="border border-gray-200 rounded-md p-3 flex items-center cursor-not-allowed">
                <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold">
                  G
                </div>
                <div className="ml-3">
                  <p className="font-medium text-sm">New Attachment</p>
                  <p className="text-xs text-gray-500">Triggers when an email contains attachments</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings size={16} className="mr-1" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash size={16} className="mr-1" />
            Delete
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Play size={16} className="mr-1" />
            Test
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSave}>
            <Save size={16} className="mr-1" />
            Save & Turn On
          </Button>
        </div>
      </div>
    </div>
  );
};
