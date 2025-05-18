
import React from "react";
import { AudioTrainer } from "@/components/voice-assistant/AudioTrainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { BookOpen, Info, Mic, Volume } from "lucide-react";

export default function VoiceTrainingPage() {
  const [activeTab, setActiveTab] = React.useState("trainer");

  // Voice guidance for this page
  const voiceGuidanceProps = {
    elementName: "Voice Training Page",
    hoverText: "Learn to control the application using voice commands",
    clickText: "Train yourself to use voice commands for common tasks"
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(voiceGuidanceProps);

  return (
    <div 
      className="container mx-auto py-6 space-y-6"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <div>
        <h1 className="text-2xl font-bold">Voice Assistant Training</h1>
        <p className="text-gray-500">Learn to use voice commands to control the application</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="trainer">
            <Mic size={16} className="mr-2" />
            Trainer
          </TabsTrigger>
          <TabsTrigger value="commands">
            <BookOpen size={16} className="mr-2" />
            Commands
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Volume size={16} className="mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trainer" className="mt-6">
          <AudioTrainer />
        </TabsContent>

        <TabsContent value="commands" className="mt-6">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume size={20} className="mr-2" />
                Voice Assistant Settings
              </CardTitle>
              <CardDescription>Configure your voice assistant preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <Info size={20} className="text-yellow-600 mr-2" />
                <p className="text-sm">
                  Voice assistant functionality requires an ElevenLabs API key. 
                  <a href="https://elevenlabs.io" className="text-purple-600 hover:underline ml-1" target="_blank" rel="noreferrer">
                    Get your API key
                  </a>
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Voice Settings</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-sm text-gray-500">Voice Type</label>
                        <select className="w-full border rounded p-2">
                          <option>Bella (Female)</option>
                          <option>Adam (Male)</option>
                          <option>Sam (Neutral)</option>
                        </select>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm text-gray-500">Speech Rate</label>
                        <input type="range" className="w-full" min="0.5" max="1.5" step="0.1" defaultValue="1" />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm text-gray-500">Volume</label>
                        <input type="range" className="w-full" min="0" max="1" step="0.1" defaultValue="0.8" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Assistant Settings</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-sm text-gray-500">Wake Word</label>
                        <input type="text" className="w-full border rounded p-2" defaultValue="Hey Assistant" />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm text-gray-500">Listening Timeout (seconds)</label>
                        <input type="number" className="w-full border rounded p-2" min="5" max="30" defaultValue="10" />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="auto-listen" defaultChecked />
                        <label htmlFor="auto-listen" className="text-sm">Auto-listen after response</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">API Configuration</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-500">ElevenLabs API Key</label>
                      <input type="password" className="w-full border rounded p-2" placeholder="Enter your API key" />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm text-gray-500">Model</label>
                      <select className="w-full border rounded p-2">
                        <option>Turbo</option>
                        <option>Standard</option>
                        <option>Enhanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
