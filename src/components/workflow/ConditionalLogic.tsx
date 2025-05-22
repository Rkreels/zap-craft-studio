
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface Condition {
  id: string;
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "starts_with" | "ends_with" | "is_empty" | "is_not_empty";
  value: string;
}

export interface ConditionGroup {
  id: string;
  type: "all" | "any";
  conditions: Condition[];
  nestedGroups?: ConditionGroup[];
}

interface ConditionalLogicProps {
  conditionGroup: ConditionGroup;
  onChange: (conditionGroup: ConditionGroup) => void;
  availableFields?: { id: string; label: string }[];
  depth?: number;
}

export const ConditionalLogic: React.FC<ConditionalLogicProps> = ({
  conditionGroup,
  onChange,
  availableFields = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "date", label: "Date" },
    { id: "status", label: "Status" },
    { id: "amount", label: "Amount" },
    { id: "category", label: "Category" }
  ],
  depth = 0
}) => {
  const addCondition = () => {
    const newCondition: Condition = {
      id: `condition-${Date.now()}`,
      field: availableFields[0]?.id || "",
      operator: "equals",
      value: "",
    };

    onChange({
      ...conditionGroup,
      conditions: [...conditionGroup.conditions, newCondition],
    });
  };

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    onChange({
      ...conditionGroup,
      conditions: conditionGroup.conditions.map((condition) =>
        condition.id === id ? { ...condition, ...updates } : condition
      ),
    });
  };

  const removeCondition = (id: string) => {
    onChange({
      ...conditionGroup,
      conditions: conditionGroup.conditions.filter(
        (condition) => condition.id !== id
      ),
    });
  };

  const updateConditionType = (type: "all" | "any") => {
    onChange({
      ...conditionGroup,
      type,
    });
  };

  const addNestedGroup = () => {
    const newNestedGroup: ConditionGroup = {
      id: `group-${Date.now()}`,
      type: "all",
      conditions: [],
    };

    onChange({
      ...conditionGroup,
      nestedGroups: [...(conditionGroup.nestedGroups || []), newNestedGroup]
    });
  };

  const updateNestedGroup = (id: string, updatedGroup: ConditionGroup) => {
    onChange({
      ...conditionGroup,
      nestedGroups: (conditionGroup.nestedGroups || []).map(group =>
        group.id === id ? updatedGroup : group
      )
    });
  };

  const removeNestedGroup = (id: string) => {
    onChange({
      ...conditionGroup,
      nestedGroups: (conditionGroup.nestedGroups || []).filter(group => group.id !== id)
    });
  };

  return (
    <Card className="border-dashed border-gray-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{depth > 0 ? "And" : "If"}</span>
            <Select
              value={conditionGroup.type}
              onValueChange={(value: "all" | "any") => updateConditionType(value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all</SelectItem>
                <SelectItem value="any">any</SelectItem>
              </SelectContent>
            </Select>
            <span>conditions are met</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conditionGroup.conditions.length === 0 && 
           (!conditionGroup.nestedGroups || conditionGroup.nestedGroups.length === 0) ? (
            <div className="text-center py-3 text-gray-500">
              No conditions added yet
            </div>
          ) : (
            <div className="space-y-3">
              {conditionGroup.conditions.map((condition) => (
                <div key={condition.id} className="flex items-center gap-2">
                  <Select
                    value={condition.field}
                    onValueChange={(value) =>
                      updateCondition(condition.id, { field: value })
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={condition.operator}
                    onValueChange={(value: any) =>
                      updateCondition(condition.id, { operator: value })
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">equals</SelectItem>
                      <SelectItem value="not_equals">not equals</SelectItem>
                      <SelectItem value="contains">contains</SelectItem>
                      <SelectItem value="greater_than">greater than</SelectItem>
                      <SelectItem value="less_than">less than</SelectItem>
                      <SelectItem value="starts_with">starts with</SelectItem>
                      <SelectItem value="ends_with">ends with</SelectItem>
                      <SelectItem value="is_empty">is empty</SelectItem>
                      <SelectItem value="is_not_empty">is not empty</SelectItem>
                    </SelectContent>
                  </Select>

                  {!["is_empty", "is_not_empty"].includes(condition.operator) && (
                    <Input
                      className="flex-1"
                      value={condition.value}
                      onChange={(e) =>
                        updateCondition(condition.id, { value: e.target.value })
                      }
                      placeholder="Value"
                    />
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCondition(condition.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addCondition}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Condition
            </Button>

            {depth < 2 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addNestedGroup}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Condition Group
              </Button>
            )}
          </div>

          {conditionGroup.nestedGroups && conditionGroup.nestedGroups.length > 0 && (
            <Accordion type="multiple" className="w-full mt-4">
              {conditionGroup.nestedGroups.map((nestedGroup, index) => (
                <AccordionItem key={nestedGroup.id} value={nestedGroup.id}>
                  <AccordionTrigger className="text-sm">
                    Nested Condition Group {index + 1}: {nestedGroup.type === "all" ? "ALL" : "ANY"} conditions
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 pt-2 border-l-2 border-gray-200">
                      <ConditionalLogic
                        conditionGroup={nestedGroup}
                        onChange={(updatedGroup) => updateNestedGroup(nestedGroup.id, updatedGroup)}
                        availableFields={availableFields}
                        depth={depth + 1}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 text-red-500 hover:text-red-700"
                        onClick={() => removeNestedGroup(nestedGroup.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Group
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
