
import React, { useState } from "react";
import { EnhancedAudioTrainer } from "@/components/voice-assistant/EnhancedAudioTrainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { BookOpen, Info, Mic, Volume } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function VoiceTrainingPage() {
  const [activeTab, setActiveTab] = useState("trainer");
  const [apiKey, setApiKey] = useState("");
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);

  // Voice guidance for this page
  const voiceGuidanceProps = {
    elementName: "Voice Training Page",
    hoverText: "Learn to control the application using voice commands",
    clickText: "Train yourself to use voice commands for common tasks"
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(voiceGuidanceProps);

  const handleTrainingComplete = () => {
    setIsTrainingCompleted(true);
  };

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
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mic size={20} className="mr-2" />
                Voice Command Training
              </CardTitle>
              <CardDescription>
                {isTrainingCompleted 
                  ? "Training completed! Try out your voice commands anywhere in the app."
                  : "Follow the steps below to learn how to use voice commands with our application."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isTrainingCompleted ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                  <div className="flex items-center">
                    <Badge className="bg-green-500">Completed</Badge>
                    <p className="ml-2 text-green-700">You've successfully completed the voice training!</p>
                  </div>
                </div>
              ) : apiKey ? (
                <EnhancedAudioTrainer onTrainingComplete={handleTrainingComplete} />
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex items-start">
                      <Info className="text-yellow-600 mt-0.5 mr-2" size={18} />
                      <div>
                        <h3 className="font-medium text-yellow-800">API Key Required</h3>
                        <p className="text-sm text-yellow-700">
                          To use the voice assistant, please enter your ElevenLabs API key. 
                          You can get one by signing up at{" "}
                          <a href="https://elevenlabs.io" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                            ElevenLabs
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">ElevenLabs API Key</Label>
                    <div className="flex gap-2">
                      <input
                        id="apiKey"
                        type="password" 
                        className="flex-1 border rounded-md px-3 py-2"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                      />
                      <Button onClick={() => setApiKey("demo-key-for-testing")}>
                        Use Demo Key
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              {isTrainingCompleted ? (
                <Button variant="outline" onClick={() => setIsTrainingCompleted(false)}>
                  Restart Training
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setActiveTab("commands")}>
                  View Commands
                </Button>
              )}
              {isTrainingCompleted && (
                <Button>Try in Production App</Button>
              )}
            </CardFooter>
          </Card>
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
                        <Label htmlFor="voiceType">Voice Type</Label>
                        <select id="voiceType" className="w-full border rounded p-2">
                          <option>Bella (Female)</option>
                          <option>Adam (Male)</option>
                          <option>Sam (Neutral)</option>
                        </select>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="speechRate">Speech Rate</Label>
                        <input id="speechRate" type="range" className="w-full" min="0.5" max="1.5" step="0.1" defaultValue="1" />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="volume">Volume</Label>
                        <input id="volume" type="range" className="w-full" min="0" max="1" step="0.1" defaultValue="0.8" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Assistant Settings</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="wakeWord">Wake Word</Label>
                        <input id="wakeWord" type="text" className="w-full border rounded p-2" defaultValue="Hey Assistant" />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="timeout">Listening Timeout (seconds)</Label>
                        <input id="timeout" type="number" className="w-full border rounded p-2" min="5" max="30" defaultValue="10" />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-listen" defaultChecked />
                        <Label htmlFor="auto-listen">Auto-listen after response</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">API Configuration</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="apiKeyConfig">ElevenLabs API Key</Label>
                      <input id="apiKeyConfig" type="password" className="w-full border rounded p-2" placeholder="Enter your API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="model">Model</Label>
                      <select id="model" className="w-full border rounded p-2">
                        <option>eleven_turbo_v2</option>
                        <option>eleven_multilingual_v2</option>
                        <option>eleven_monolingual_v1</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <Button className="w-full" onClick={() => {
                        if (apiKey) {
                          alert("Settings saved! Your voice assistant is now configured.");
                        } else {
                          alert("Please enter your API key before saving.");
                        }
                      }}>
                        Save Settings
                      </Button>
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
