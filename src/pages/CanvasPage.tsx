
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, Info } from 'lucide-react';

export default function CanvasPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Process Canvas</h1>
          <p className="text-gray-500">Visualize and design your workflow processes</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            Beta Feature
          </Badge>
          <Button variant="outline">Import</Button>
          <Button>Create New Canvas</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenTool className="mr-2" size={20} />
              Canvas Builder
            </CardTitle>
            <CardDescription>
              Design your workflow processes visually with our canvas tool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                <PenTool size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Create Your First Canvas</h3>
              <p className="text-gray-500 max-w-md mb-6">
                Visualize your processes, map workflows, and collaborate with your team using our visual canvas builder.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline">Browse Templates</Button>
                <Button>Start from Scratch</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Canvas Templates</CardTitle>
            <CardDescription>
              Get started quickly with pre-built canvas templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer">
                <h3 className="font-medium mb-2">Customer Journey</h3>
                <p className="text-sm text-gray-600 mb-3">Map the entire customer experience with your product</p>
                <div className="h-24 bg-gray-100 rounded flex items-center justify-center mb-2">
                  <span className="text-sm text-gray-400">Preview</span>
                </div>
              </div>
              
              <div className="border rounded-md p-4 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer">
                <h3 className="font-medium mb-2">BPMN Process</h3>
                <p className="text-sm text-gray-600 mb-3">Business Process Model and Notation compliant diagrams</p>
                <div className="h-24 bg-gray-100 rounded flex items-center justify-center mb-2">
                  <span className="text-sm text-gray-400">Preview</span>
                </div>
              </div>
              
              <div className="border rounded-md p-4 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer">
                <h3 className="font-medium mb-2">Software Architecture</h3>
                <p className="text-sm text-gray-600 mb-3">Design system components and their relationships</p>
                <div className="h-24 bg-gray-100 rounded flex items-center justify-center mb-2">
                  <span className="text-sm text-gray-400">Preview</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2" size={20} />
              Getting Started Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">1. Create a new canvas</h3>
                <p className="text-sm text-gray-600">Start with a blank canvas or choose from our templates</p>
              </div>
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">2. Add elements</h3>
                <p className="text-sm text-gray-600">Drag and drop shapes from the sidebar to build your process</p>
              </div>
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">3. Connect elements</h3>
                <p className="text-sm text-gray-600">Use connectors to show relationships between elements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
