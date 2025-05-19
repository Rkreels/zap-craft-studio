
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export const CommandsSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen size={20} className="mr-2" />
          Voice Command Reference
        </CardTitle>
        <CardDescription>Complete list of all available voice commands</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Navigation Commands</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Go to dashboard</p>
                <p className="text-sm text-gray-500">Navigates to the dashboard page</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Open workflow builder</p>
                <p className="text-sm text-gray-500">Opens the workflow creation page</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Show my connected apps</p>
                <p className="text-sm text-gray-500">Takes you to connected applications</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">View my interfaces</p>
                <p className="text-sm text-gray-500">Opens the interfaces page</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Workflow Commands</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Create a new trigger</p>
                <p className="text-sm text-gray-500">Adds a new trigger to the workflow</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Add action step</p>
                <p className="text-sm text-gray-500">Adds a new action to the workflow</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Save workflow</p>
                <p className="text-sm text-gray-500">Saves the current workflow</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Test my workflow</p>
                <p className="text-sm text-gray-500">Runs a test of the current workflow</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Data Transformation Commands</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Create a new formula</p>
                <p className="text-sm text-gray-500">Opens the formula editor</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Add concat function</p>
                <p className="text-sm text-gray-500">Inserts a CONCAT function</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Save my formula</p>
                <p className="text-sm text-gray-500">Saves the current formula</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Test formula</p>
                <p className="text-sm text-gray-500">Tests the current formula</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Interface Commands</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Create new form</p>
                <p className="text-sm text-gray-500">Creates a new form interface</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Edit selected interface</p>
                <p className="text-sm text-gray-500">Opens the editor for the currently selected interface</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Publish interface</p>
                <p className="text-sm text-gray-500">Publishes the current interface</p>
              </div>
              <div className="border rounded p-3">
                <p className="font-medium mb-1">Show interfaces list</p>
                <p className="text-sm text-gray-500">Shows the list of interfaces</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
