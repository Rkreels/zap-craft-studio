import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveVoiceTrainer } from "@/components/voice-assistant/InteractiveVoiceTrainer";
import { ComprehensiveVoiceTraining } from "@/components/voice-assistant/ComprehensiveVoiceTraining";
import { VoiceTrainingSection } from "@/components/voice-assistant/VoiceTrainingSection";
import { CommandsSection } from "@/components/voice-assistant/CommandsSection";
import { SettingsSection } from "@/components/voice-assistant/SettingsSection";
import { AdvancedWorkflowFeatures } from "@/components/workflow/AdvancedWorkflowFeatures";
import { useEnhancedVoiceAssistant } from "@/contexts/EnhancedVoiceAssistantContext";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  Mic, 
  Settings, 
  BookOpen, 
  Zap,
  Activity,
  Trophy,
  RotateCcw 
} from "lucide-react";

export default function VoiceTrainingPageEnhanced() {
  const [activeTab, setActiveTab] = useState("interactive");
  const [apiKey, setApiKey] = useState("");
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  
  const {
    isEnabled,
    trainingProgress,
    trainingAccuracy,
    trainingSessions,
    setTrainingMode,
    resetTraining,
    speakText
  } = useEnhancedVoiceAssistant();

  const handleTrainingComplete = () => {
    setTrainingCompleted(true);
    toast({
      title: "Training Complete",
      description: "You've successfully completed the voice training session!",
    });
  };

  const totalSessions = trainingSessions.length;
  const avgAccuracy = trainingSessions.reduce((acc, session) => acc + session.accuracy, 0) / totalSessions || 0;
  const completedSessions = trainingSessions.filter(session => session.endTime).length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Brain className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold">Enhanced Voice Training</h1>
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            AI-Powered
          </Badge>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master voice commands with our intelligent training system that adapts to your voice and provides real-time feedback.
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{completedSessions}</div>
            <div className="text-sm text-gray-600">Completed Sessions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{Math.round(avgAccuracy * 100)}%</div>
            <div className="text-sm text-gray-600">Average Accuracy</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalSessions}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{Math.round(trainingProgress)}%</div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      {isEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Training Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Voice Recognition Accuracy</span>
                  <span>{Math.round(trainingAccuracy * 100)}%</span>
                </div>
                <Progress value={trainingAccuracy * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Training Completion</span>
                  <span>{Math.round(trainingProgress)}%</span>
                </div>
                <Progress value={trainingProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setTrainingMode(true)}
              className="flex items-center space-x-2"
            >
              <Mic className="h-4 w-4" />
              <span>Start Quick Training</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => speakText("Voice training system is ready. Choose a training module to begin.")}
            >
              <span>Test Voice Output</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={resetTraining}
              className="text-orange-600 hover:text-orange-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Progress
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Training Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="interactive" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Interactive</span>
          </TabsTrigger>
          <TabsTrigger value="comprehensive" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Comprehensive</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Advanced</span>
          </TabsTrigger>
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <Mic className="h-4 w-4" />
            <span>Basic</span>
          </TabsTrigger>
          <TabsTrigger value="commands" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Commands</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactive" className="mt-6">
          <InteractiveVoiceTrainer />
        </TabsContent>

        <TabsContent value="comprehensive" className="mt-6">
          <ComprehensiveVoiceTraining />
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <AdvancedWorkflowFeatures workflowId="voice-training-workflow" />
        </TabsContent>

        <TabsContent value="basic" className="mt-6">
          <VoiceTrainingSection onComplete={handleTrainingComplete} />
        </TabsContent>

        <TabsContent value="commands" className="mt-6">
          <CommandsSection />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SettingsSection apiKey={apiKey} setApiKey={setApiKey} />
        </TabsContent>
      </Tabs>

      {/* Training Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Training Tips</CardTitle>
          <CardDescription>
            Get the most out of your voice training sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Speak Clearly</h4>
              <p className="text-sm text-gray-600">
                Enunciate each word clearly and speak at a normal pace for better recognition.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Consistent Environment</h4>
              <p className="text-sm text-gray-600">
                Train in a quiet environment to improve accuracy and reduce background noise.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Regular Practice</h4>
              <p className="text-sm text-gray-600">
                Practice regularly to maintain and improve your voice recognition accuracy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}