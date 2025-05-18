
import React, { useState } from "react";
import { WorkflowStepData } from "./WorkflowStep";
import { WorkflowBuilderCore } from "./WorkflowBuilderCore";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";

interface WorkflowBuilderProps {
  initialSteps?: WorkflowStepData[];
  onSave?: (steps: WorkflowStepData[]) => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ 
  initialSteps = [],
  onSave
}) => {
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
  
  // Voice guidance for workflow builder
  const workflowVoiceProps = {
    elementName: "Workflow Builder",
    hoverText: "Build your workflow step by step, connecting apps and automating tasks.",
    clickText: "Configure each step to define what happens in your automation."
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(workflowVoiceProps);

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
  
  const handleTest = () => {
    console.log("Testing workflow with steps:", steps);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <WorkflowBuilderCore
        steps={steps}
        activeStepId={activeStepId}
        onStepSelect={setActiveStepId}
        onStepAdd={addStep}
        onStepDelete={deleteStep}
        onSave={handleSave}
        onTest={handleTest}
      />
    </div>
  );
};
