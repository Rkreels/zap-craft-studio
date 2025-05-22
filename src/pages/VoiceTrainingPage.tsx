
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { BookOpen, Info, Mic, Volume } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { PageVoiceCommands } from "@/components/voice-assistant/PageVoiceCommands";

// Import components
import { VoiceTrainingSection } from "@/components/voice-assistant/VoiceTrainingSection";
import { CommandsSection } from "@/components/voice-assistant/CommandsSection";
import { SettingsSection } from "@/components/voice-assistant/SettingsSection";

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
    toast({
      title: "Training Completed!",
      description: "You have successfully completed voice training.",
    });
  };
  
  // Define voice commands for this page
  const voiceCommands = [
    {
      command: "show trainer",
      description: "Switch to trainer tab",
      action: () => setActiveTab("trainer"),
      aliases: ["go to trainer", "open trainer"]
    },
    {
      command: "show commands",
      description: "Switch to commands tab",
      action: () => setActiveTab("commands"),
      aliases: ["go to commands", "open commands"]
    },
    {
      command: "show settings",
      description: "Switch to settings tab",
      action: () => setActiveTab("settings"),
      aliases: ["go to settings", "open settings"]
    },
    {
      command: "complete training",
      description: "Mark training as completed",
      action: () => {
        if (!isTrainingCompleted) {
          handleTrainingComplete();
        }
      }
    },
    {
      command: "reset training",
      description: "Reset voice training progress",
      action: () => setIsTrainingCompleted(false),
      aliases: ["restart training"]
    }
  ];

  return (
    <div 
      className="container mx-auto py-6 space-y-6"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <PageVoiceCommands 
        pageName="Voice Training" 
        commands={voiceCommands} 
        introMessage="Welcome to voice training. Here you can learn how to use voice commands across the application."
      />
      
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Voice Assistant Training</h1>
        <p className="text-gray-500">Learn to use voice commands to control the application</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="trainer" className="flex items-center justify-center">
            <Mic size={16} className="mr-2 hidden sm:inline" />
            Trainer
          </TabsTrigger>
          <TabsTrigger value="commands" className="flex items-center justify-center">
            <BookOpen size={16} className="mr-2 hidden sm:inline" />
            Commands
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center justify-center">
            <Volume size={16} className="mr-2 hidden sm:inline" />
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="trainer">
            <VoiceTrainingSection 
              apiKey={apiKey} 
              setApiKey={setApiKey} 
              isTrainingCompleted={isTrainingCompleted}
              setIsTrainingCompleted={setIsTrainingCompleted}
              onTrainingComplete={handleTrainingComplete}
              setActiveTab={setActiveTab}
            />
          </TabsContent>

          <TabsContent value="commands">
            <CommandsSection />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsSection apiKey={apiKey} setApiKey={setApiKey} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
