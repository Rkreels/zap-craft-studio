
import React from "react";
import { cn } from "@/lib/utils";
import { Trash, ArrowRight } from "lucide-react";
import { AppItem } from "@/components/zap-creator/AppSelector";
import { TriggerEvent } from "@/components/zap-creator/EventSelector";
import { mockApps } from "@/data/mockApps";

export interface WorkflowStepData {
  id: string;
  type: "trigger" | "action" | "filter";
  appId: string;
  appName: string;
  actionName: string;
  configured: boolean;
  config: Record<string, any>;
  eventId?: string;
}

interface WorkflowStepProps {
  step: WorkflowStepData;
  index: number;
  isLast: boolean;
  isActive: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onAddStep?: () => void;
}

export const WorkflowStep = ({ 
  step, 
  index, 
  isLast, 
  isActive,
  onSelect,
  onDelete,
  onAddStep
}: WorkflowStepProps) => {
  // Find the app details from mockApps
  const app = mockApps.find(a => a.id === step.appId);
  const appColor = app?.color || "bg-gray-100";
  
  return (
    <div className="flex flex-col">
      <div 
        className={cn(
          "rounded-md p-3 cursor-pointer border transition-all",
          isActive 
            ? "border-purple-500 bg-purple-50" 
            : "border-gray-200 hover:bg-gray-50"
        )}
        onClick={onSelect}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={cn("w-8 h-8 rounded-md flex items-center justify-center text-white font-bold", appColor)}>
              {app?.icon || "?"}
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
          
          {step.type !== "trigger" && onDelete && (
            <button 
              className="text-gray-400 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash size={16} />
            </button>
          )}
        </div>
      </div>
      
      {!isLast && (
        <div className="flex justify-center py-2">
          <ArrowRight size={16} className="text-gray-400" />
        </div>
      )}
      
      {isLast && onAddStep && (
        <button 
          className="mt-3 flex items-center justify-center text-purple-600 hover:bg-purple-50 border border-dashed border-purple-300 rounded-md p-2"
          onClick={onAddStep}
        >
          <span className="text-sm font-medium">Add step</span>
        </button>
      )}
    </div>
  );
};
