
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
          <VoiceTrainingSection 
            apiKey={apiKey} 
            setApiKey={setApiKey} 
            isTrainingCompleted={isTrainingCompleted}
            onTrainingComplete={handleTrainingComplete}
            setActiveTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="commands" className="mt-6">
          <CommandsSection />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SettingsSection apiKey={apiKey} setApiKey={setApiKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
