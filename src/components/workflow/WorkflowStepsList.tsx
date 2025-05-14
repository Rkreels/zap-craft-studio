
import React from "react";
import { WorkflowStep, WorkflowStepData } from "./WorkflowStep";

interface WorkflowStepsListProps {
  steps: WorkflowStepData[];
  activeStepId: string;
  setActiveStepId: (id: string) => void;
  deleteStep: (id: string) => void;
  addStep: (afterStepId: string) => void;
}

export const WorkflowStepsList = ({
  steps,
  activeStepId,
  setActiveStepId,
  deleteStep,
  addStep
}: WorkflowStepsListProps) => {
  return (
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
  );
};
