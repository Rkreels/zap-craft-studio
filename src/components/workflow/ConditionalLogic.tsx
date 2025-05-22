
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
import { PlusCircle, Trash2 } from "lucide-react";

export interface Condition {
  id: string;
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: string;
}

export interface ConditionGroup {
  id: string;
  type: "all" | "any";
  conditions: Condition[];
}

interface ConditionalLogicProps {
  conditionGroup: ConditionGroup;
  onChange: (conditionGroup: ConditionGroup) => void;
  availableFields?: { id: string; label: string }[];
}

export const ConditionalLogic: React.FC<ConditionalLogicProps> = ({
  conditionGroup,
  onChange,
  availableFields = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "date", label: "Date" },
    { id: "status", label: "Status" },
  ],
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

  return (
    <Card className="border-dashed border-gray-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>If</span>
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
          {conditionGroup.conditions.length === 0 ? (
            <div className="text-center py-3 text-gray-500">
              No conditions added yet
            </div>
          ) : (
            conditionGroup.conditions.map((condition) => (
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
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">equals</SelectItem>
                    <SelectItem value="not_equals">not equals</SelectItem>
                    <SelectItem value="contains">contains</SelectItem>
                    <SelectItem value="greater_than">greater than</SelectItem>
                    <SelectItem value="less_than">less than</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  className="flex-1"
                  value={condition.value}
                  onChange={(e) =>
                    updateCondition(condition.id, { value: e.target.value })
                  }
                  placeholder="Value"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCondition(condition.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}

          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={addCondition}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
