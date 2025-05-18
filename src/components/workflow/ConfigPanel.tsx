
import React from "react";
import { WorkflowStepData } from "./WorkflowStep";

interface ConfigPanelProps {
  activeStep?: WorkflowStepData;
  mockApps: Array<{ id: string; name: string; icon: string }>;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ activeStep, mockApps }) => {
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
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Select an App</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {mockApps.map(app => (
            <div 
              key={app.id}
              className="border border-gray-200 rounded-md p-3 flex flex-col items-center cursor-pointer hover:border-purple-300 hover:bg-purple-50"
            >
              <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-lg font-bold">
                {app.icon}
              </div>
              <p className="mt-2 text-sm font-medium">{app.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Example of what configuration might look like after app selection */}
      <div className="opacity-50">
        <h4 className="font-medium mb-2">Select a Trigger Event</h4>
        <div className="border border-gray-200 rounded-md p-3 mb-2 flex items-center cursor-not-allowed">
          <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold">
            G
          </div>
          <div className="ml-3">
            <p className="font-medium text-sm">New Email</p>
            <p className="text-xs text-gray-500">Triggers when a new email is received</p>
          </div>
        </div>
        <div className="border border-gray-200 rounded-md p-3 mb-2 flex items-center cursor-not-allowed">
          <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold">
            G
          </div>
          <div className="ml-3">
            <p className="font-medium text-sm">New Label</p>
            <p className="text-xs text-gray-500">Triggers when an email receives a new label</p>
          </div>
        </div>
        <div className="border border-gray-200 rounded-md p-3 flex items-center cursor-not-allowed">
          <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold">
            G
          </div>
          <div className="ml-3">
            <p className="font-medium text-sm">New Attachment</p>
            <p className="text-xs text-gray-500">Triggers when an email contains attachments</p>
          </div>
        </div>
      </div>
    </div>
  );
};
