
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { BookOpen, Info, Mic, Volume, Zap, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { PageVoiceCommands } from "@/components/voice-assistant/PageVoiceCommands";

// Import components
import { VoiceTrainingSection } from "@/components/voice-assistant/VoiceTrainingSection";
import { CommandsSection } from "@/components/voice-assistant/CommandsSection";
import { SettingsSection } from "@/components/voice-assistant/SettingsSection";
import { ComprehensiveVoiceTraining } from "@/components/voice-assistant/ComprehensiveVoiceTraining";
import { AdvancedWorkflowFeatures } from "@/components/workflow/AdvancedWorkflowFeatures";

export default function VoiceTrainingPage() {
  const [activeTab, setActiveTab] = useState("comprehensive");
  const [apiKey, setApiKey] = useState("");
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);

  // Voice guidance for this page
  const voiceGuidanceProps = {
    elementName: "Voice Training Page",
    hoverText: "Master voice commands and advanced workflow features through comprehensive training modules",
    clickText: "Access comprehensive voice training, advanced features, and detailed command references"
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
      command: "show comprehensive training",
      description: "Switch to comprehensive training tab",
      action: () => setActiveTab("comprehensive"),
      aliases: ["go to comprehensive", "open comprehensive training"]
    },
    {
      command: "show advanced features",
      description: "Switch to advanced features tab",
      action: () => setActiveTab("advanced"),
      aliases: ["go to advanced", "open advanced features"]
    },
    {
      command: "show basic trainer",
      description: "Switch to basic trainer tab",
      action: () => setActiveTab("trainer"),
      aliases: ["go to trainer", "open basic trainer"]
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
        introMessage="Welcome to comprehensive voice training. Master all aspects of workflow automation with voice commands and explore advanced features."
      />
      
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Voice Assistant Training & Advanced Features</h1>
        <p className="text-gray-500">Master voice commands and explore advanced workflow capabilities</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="comprehensive" className="flex items-center justify-center">
            <Zap size={16} className="mr-2 hidden sm:inline" />
            Comprehensive
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center justify-center">
            <SettingsIcon size={16} className="mr-2 hidden sm:inline" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="trainer" className="flex items-center justify-center">
            <Mic size={16} className="mr-2 hidden sm:inline" />
            Basic
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
          <TabsContent value="comprehensive">
            <ComprehensiveVoiceTraining />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedWorkflowFeatures />
          </TabsContent>

          <TabsContent value="trainer">
            <VoiceTrainingSection onComplete={handleTrainingComplete} />
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
