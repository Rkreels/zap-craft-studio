
import React from "react";
import { AppSelector } from "@/components/zap-creator/AppSelector";
import { EventSelector, TriggerEvent } from "@/components/zap-creator/EventSelector";
import { AppItem } from "@/components/zap-creator/AppSelector";
import { mockApps, getTriggerEventsForApp, getActionEventsForApp } from "@/data/mockApps";

interface StepConfigPanelProps {
  activeStep: any;
  configStage: 'app' | 'event' | 'config';
  selectedApp: AppItem | null;
  selectedEvent: TriggerEvent | null;
  events: TriggerEvent[];
  handleAppSelect: (app: AppItem) => void;
  handleEventSelect: (event: TriggerEvent) => void;
}

export const StepConfigPanel = ({
  activeStep,
  configStage,
  selectedApp,
  selectedEvent,
  events,
  handleAppSelect,
  handleEventSelect
}: StepConfigPanelProps) => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">
          {activeStep?.type === "trigger" 
            ? "Choose a Trigger" 
            : "Choose an Action"}
        </h3>
        <p className="text-gray-500 text-sm">
          {activeStep?.type === "trigger" 
            ? "Select the app and event that starts your workflow" 
            : "Select what happens in this step"}
        </p>
      </div>
      
      {configStage === 'app' && (
        <AppSelector
          title="Select an App"
          description="Choose from the available apps"
          apps={mockApps}
          onSelectApp={handleAppSelect}
          selectedAppId={selectedApp?.id}
        />
      )}
      
      {configStage === 'event' && selectedApp && (
        <EventSelector
          title={activeStep?.type === "trigger" ? "Select a Trigger Event" : "Select an Action"}
          events={events}
          selectedEventId={selectedEvent?.id}
          onSelectEvent={handleEventSelect}
          appIcon={selectedApp.icon}
          appName={selectedApp.name}
          appColor={selectedApp.color}
        />
      )}
      
      {configStage === 'config' && selectedApp && selectedEvent && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-3">Configure {selectedEvent.name}</h4>
          <p className="text-sm text-gray-500 mb-4">Set up the details for this step</p>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center text-gray-500">
            <p className="mb-2">Configuration options for {selectedEvent.name}</p>
            <p className="text-sm">Add required fields and settings for this step</p>
          </div>
        </div>
      )}
    </div>
  );
};
