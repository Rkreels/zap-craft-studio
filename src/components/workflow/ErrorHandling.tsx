
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

export interface ErrorHandlingConfig {
  retryEnabled: boolean;
  maxRetries: number;
  retryDelay: number;
  notifyOnError: boolean;
  fallbackAction?: string;
  stopWorkflowOnError: boolean;
}

interface ErrorHandlingProps {
  config: ErrorHandlingConfig;
  onChange: (config: ErrorHandlingConfig) => void;
}

export const ErrorHandling: React.FC<ErrorHandlingProps> = ({ 
  config, 
  onChange 
}) => {
  const updateConfig = <K extends keyof ErrorHandlingConfig>(
    key: K, 
    value: ErrorHandlingConfig[K]
  ) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="error-handling">
        <AccordionTrigger>Error Handling & Retries</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="retry-toggle">Enable automatic retries</Label>
              <Switch 
                id="retry-toggle" 
                checked={config.retryEnabled}
                onCheckedChange={(checked) => updateConfig("retryEnabled", checked)}
              />
            </div>
            
            {config.retryEnabled && (
              <div className="space-y-3 pl-2 border-l-2 border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-retries">Maximum retries</Label>
                    <Select 
                      value={config.maxRetries.toString()}
                      onValueChange={(value) => updateConfig("maxRetries", parseInt(value))}
                    >
                      <SelectTrigger id="max-retries">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 5, 10].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retry-delay">Delay between retries (seconds)</Label>
                    <Select 
                      value={config.retryDelay.toString()}
                      onValueChange={(value) => updateConfig("retryDelay", parseInt(value))}
                    >
                      <SelectTrigger id="retry-delay">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[30, 60, 300, 600, 1800, 3600].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num === 60 ? "1 minute" : 
                             num === 300 ? "5 minutes" : 
                             num === 600 ? "10 minutes" : 
                             num === 1800 ? "30 minutes" : 
                             num === 3600 ? "1 hour" : 
                             `${num} seconds`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-toggle">Notify on error</Label>
              <Switch 
                id="notify-toggle" 
                checked={config.notifyOnError}
                onCheckedChange={(checked) => updateConfig("notifyOnError", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="stop-workflow-toggle">Stop workflow on error</Label>
              <Switch 
                id="stop-workflow-toggle" 
                checked={config.stopWorkflowOnError}
                onCheckedChange={(checked) => updateConfig("stopWorkflowOnError", checked)}
              />
            </div>
            
            {!config.stopWorkflowOnError && (
              <div className="space-y-2">
                <Label htmlFor="fallback-action">Fallback action</Label>
                <Select 
                  value={config.fallbackAction || ""}
                  onValueChange={(value) => updateConfig("fallbackAction", value)}
                >
                  <SelectTrigger id="fallback-action">
                    <SelectValue placeholder="Select a fallback action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skip">Skip this step</SelectItem>
                    <SelectItem value="alternative">Use alternative path</SelectItem>
                    <SelectItem value="notify">Notify only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
