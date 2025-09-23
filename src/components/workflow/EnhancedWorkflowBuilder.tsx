
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowStepData } from "./WorkflowStep";
import { WorkflowStepsList } from "./WorkflowStepsList";
import { StepConfigPanel } from "./StepConfigPanel";
import { EnhancedTemplateLoader } from "./EnhancedTemplateLoader";
import { WorkflowTemplate } from "./TemplateGallery";
import { ScheduleBuilder, ScheduleConfig } from "./ScheduleBuilder";
import { AppItem } from "@/components/zap-creator/AppSelector";
import { TriggerEvent } from "@/components/zap-creator/EventSelector";
import { mockApps, getTriggerEventsForApp, getActionEventsForApp } from "@/data/mockApps";
import { toast } from "@/components/ui/use-toast";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { ConditionalLogic, ConditionGroup } from "./ConditionalLogic";
import { ErrorHandling, ErrorHandlingConfig } from "./ErrorHandling";
import { WebhookIntegration, WebhookConfig } from "./WebhookIntegration";
import { DataTransformer, DataTransformConfig } from "./DataTransformer";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

interface EnhancedWorkflowBuilderProps {
  onSave?: (steps: WorkflowStepData[], schedule?: ScheduleConfig) => void;
  initialSteps?: WorkflowStepData[];
  initialSchedule?: ScheduleConfig;
  showTemplateLoader?: boolean;
}

