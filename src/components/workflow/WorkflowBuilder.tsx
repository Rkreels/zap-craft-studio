
import React, { useState } from "react";
import { WorkflowStepData } from "./WorkflowStep";
import { WorkflowBuilderCore } from "./WorkflowBuilderCore";
import { EnhancedTemplateLoader } from "./EnhancedTemplateLoader";
import { WorkflowTemplate } from "./TemplateGallery";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { toast } from "@/hooks/use-toast";

interface WorkflowBuilderProps {
  initialSteps?: WorkflowStepData[];
  onSave?: (steps: WorkflowStepData[]) => void;
  showTemplateLoader?: boolean;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ 
  initialSteps = [],
  onSave,
  showTemplateLoader = true
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
  const [isSaving, setIsSaving] = useState(false);
  
  const workflowVoiceProps = {
    elementName: "Workflow Builder",
    hoverText: "Build your workflow step by step, connecting apps and automating tasks.",
    clickText: "Configure each step to define what happens in your automation."
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(workflowVoiceProps);

  const validateWorkflow = (): boolean => {
    const unconfiguredSteps = steps.filter(step => !step.configured);
    
    if (unconfiguredSteps.length > 0) {
      toast({
        title: "Incomplete Workflow",
        description: `Please configure all steps before saving. ${unconfiguredSteps.length} step(s) need configuration.`,
        variant: "destructive",
      });
      return false;
    }
    
    if (steps.length < 2) {
      toast({
        title: "Incomplete Workflow", 
        description: "A workflow needs at least one trigger and one action step.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

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
    
    toast({
      title: "Step Added",
      description: "A new action step has been added to your workflow.",
    });
  };
  
  const deleteStep = (stepId: string) => {
    const stepToDelete = steps.find(step => step.id === stepId);
    
    if (stepToDelete?.type === "trigger") {
      toast({
        title: "Cannot Delete",
        description: "The trigger step cannot be deleted.",
        variant: "destructive",
      });
      return;
    }
    
    const newSteps = steps.filter(step => step.id !== stepId);
    setSteps(newSteps);
    
    if (activeStepId === stepId) {
      setActiveStepId(newSteps[0]?.id || "");
    }
    
    toast({
      title: "Step Removed",
      description: "The step has been removed from your workflow.",
    });
  };

  const handleSave = async () => {
    if (!validateWorkflow()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (onSave) {
        await onSave(steps);
      }
      
      toast({
        title: "Workflow Saved",
        description: "Your workflow has been saved successfully.",
      });
    } catch (error) {
      console.error('Failed to save workflow:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleTest = async () => {
    if (!validateWorkflow()) {
      return;
    }
    
    console.log("Testing workflow with steps:", steps);
    
    toast({
      title: "Test Started",
      description: "Testing your workflow... Check the console for results.",
    });
    
    // Simulate test execution
    setTimeout(() => {
      toast({
        title: "Test Completed",
        description: "Your workflow test has completed successfully.",
      });
    }, 2000);
  };

  const handleTemplateApply = async (template: WorkflowTemplate) => {
    if (template.steps && template.steps.length > 0) {
      setSteps(template.steps);
      setActiveStepId(template.steps[0]?.id || "");
      
      toast({
        title: "Template Applied",
        description: `"${template.name}" template has been loaded into your workflow.`,
      });
    }
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
        isSaving={isSaving}
        showTemplateLoader={showTemplateLoader}
        onTemplateApply={handleTemplateApply}
      />
    </div>
  );
};
