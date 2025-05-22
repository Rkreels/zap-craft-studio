
import React from "react";
import { EnhancedAudioTrainer } from "@/components/voice-assistant/EnhancedAudioTrainer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface VoiceTrainingSectionProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  isTrainingCompleted: boolean;
  onTrainingComplete: () => void;
  setIsTrainingCompleted: (completed: boolean) => void; // Added this prop
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
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
          // Pass onTrainingComplete prop to EnhancedAudioTrainer
          <EnhancedAudioTrainer onTrainingComplete={onTrainingComplete} />
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
  );
};