export const EnhancedWorkflowBuilder = ({
  onSave,
  initialSteps = [],
  initialSchedule,
  showTemplateLoader = true
}: EnhancedWorkflowBuilderProps) => {
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
  
  const [activeTab, setActiveTab] = useState("workflow");
  const [configTab, setConfigTab] = useState("basic");
  const [activeStepId, setActiveStepId] = useState<string>(steps[0]?.id || "");
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TriggerEvent | null>(null);
  const [configStage, setConfigStage] = useState<'app' | 'event' | 'config'>('app');
  const [schedule, setSchedule] = useState<ScheduleConfig | undefined>(initialSchedule);
  const [conditionalLogic, setConditionalLogic] = useState<ConditionGroup>({
    id: "main-condition",
    type: "all",
    conditions: []
  });
  const [errorHandling, setErrorHandling] = useState<ErrorHandlingConfig>({
    retryEnabled: false,
    maxRetries: 3,
    retryDelay: 60,
    notifyOnError: true,
    stopWorkflowOnError: true
  });
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>({
    url: "",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    bodyTemplate: ""
  });
  const [dataTransformConfig, setDataTransformConfig] = useState<DataTransformConfig>({
    mappings: [],
    rawMode: false,
    customCode: ""
  });
  
  const isMobile = useIsMobile();
  
  // Voice guidance for workflow builder
  const builderVoiceProps = {
    elementName: "Workflow Builder",
    hoverText: "Build your workflow by adding trigger and action steps with advanced options for conditions and error handling.",
    clickText: "Configure each step to create an automated workflow with robust error handling and data transformation."
  };
  const builderGuidance = useVoiceGuidance(builderVoiceProps);
  
  // Get the active step
  const activeStep = steps.find(step => step.id === activeStepId) || steps[0];
  const activeStepIndex = steps.findIndex(step => step.id === activeStepId);
  
  // Get events for the selected app
  const events = activeStep?.type === 'trigger' 
    ? getTriggerEventsForApp(selectedApp?.id || '') 
    : getActionEventsForApp(selectedApp?.id || '');
  
  // Sample fields for data transformation
  const sourceFields = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "status", label: "Status" },
    { id: "created_at", label: "Created At" }
  ];
  
  const targetFields = [
    { id: "customer_name", label: "Customer Name" },
    { id: "customer_email", label: "Customer Email" },
    { id: "contact", label: "Contact" },
    { id: "user_status", label: "User Status" },
    { id: "registration_date", label: "Registration Date" }
  ];
  
  // Reset selected event when app changes
  useEffect(() => {
    setSelectedEvent(null);
    
    if (selectedApp) {
      setConfigStage('event');
    } else {
      setConfigStage('app');
    }
  }, [selectedApp]);
  
  // Update step when event is selected
  useEffect(() => {
    if (selectedApp && selectedEvent) {
      const updatedSteps = steps.map(step => {
        if (step.id === activeStepId) {
          return {
            ...step,
            appId: selectedApp.id,
            appName: selectedApp.name,
            actionName: selectedEvent.name,
            eventId: selectedEvent.id,
            configured: true
          };
        }
        return step;
      });
      
      setSteps(updatedSteps);
      setConfigStage('config');
      
      if (onSave) {
        onSave(updatedSteps, schedule);
      }
      
      toast({
        title: "Step configured",
        description: `${selectedApp.name} ${selectedEvent.name} has been configured.`,
      });
    }
  }, [selectedEvent, selectedApp, activeStepId]);
  
  // Set the selectedApp when the active step changes
  useEffect(() => {
    if (activeStep?.appId) {
      const app = mockApps.find(app => app.id === activeStep.appId);
      if (app) {
        setSelectedApp(app);
        
        if (activeStep.eventId) {
          const events = activeStep.type === 'trigger' 
            ? getTriggerEventsForApp(app.id) 
            : getActionEventsForApp(app.id);
            
          const event = events.find(e => e.id === activeStep.eventId);
          if (event) {
            setSelectedEvent(event);
            setConfigStage('config');
          } else {
            setConfigStage('event');
          }
        } else {
          setConfigStage('event');
        }
      } else {
        setSelectedApp(null);
        setConfigStage('app');
      }
    } else {
      setSelectedApp(null);
      setSelectedEvent(null);
      setConfigStage('app');
    }
  }, [activeStepId]);
  
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
    setSelectedApp(null);
    setSelectedEvent(null);
    setConfigStage('app');
    
    if (onSave) {
      onSave(newSteps, schedule);
    }
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
    
    if (onSave) {
      onSave(newSteps, schedule);
    }
    
    toast({
      title: "Step removed",
      description: "The step has been removed from your workflow.",
    });
  };
  
  // Handle app selection
  const handleAppSelect = (app: AppItem) => {
    setSelectedApp(app);
  };
  
  // Handle event selection
  const handleEventSelect = (event: TriggerEvent) => {
    setSelectedEvent(event);
  };
  
  // Handle schedule update
  const handleScheduleUpdate = (newSchedule: ScheduleConfig) => {
    setSchedule(newSchedule);
    
    if (onSave) {
      onSave(steps, newSchedule);
    }
  };
  
  // Handle conditional logic update
  const handleConditionalLogicUpdate = (newConditionGroup: ConditionGroup) => {
    setConditionalLogic(newConditionGroup);
    
    // Update the step's config
    const updatedSteps = steps.map(step => {
      if (step.id === activeStepId) {
        return {
          ...step,
          config: {
            ...step.config,
            conditions: newConditionGroup
          }
        };
      }
      return step;
    });
    
    setSteps(updatedSteps);
    
    if (onSave) {
      onSave(updatedSteps, schedule);
    }
  };
  
  // Handle error handling update
  const handleErrorHandlingUpdate = (newErrorHandling: ErrorHandlingConfig) => {
    setErrorHandling(newErrorHandling);
    
    // Update the step's config
    const updatedSteps = steps.map(step => {
      if (step.id === activeStepId) {
        return {
          ...step,
          config: {
            ...step.config,
            errorHandling: newErrorHandling
          }
        };
      }
      return step;
    });
    
    setSteps(updatedSteps);
    
    if (onSave) {
      onSave(updatedSteps, schedule);
    }
  };
  
  // Handle webhook config update
  const handleWebhookConfigUpdate = (newWebhookConfig: WebhookConfig) => {
    setWebhookConfig(newWebhookConfig);
    
    // Update the step's config
    const updatedSteps = steps.map(step => {
      if (step.id === activeStepId) {
        return {
          ...step,
          config: {
            ...step.config,
            webhook: newWebhookConfig
          }
        };
      }
      return step;
    });
    
    setSteps(updatedSteps);
    
    if (onSave) {
      onSave(updatedSteps, schedule);
    }
  };
  
  // Handle data transform update
  const handleDataTransformUpdate = (newDataTransformConfig: DataTransformConfig) => {
    setDataTransformConfig(newDataTransformConfig);
    
    // Update the step's config
    const updatedSteps = steps.map(step => {
      if (step.id === activeStepId) {
        return {
          ...step,
          config: {
            ...step.config,
            dataTransform: newDataTransformConfig
          }
        };
      }
      return step;
    });
    
    setSteps(updatedSteps);
    
    if (onSave) {
      onSave(updatedSteps, schedule);
    }
  };

  // Handle template apply
  const handleTemplateApply = async (template: WorkflowTemplate) => {
    if (template.steps && template.steps.length > 0) {
      setSteps(template.steps);
      setActiveStepId(template.steps[0]?.id || "");
      
      // Reset configuration state
      setSelectedApp(null);
      setSelectedEvent(null);
      setConfigStage('app');
      
      toast({
        title: "Template Applied",
        description: `"${template.name}" template has been loaded into your workflow.`,
      });
      
      if (onSave) {
        onSave(template.steps, schedule);
      }
    }
  };

  return (
    <div 
      className="space-y-4"
      onMouseEnter={builderGuidance.handleMouseEnter}
      onClick={builderGuidance.handleClick}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="workflow">Workflow Steps</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workflow">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Steps sidebar */}
            <div className="w-full lg:w-1/3 bg-white rounded-lg border border-gray-200 p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Workflow Steps</h3>
                    <p className="text-gray-500 text-sm">Configure the steps in your workflow</p>
                  </div>
                  {showTemplateLoader && (
                    <EnhancedTemplateLoader 
                      onTemplateApply={handleTemplateApply}
                      trigger={
                        <button className="text-sm px-3 py-1 border rounded-md hover:bg-gray-50 flex items-center gap-1">
                          <span>📁</span> Templates
                        </button>
                      }
                    />
                  )}
                </div>
              </div>

              <WorkflowStepsList 
                steps={steps}
                activeStepId={activeStepId}
                setActiveStepId={setActiveStepId}
                deleteStep={deleteStep}
                addStep={addStep}
              />
            </div>
            
            {/* Configuration panel */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200">
              {activeStepId && (
                <div className="p-4">
                  {/* Basic configuration first */}
                  <StepConfigPanel
                    activeStep={activeStep}
                    configStage={configStage}
                    selectedApp={selectedApp}
                    selectedEvent={selectedEvent}
                    events={events}
                    handleAppSelect={handleAppSelect}
                    handleEventSelect={handleEventSelect}
                  />
                  
                  {/* Show advanced options only if the step is configured */}
                  {activeStep.configured && (
                    <div className="mt-6">
                      <Tabs value={configTab} onValueChange={setConfigTab}>
                        <TabsList className="w-full">
                          <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
                          <TabsTrigger value="conditions" className="flex-1">Conditions</TabsTrigger>
                          <TabsTrigger value="transform" className="flex-1">Transform Data</TabsTrigger>
                          <TabsTrigger value="error" className="flex-1">Error Handling</TabsTrigger>
                          {activeStep.type === 'trigger' && (
                            <TabsTrigger value="webhook" className="flex-1">Webhook</TabsTrigger>
                          )}
                        </TabsList>
                        
                        <TabsContent value="basic">
                          <div className="py-4">
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Basic Configuration</AlertTitle>
                              <AlertDescription>
                                The basic configuration for this step is already complete. Use the tabs above to configure advanced options.
                              </AlertDescription>
                            </Alert>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="conditions">
                          <div className="py-4">
                            <ConditionalLogic
                              conditionGroup={activeStep.config.conditions || conditionalLogic}
                              onChange={handleConditionalLogicUpdate}
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="transform">
                          <div className="py-4">
                            <DataTransformer
                              config={activeStep.config.dataTransform || dataTransformConfig}
                              onChange={handleDataTransformUpdate}
                              sourceFields={sourceFields}
                              targetFields={targetFields}
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="error">
                          <div className="py-4">
                            <ErrorHandling
                              config={activeStep.config.errorHandling || errorHandling}
                              onChange={handleErrorHandlingUpdate}
                            />
                          </div>
                        </TabsContent>
                        
                        {activeStep.type === 'trigger' && (
                          <TabsContent value="webhook">
                            <div className="py-4">
                              <WebhookIntegration
                                config={activeStep.config.webhook || webhookConfig}
                                onChange={handleWebhookConfigUpdate}
                                generatedWebhookUrl={`https://api.example.com/webhooks/${activeStepId}`}
                              />
                            </div>
                          </TabsContent>
                        )}
                      </Tabs>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Execution</CardTitle>
              <CardDescription>
                Configure when this workflow should run automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScheduleBuilder 
                onSave={handleScheduleUpdate}
                initialSchedule={schedule}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
