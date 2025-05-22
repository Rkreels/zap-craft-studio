
import React, { useState, useEffect } from "react";
import { EnhancedAudioTrainer } from "@/components/voice-assistant/EnhancedAudioTrainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Info, Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { usePageVoiceCommands } from "./VoiceCommandRegistry";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface VoiceTrainingSectionProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  isTrainingCompleted: boolean;
  onTrainingComplete: () => void;
  setIsTrainingCompleted: (completed: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const VoiceTrainingSection: React.FC<VoiceTrainingSectionProps> = ({
  apiKey,
  setApiKey,
  isTrainingCompleted,
  onTrainingComplete,
  setIsTrainingCompleted,
  setActiveTab
}) => {
  const { isEnabled, speakText, startListening } = useVoiceAssistant();
  const [learnProgress, setLearnProgress] = useState(0);
  const navigate = useNavigate();
  
  // Register voice commands specific to this page
  usePageVoiceCommands("Voice Training", [
    {
      command: "start training",
      description: "Begin voice assistant training",
      action: () => {
        if (!isTrainingCompleted && apiKey) {
          speakText("Starting voice training session.");
          // Additional logic if needed
        } else if (!apiKey) {
          speakText("Please enter your API key first.");
        } else {
          speakText("You have already completed training.");
        }
      },
      aliases: ["begin training", "start voice training"]
    },
    {
      command: "view commands",
      description: "Show all available voice commands",
      action: () => {
        setActiveTab("commands");
        speakText("Showing available commands.");
      },
      aliases: ["show commands", "list commands"]
    },
    {
      command: "reset training",
      description: "Reset voice training progress",
      action: () => {
        if (isTrainingCompleted) {
          setIsTrainingCompleted(false);
          speakText("Training progress has been reset.");
        } else {
          speakText("Training has not been completed yet.");
        }
      },
      aliases: ["restart training", "clear training"]
    }
  ]);
  
  // Simulate progress when training is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isTrainingCompleted && apiKey && isEnabled) {
      interval = setInterval(() => {
        setLearnProgress(prev => {
          const newProgress = prev + 0.5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 500);
    }
    
    return () => clearInterval(interval);
  }, [isTrainingCompleted, apiKey, isEnabled]);
  
  // Complete training when progress reaches 100
  useEffect(() => {
    if (learnProgress >= 100 && !isTrainingCompleted) {
      onTrainingComplete();
      speakText("Congratulations! You've completed the voice training successfully.");
    }
  }, [learnProgress, isTrainingCompleted, onTrainingComplete, speakText]);
  
  // Introduction when component mounts
  useEffect(() => {
    if (isEnabled) {
      const timer = setTimeout(() => {
        speakText("Welcome to voice training. Here you can train your voice to control the application.");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isEnabled, speakText]);

  return (
    <Card className="w-full border-purple-200 shadow-md">
      <CardHeader className="bg-purple-50 rounded-t-lg border-b border-purple-100">
        <CardTitle className="flex items-center text-purple-800">
          <Volume2 className="mr-2 text-purple-600" size={20} />
          Voice Command Training
        </CardTitle>
        <CardDescription className="text-purple-700">
          {isTrainingCompleted 
            ? "Training completed! Try out your voice commands anywhere in the app."
            : "Follow the steps below to learn how to use voice commands with our application."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {isTrainingCompleted ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <div className="flex items-center">
              <Badge className="bg-green-500">Completed</Badge>
              <p className="ml-2 text-green-700">You've successfully completed the voice training!</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-green-700">
                You can now use voice commands throughout the application. 
                Click the microphone button in the bottom right corner to start listening, 
                or say "Hey Assistant" to activate voice recognition.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs py-1 px-2">
                  "go to dashboard"
                </Badge>
                <Badge variant="outline" className="text-xs py-1 px-2">
                  "create new interface"
                </Badge>
                <Badge variant="outline" className="text-xs py-1 px-2">
                  "show available commands"
                </Badge>
              </div>
            </div>
          </div>
        ) : apiKey ? (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-100 rounded-md p-4">
              <h3 className="font-semibold text-purple-800 flex items-center">
                <Mic className="mr-2" size={16} />
                Training in Progress
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                Follow along with the exercises below to learn how to use voice commands.
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-xs text-purple-800">
                  <span>Learning Progress</span>
                  <span>{Math.round(learnProgress)}%</span>
                </div>
                <Progress 
                  value={learnProgress} 
                  className="h-2 bg-purple-100" 
                  indicatorClassName="bg-purple-600" 
                />
              </div>
            </div>
            
            <EnhancedAudioTrainer onTrainingComplete={onTrainingComplete} />
          </div>
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
                    <a href="https://elevenlabs.io" className="text-purple-600 hover:underline" target="_blank" rel="noreferrer">
                      ElevenLabs
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">ElevenLabs API Key</Label>
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <input
                  id="apiKey"
                  type="password" 
                  className="flex-1 min-w-[200px] border rounded-md px-3 py-2"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
                <Button 
                  onClick={() => setApiKey("demo-key-for-testing")}
                  className="whitespace-nowrap"
                >
                  Use Demo Key
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between border-t pt-4">
        {isTrainingCompleted ? (
          <>
            <Button variant="outline" onClick={() => setIsTrainingCompleted(false)}>
              Restart Training
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActiveTab("commands")}>
                View All Commands
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  navigate("/");
                  startListening();
                  toast({
                    title: "Voice Assistant Activated",
                    description: "Try saying 'Show available commands' or 'Go to interfaces'",
                  });
                }}
              >
                Try in App
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setActiveTab("commands")}>
              View Commands
            </Button>
            {apiKey && (
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  startListening();
                  toast({
                    title: "Voice Recognition Started",
                    description: "Try saying 'Start training'",
                  });
                }}
              >
                Start Voice Recognition
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};
