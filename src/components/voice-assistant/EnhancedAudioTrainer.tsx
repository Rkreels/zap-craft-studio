import React, { useState, useEffect } from "react";
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
  Repeat,
  ArrowRight,
  Volume,
  Info
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

interface TrainingScenario {
  id: string;
  name: string;
  description: string;
  commands: {
    text: string;
    explanation: string;
  }[];
  steps: {
    instruction: string;
    expectedCommand: string;
    hint?: string;
    feedback?: string;
  }[];
  skillLevel: "beginner" | "intermediate" | "advanced";
  completed: boolean;
}

export function EnhancedAudioTrainer() {
  const { isEnabled, speakText, toggleVoiceAssistant } = useVoiceAssistant();
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [userSkillLevel, setUserSkillLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [showHelp, setShowHelp] = useState(false);

  // Enhanced training scenarios with step-by-step instructions
  const [scenarios, setScenarios] = useState<TrainingScenario[]>([
    {
      id: "workflow-creation",
      name: "Creating Workflows",
      description: "Learn to create and configure workflows with voice commands",
      skillLevel: "beginner",
      commands: [
        {
          text: "Create a new workflow",
          explanation: "Initiates the workflow creation process"
        },
        {
          text: "Add a trigger step",
          explanation: "Creates a new trigger in your workflow"
        },
        {
          text: "Connect to Gmail",
          explanation: "Establishes a connection to Gmail API"
        },
        {
          text: "Add a new action step",
          explanation: "Creates a new action in your workflow"
        },
        {
          text: "Save this workflow",
          explanation: "Saves your current workflow configuration"
        }
      ],
      steps: [
        {
          instruction: "Let's create your first workflow. Try saying 'Create a new workflow'",
          expectedCommand: "Create a new workflow",
          hint: "Clearly say 'Create a new workflow' to begin",
          feedback: "Great! You've initiated a new workflow. Now let's add a trigger."
        },
        {
          instruction: "Now add a trigger to your workflow by saying 'Add a trigger step'",
          expectedCommand: "Add a trigger step",
          hint: "A trigger is what starts your workflow",
          feedback: "Perfect! The trigger step has been added. Let's connect it to Gmail."
        },
        {
          instruction: "Connect your trigger to Gmail by saying 'Connect to Gmail'",
          expectedCommand: "Connect to Gmail",
          hint: "This will allow your workflow to be triggered by Gmail events",
          feedback: "Excellent! Gmail connection established. Now let's add an action."
        },
        {
          instruction: "Add an action to your workflow by saying 'Add a new action step'",
          expectedCommand: "Add a new action step",
          hint: "Actions are what happen when your workflow runs",
          feedback: "Well done! You've added an action step. Time to save your workflow."
        },
        {
          instruction: "Finally, save your workflow by saying 'Save this workflow'",
          expectedCommand: "Save this workflow",
          hint: "This will save all your work so far",
          feedback: "Congratulations! You've successfully created and saved your first workflow using voice commands."
        }
      ],
      completed: false
    },
    {
      id: "data-transformation",
      name: "Data Transformations",
      description: "Learn to create formulas and transform data with voice",
      skillLevel: "intermediate",
      commands: [
        {
          text: "Open formula editor",
          explanation: "Opens the formula editing interface"
        },
        {
          text: "Create a concat formula",
          explanation: "Starts a new concatenation formula"
        },
        {
          text: "Apply data transformation",
          explanation: "Applies your formula to the selected data"
        },
        {
          text: "Save formula",
          explanation: "Saves your current formula"
        }
      ],
      steps: [
        {
          instruction: "Let's transform some data. Start by saying 'Open formula editor'",
          expectedCommand: "Open formula editor",
          hint: "The formula editor allows you to create custom data transformations",
          feedback: "Great! The formula editor is now open. Let's create a formula."
        },
        {
          instruction: "Now let's create a concatenation formula by saying 'Create a concat formula'",
          expectedCommand: "Create a concat formula",
          hint: "A concat formula combines multiple text values",
          feedback: "Perfect! You've started a concatenation formula. Now let's apply it."
        },
        {
          instruction: "Apply your formula to the data by saying 'Apply data transformation'",
          expectedCommand: "Apply data transformation",
          hint: "This processes your data using the formula you created",
          feedback: "Excellent work! The formula has been applied. Now let's save it."
        },
        {
          instruction: "Save your formula by saying 'Save formula'",
          expectedCommand: "Save formula",
          hint: "This will store your formula for future use",
          feedback: "Congratulations! You've successfully created and applied a data transformation formula!"
        }
      ],
      completed: false
    },
    {
      id: "webhook-config",
      name: "Webhook Configuration",
      description: "Configure webhooks using voice commands",
      skillLevel: "advanced",
      commands: [
        {
          text: "Create a new webhook",
          explanation: "Initiates webhook creation"
        },
        {
          text: "Set POST method",
          explanation: "Configures webhook to use POST HTTP method"
        },
        {
          text: "Add authentication",
          explanation: "Adds authentication to the webhook"
        },
        {
          text: "Test the webhook",
          explanation: "Sends a test request to verify webhook functionality"
        }
      ],
      steps: [
        {
          instruction: "Let's configure a webhook. Start by saying 'Create a new webhook'",
          expectedCommand: "Create a new webhook",
          hint: "A webhook allows external systems to communicate with your application",
          feedback: "Great! You've initiated webhook creation. Let's configure it."
        },
        {
          instruction: "Set the HTTP method by saying 'Set POST method'",
          expectedCommand: "Set POST method",
          hint: "POST is a common method for sending data to an API",
          feedback: "Perfect! The webhook is now configured to use POST. Let's add security."
        },
        {
          instruction: "Add security by saying 'Add authentication'",
          expectedCommand: "Add authentication",
          hint: "Authentication ensures only authorized systems can use your webhook",
          feedback: "Excellent! Authentication has been added. Now let's test it."
        },
        {
          instruction: "Test your webhook by saying 'Test the webhook'",
          expectedCommand: "Test the webhook",
          hint: "This sends a test request to verify everything works",
          feedback: "Congratulations! You've successfully configured and tested a webhook using voice commands!"
        }
      ],
      completed: false
    }
  ]);

  const currentScenario = scenarios.find(s => s.id === currentScenarioId);
  
  // Filter scenarios based on user skill level
  const filteredScenarios = scenarios.filter(scenario => {
    if (userSkillLevel === "beginner") return true;
    if (userSkillLevel === "intermediate") return scenario.skillLevel !== "advanced";
    return true; // All scenarios for advanced users
  });

  // Simulate voice recognition with a timer
  useEffect(() => {
    let recognitionTimer: NodeJS.Timeout;
    
    if (isListening && isPlaying && currentScenario && currentStep < currentScenario.steps.length) {
      const currentStepData = currentScenario.steps[currentStep];
      
      recognitionTimer = setTimeout(() => {
        // Simulate successful command recognition
        toast({
          description: `Recognized: "${currentStepData.expectedCommand}"`,
        });
        
        // Speak feedback
        if (isEnabled) {
          speakText(currentStepData.feedback || "Good job!");
        }
        
        // Mark step as completed
        setCompletedSteps(prev => [...prev, currentStep]);
        
        // Advance to next step after a delay
        setTimeout(() => {
          if (currentStep < currentScenario.steps.length - 1) {
            setCurrentStep(prev => prev + 1);
          } else {
            // Scenario completed
            completeScenario(currentScenario.id);
          }
        }, 2000);
      }, 5000); // Simulate 5 seconds for voice recognition
    }
    
    return () => clearTimeout(recognitionTimer);
  }, [isListening, isPlaying, currentScenario, currentStep, isEnabled]);

  const toggleListening = () => {
    if (!apiKey && !isEnabled) {
      toast({
        title: "Configuration Required",
        description: "Please enter your ElevenLabs API key or enable the built-in voice assistant",
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
      
      if (isEnabled) {
        speakText("I'm listening. Please speak your command clearly.");
      }
    } else {
      toast({
        description: "Voice assistant stopped listening"
      });
      
      if (isEnabled) {
        speakText("Voice assistant deactivated.");
      }
    }
  };

  const startTraining = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    setCurrentScenarioId(scenarioId);
    setIsPlaying(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    
    toast({
      title: "Training Started",
      description: "Follow the voice prompts to complete the training scenario"
    });
    
    if (isEnabled && scenario) {
      speakText(`Welcome to the ${scenario.name} training. ${scenario.description}. Let's begin with the first step.`);
      setTimeout(() => {
        speakText(scenario.steps[0].instruction);
      }, 1000);
    }
  };

  const stopTraining = () => {
    setIsPlaying(false);
    setCurrentScenarioId(null);
    setIsListening(false);
    
    if (isEnabled) {
      speakText("Training session ended. You can return to continue your progress anytime.");
    }
  };

  const completeScenario = (scenarioId: string) => {
    setScenarios(scenarios.map(s => 
      s.id === scenarioId ? { ...s, completed: true } : s
    ));
    
    toast({
      title: "Scenario Completed",
      description: "Great job! You've completed this training scenario."
    });
    
    if (isEnabled) {
      speakText("Congratulations! You've successfully completed this training scenario. You can now use these voice commands in your actual workflows.");
    }
    
    setIsPlaying(false);
    setIsListening(false);
    // Keep the scenario open so user can review their accomplishment
  };

  const nextStep = () => {
    if (!currentScenario || currentStep >= currentScenario.steps.length - 1) return;
    
    setCurrentStep(prev => prev + 1);
    setCompletedSteps(prev => [...prev, currentStep]);
    
    if (isEnabled) {
      speakText(currentScenario.steps[currentStep + 1].instruction);
    }
  };

  const speakInstructions = () => {
    if (!isEnabled || !currentScenario) return;
    
    const currentStepData = currentScenario.steps[currentStep];
    speakText(currentStepData.instruction);
  };

  const speakHint = () => {
    if (!isEnabled || !currentScenario) return;
    
    const currentStepData = currentScenario.steps[currentStep];
    if (currentStepData.hint) {
      speakText(currentStepData.hint);
    }
  };

  // Enable voice assistant if API key is provided or toggle enabled
  useEffect(() => {
    if (apiKey && !isEnabled) {
      toggleVoiceAssistant();
    }
  }, [apiKey, isEnabled]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2" size={20} />
          Voice Command Training
          <Badge variant="outline" className="ml-auto">Enhanced</Badge>
        </CardTitle>
        <CardDescription>
          Master voice commands with interactive, guided training scenarios
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {currentScenario ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{currentScenario.name}</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={isListening ? "default" : "outline"}
                  className={isListening ? "bg-purple-600 hover:bg-purple-700" : ""}
                  onClick={toggleListening}
                  disabled={!isPlaying}
                >
                  {isListening ? <Mic size={16} /> : <MicOff size={16} />}
                  <span className="ml-2">{isListening ? "Listening" : "Start Listening"}</span>
                </Button>
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
            
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{completedSteps.length} of {currentScenario.steps.length} steps</span>
              </div>
              <Progress value={(completedSteps.length / currentScenario.steps.length) * 100} className="h-2" />
            </div>
            
            {/* Current step */}
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 space-y-3">
              <h4 className="font-medium flex items-center">
                <span>Step {currentStep + 1}: {isPlaying ? "In Progress" : "Paused"}</span>
                {completedSteps.includes(currentStep) && (
                  <Badge className="ml-2 bg-green-500" variant="secondary">Completed</Badge>
                )}
              </h4>
              
              <p className="text-sm">{currentScenario.steps[currentStep].instruction}</p>
              
              <div className="flex space-x-2 mt-2">
                <Button variant="outline" size="sm" onClick={speakInstructions}>
                  <Volume size={14} className="mr-1" />
                  Repeat Instructions
                </Button>
                <Button variant="outline" size="sm" onClick={speakHint}>
                  <Info size={14} className="mr-1" />
                  Hint
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={nextStep}
                  className="ml-auto"
                  disabled={currentStep >= currentScenario.steps.length - 1 || !isPlaying}
                >
                  Skip
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
            
            {/* Command reference */}
            <Collapsible open={showHelp} onOpenChange={setShowHelp} className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex items-center w-full justify-between p-2">
                  <span>Show Command Reference</span>
                  {showHelp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {currentScenario.commands.map((command, index) => (
                  <div key={index} className="flex items-start space-x-2 bg-gray-50 p-2 rounded">
                    <Mic size={16} className="text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{command.text}</p>
                      <p className="text-xs text-gray-500">{command.explanation}</p>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
            
            <div className="mt-6">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => completeScenario(currentScenario.id)}
                disabled={completedSteps.length < currentScenario.steps.length && isPlaying}
              >
                <Check size={16} className="mr-2" />
                {completedSteps.length < currentScenario.steps.length ? "Skip to End (Not Recommended)" : "Complete Training"}
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
                    
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Skill Level</h4>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {["beginner", "intermediate", "advanced"].map((level) => (
                          <Button 
                            key={level}
                            variant={userSkillLevel === level ? "default" : "outline"}
                            size="sm"
                            onClick={() => setUserSkillLevel(level as "beginner" | "intermediate" | "advanced")}
                            className={userSkillLevel === level ? "bg-purple-600" : ""}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Training Scenarios</h3>
              <div className="grid gap-3">
                {filteredScenarios.map((scenario) => (
                  <div 
                    key={scenario.id} 
                    className="border rounded-md p-3 cursor-pointer hover:border-purple-300"
                    onClick={() => startTraining(scenario.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">{scenario.name}</h4>
                          <Badge className="ml-2" variant="outline">{scenario.skillLevel}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{scenario.description}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500 mr-2">{scenario.steps.length} steps</span>
                          <span className="text-xs text-gray-500">{scenario.commands.length} commands</span>
                        </div>
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
          Enhanced training helps you master voice commands through guided practice
        </p>
        <Button variant="link" className="text-purple-600">
          View all voice commands
        </Button>
      </CardFooter>
    </Card>
  );
}
