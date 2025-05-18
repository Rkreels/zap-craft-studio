
import React, { useState } from "react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  MicOff, 
  VolumeX, 
  Volume2, 
  Play, 
  Pause,
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Check,
  Repeat
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

interface TrainingScenario {
  id: string;
  name: string;
  description: string;
  commands: string[];
  completed: boolean;
}

export function AudioTrainer() {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock training scenarios
  const [scenarios, setScenarios] = useState<TrainingScenario[]>([
    {
      id: "workflow-creation",
      name: "Creating Workflows",
      description: "Learn to create and configure workflows with voice commands",
      commands: [
        "Create a new workflow",
        "Add a trigger step",
        "Connect to Gmail",
        "Add a new action step",
        "Save this workflow"
      ],
      completed: false
    },
    {
      id: "data-transformation",
      name: "Data Transformations",
      description: "Learn to create formulas and transform data with voice",
      commands: [
        "Open formula editor",
        "Create a concat formula",
        "Apply data transformation",
        "Save formula"
      ],
      completed: false
    },
    {
      id: "webhook-config",
      name: "Webhook Configuration",
      description: "Configure webhooks using voice commands",
      commands: [
        "Create a new webhook",
        "Set POST method",
        "Add authentication",
        "Test the webhook"
      ],
      completed: false
    }
  ]);

  const currentScenario = scenarios.find(s => s.id === currentScenarioId);

  const toggleListening = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key in settings",
        variant: "destructive"
      });
      setIsSettingsOpen(true);
      return;
    }
    
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        description: "Voice assistant is now listening..."
      });
    } else {
      toast({
        description: "Voice assistant stopped listening"
      });
    }
  };

  const startTraining = (scenarioId: string) => {
    setCurrentScenarioId(scenarioId);
    setIsPlaying(true);
    
    toast({
      title: "Training Started",
      description: "Follow the voice prompts to complete the training scenario"
    });
  };

  const stopTraining = () => {
    setIsPlaying(false);
    setCurrentScenarioId(null);
  };

  const completeScenario = (scenarioId: string) => {
    setScenarios(scenarios.map(s => 
      s.id === scenarioId ? { ...s, completed: true } : s
    ));
    
    toast({
      title: "Scenario Completed",
      description: "Great job! You've completed this training scenario."
    });
    
    setIsPlaying(false);
    setCurrentScenarioId(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2" size={20} />
          Voice Command Training
        </CardTitle>
        <CardDescription>
          Learn to use voice commands with guided training scenarios
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {currentScenario ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{currentScenario.name}</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  <span className="ml-2">{isPlaying ? "Pause" : "Resume"}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={stopTraining}
                >
                  Exit
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">{currentScenario.description}</p>
            
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium">Try these commands:</h4>
              <ul className="space-y-2">
                {currentScenario.commands.map((command, index) => (
                  <li key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                    <Mic size={16} className="text-purple-500" />
                    <span className="text-sm">{command}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => completeScenario(currentScenario.id)}
              >
                <Check size={16} className="mr-2" />
                Mark as Completed
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant={isListening ? "default" : "outline"}
                  className={isListening ? "bg-purple-600 hover:bg-purple-700" : ""}
                  onClick={toggleListening}
                >
                  {isListening ? <Mic size={16} /> : <MicOff size={16} />}
                  <span className="ml-2">{isListening ? "Listening" : "Start Listening"}</span>
                </Button>
                
                <div className="flex items-center space-x-2">
                  {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  <Slider
                    className="w-28"
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={([value]) => setVolume(value)}
                  />
                </div>
              </div>
              
              <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm">
                    Settings {isSettingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="space-y-2 p-3 border rounded-md bg-gray-50">
                    <h4 className="text-sm font-medium">Voice API Settings</h4>
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs text-gray-500">ElevenLabs API Key</label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="border rounded p-1 text-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Get an API key from <a href="https://elevenlabs.io" className="text-purple-600 hover:underline" target="_blank" rel="noreferrer">ElevenLabs</a>
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Training Scenarios</h3>
              <div className="grid gap-3">
                {scenarios.map((scenario) => (
                  <div 
                    key={scenario.id} 
                    className="border rounded-md p-3 cursor-pointer hover:border-purple-300"
                    onClick={() => startTraining(scenario.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{scenario.name}</h4>
                        <p className="text-sm text-gray-500">{scenario.description}</p>
                      </div>
                      <div className="flex items-center">
                        {scenario.completed && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">
                            Completed
                          </span>
                        )}
                        <Button variant="outline" size="sm">
                          {scenario.completed ? <Repeat size={16} /> : <Play size={16} />}
                          <span className="ml-1">{scenario.completed ? "Retry" : "Start"}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-gray-500">
          Voice commands require microphone access and an ElevenLabs API key
        </p>
        <Button variant="link" className="text-purple-600">
          View all voice commands
        </Button>
      </CardFooter>
    </Card>
  );
}
