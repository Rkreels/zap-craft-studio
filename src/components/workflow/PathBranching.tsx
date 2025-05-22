
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, ArrowRight, GitBranch, CornerRightDown } from "lucide-react";
import { WorkflowStepData } from "./WorkflowStep";
import { ConditionalLogic, ConditionGroup } from "./ConditionalLogic";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface BranchPath {
  id: string;
  name: string;
  conditions: ConditionGroup;
  steps: WorkflowStepData[];
}

interface PathBranchingProps {
  parentStepId: string;
  paths: BranchPath[];
  onAddPath: () => void;
  onDeletePath: (pathId: string) => void;
  onUpdatePathConditions: (pathId: string, conditions: ConditionGroup) => void;
  onPathStepClick: (pathId: string, stepId: string) => void;
  onAddStepToPath: (pathId: string) => void;
  activePathId: string | null;
  activeStepId: string | null;
}

export const PathBranching: React.FC<PathBranchingProps> = ({
  parentStepId,
  paths,
  onAddPath,
  onDeletePath,
  onUpdatePathConditions,
  onPathStepClick,
  onAddStepToPath,
  activePathId,
  activeStepId
}) => {
  const [expandedPathId, setExpandedPathId] = useState<string | null>(null);
  
  const togglePathExpansion = (pathId: string) => {
    setExpandedPathId(expandedPathId === pathId ? null : pathId);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Path Branching</CardTitle>
            <CardDescription>
              Create multiple paths based on conditions
            </CardDescription>
          </div>
          <Button onClick={onAddPath} variant="outline" size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Path
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {paths.length === 0 ? (
          <div className="text-center py-6 text-gray-500 border border-dashed rounded-md">
            <GitBranch className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No paths have been created yet</p>
            <p className="text-sm">Add a path to create branching logic</p>
          </div>
        ) : (
          <div className="space-y-6">
            {paths.map((path, index) => (
              <div 
                key={path.id}
                className="border rounded-md overflow-hidden"
              >
                <div 
                  className="p-3 bg-gray-50 border-b flex items-center justify-between cursor-pointer"
                  onClick={() => togglePathExpansion(path.id)}
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-medium text-sm mr-2">
                      {index + 1}
                    </div>
                    <span className="font-medium">
                      {path.name || `Path ${index + 1}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePath(path.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {(expandedPathId === path.id || activePathId === path.id) && (
                  <div className="p-3 space-y-4">
                    <div className="space-y-3">
                      <Label>If:</Label>
                      <ConditionalLogic
                        conditionGroup={path.conditions}
                        onChange={(conditions) => onUpdatePathConditions(path.id, conditions)}
                      />
                    </div>
                    
                    <div>
                      <Label>Then:</Label>
                      <div className="mt-2 space-y-3 pl-4 border-l-2 border-gray-200">
                        {path.steps.map((step, stepIndex) => (
                          <div key={step.id} className="flex items-center">
                            {stepIndex > 0 && (
                              <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                            )}
                            <div 
                              className={`
                                flex-1 p-2 border rounded cursor-pointer
                                ${activeStepId === step.id ? 'border-purple-500 bg-purple-50' : 'hover:bg-gray-50'}
                              `}
                              onClick={() => onPathStepClick(path.id, step.id)}
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-2">
                                  {step.appName?.charAt(0) || "?"}
                                </div>
                                <span>{step.actionName}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-8"
                          onClick={() => onAddStepToPath(path.id)}
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Add Step
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
