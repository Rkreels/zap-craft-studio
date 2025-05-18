
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings, Trash, Save, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkflowStepData } from "./WorkflowStep";
import { ConfigPanel } from "./ConfigPanel";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";

interface WorkflowBuilderCoreProps {
  steps: WorkflowStepData[];
  activeStepId: string;
  onStepSelect: (id: string) => void;
  onStepAdd: (afterStepId: string) => void;
  onStepDelete: (stepId: string) => void;
  onSave: () => void;
  onTest: () => void;
}

export const WorkflowBuilderCore: React.FC<WorkflowBuilderCoreProps> = ({
  steps,
  activeStepId,
  onStepSelect,
  onStepAdd,
  onStepDelete,
  onSave,
  onTest
}) => {
  // Voice guidance
  const workflowVoiceProps = {
    elementName: "Workflow Builder",
    hoverText: "Build your workflow by connecting apps and actions in a visual builder.",
    clickText: "Create automated workflows with triggers, actions, and filters."
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(workflowVoiceProps);
  
  // Generate mock apps
  const mockApps = [
    { id: "gmail", name: "Gmail", icon: "G" },
    { id: "slack", name: "Slack", icon: "S" },
    { id: "sheets", name: "Google Sheets", icon: "Sh" },
    { id: "trello", name: "Trello", icon: "T" },
    { id: "twitter", name: "Twitter", icon: "Tw" },
  ];

  return (
    <div 
      className="flex flex-col lg:flex-row gap-4"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
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
                onClick={() => onStepSelect(step.id)}
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
                        onStepDelete(step.id);
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
                  onClick={() => onStepAdd(step.id)}
                >
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
          <ConfigPanel 
            activeStep={steps.find(s => s.id === activeStepId)}
            mockApps={mockApps} 
          />
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
          <Button variant="outline" size="sm" onClick={onTest}>
            <Play size={16} className="mr-1" />
            Test
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={onSave}>
            <Save size={16} className="mr-1" />
            Save & Turn On
          </Button>
        </div>
      </div>
    </div>
  );
};
