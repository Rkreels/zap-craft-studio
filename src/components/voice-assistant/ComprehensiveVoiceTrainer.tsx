import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle,
  Volume2,
  VolumeX,
  Target,
  Brain,
  Activity,
  Trophy,
  AlertCircle,
  MapPin,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Clock,
  Zap
} from "lucide-react";
import { useEnhancedVoiceAssistant } from "@/contexts/EnhancedVoiceAssistantContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface StepByStepGuide {
  id: string;
  title: string;
  description: string;
  steps: TrainingStep[];
  context: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
}

interface TrainingStep {
  id: string;
  title: string;
  instruction: string;
  voiceCommand: string;
  expectedAction: string;
  hints: string[];
  demonstration?: string;
  completed: boolean;
  attempts: number;
  maxAttempts: number;
}

const stepByStepGuides: StepByStepGuide[] = [
  {
    id: "complete-workflow-creation",
    title: "Complete Workflow Creation",
    description: "Learn to create a full automation from start to finish",
    context: "workflow",
    difficulty: "beginner",
    estimatedTime: 15,
    steps: [
      {
        id: "navigate-to-workflows",
        title: "Navigate to Workflows",
        instruction: "Let's start by going to the workflows page. Say the navigation command.",
        voiceCommand: "go to workflows",
        expectedAction: "Navigate to /zaps or /zaps/create",
        hints: [
          "Try saying 'go to workflows' or 'show workflows'",
          "You can also say 'create workflow' to go directly to creation",
          "Navigation commands usually start with 'go to' or 'open'"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: "create-new-workflow",
        title: "Create New Workflow",
        instruction: "Now create a new workflow. Use the voice command to start creating.",
        voiceCommand: "create new workflow",
        expectedAction: "Open workflow creation interface",
        hints: [
          "Say 'create new workflow' or 'new automation'",
          "You can also try 'add workflow' or 'start workflow'",
          "Creating commands usually start with 'create' or 'new'"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: "add-trigger",
        title: "Add Trigger",
        instruction: "Every workflow needs a trigger. Add one using voice commands.",
        voiceCommand: "add trigger",
        expectedAction: "Open trigger selection dialog",
        hints: [
          "Say 'add trigger' or 'create trigger'",
          "You can specify the type like 'add Gmail trigger'",
          "Triggers are what start your automation"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: "configure-trigger",
        title: "Configure Trigger",
        instruction: "Configure your trigger settings. Try selecting an email trigger.",
        voiceCommand: "select email trigger",
        expectedAction: "Select email trigger type",
        hints: [
          "Say 'select email trigger' or 'choose Gmail'",
          "You can also say 'email when received'",
          "Be specific about what type of trigger you want"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: "add-action",
        title: "Add Action",
        instruction: "Now add an action that happens when the trigger fires.",
        voiceCommand: "add action",
        expectedAction: "Open action selection dialog",
        hints: [
          "Say 'add action' or 'create action'",
          "Actions are what happens when your trigger fires",
          "You can specify like 'add Slack action'"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: "test-workflow",
        title: "Test Workflow",
        instruction: "Test your workflow to make sure it works correctly.",
        voiceCommand: "test workflow",
        expectedAction: "Run workflow test",
        hints: [
          "Say 'test workflow' or 'run test'",
          "You can also say 'try automation'",
          "Testing ensures your workflow works before publishing"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: "save-workflow",
        title: "Save Workflow",
        instruction: "Save your completed workflow.",
        voiceCommand: "save workflow",
        expectedAction: "Save workflow configuration",
        hints: [
          "Say 'save workflow' or 'save automation'",
          "You can also say 'save changes'",
          "Don't forget to save your work!"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      }
    ]
  },
  {
    id: "interface-creation-guide",
    title: "Interface Creation Guide",
    description: "Master creating and customizing interfaces",
    context: "interfaces",
    difficulty: "intermediate",
    estimatedTime: 12,
    steps: [
      {
        id: "go-to-interfaces",
        title: "Navigate to Interfaces",
        instruction: "Let's go to the interfaces page to start creating.",
        voiceCommand: "go to interfaces",
        expectedAction: "Navigate to /interfaces",
        hints: [
          "Say 'go to interfaces' or 'open interfaces'",
          "You can also say 'show interfaces' or 'view interfaces'"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: "create-interface",
        title: "Create New Interface",
        instruction: "Start creating a new interface.",
        voiceCommand: "create new interface",
        expectedAction: "Open interface creation dialog",
        hints: [
          "Say 'create new interface' or 'add interface'",
          "You can specify the type like 'create form interface'"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: "add-form-field",
        title: "Add Form Field",
        instruction: "Add a form field to your interface.",
        voiceCommand: "add form field",
        expectedAction: "Add new form field",
        hints: [
          "Say 'add form field' or 'create field'",
          "You can specify field types like 'add text field' or 'add email field'"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: "preview-interface",
        title: "Preview Interface",
        instruction: "Preview your interface to see how it looks.",
        voiceCommand: "preview interface",
        expectedAction: "Open interface preview",
        hints: [
          "Say 'preview interface' or 'show preview'",
          "You can also say 'test interface'"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      },
      {
        id: "publish-interface",
        title: "Publish Interface",
        instruction: "Publish your interface to make it live.",
        voiceCommand: "publish interface",
        expectedAction: "Publish interface",
        hints: [
          "Say 'publish interface' or 'make live'",
          "You can also say 'activate interface'"
        ],
        completed: false,
        attempts: 0,
        maxAttempts: 3
      }
    ]
  }
];

export const ComprehensiveVoiceTrainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isEnabled,
    isListening,
    isTraining,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    lastCommand,
    confidenceLevel,
    trainingProgress,
    trainingAccuracy,
    startTrainingSession,
    endTrainingSession,
    setTrainingMode,
    currentContext,
    registerCommand,
    unregisterCommand
  } = useEnhancedVoiceAssistant();

  const [selectedGuide, setSelectedGuide] = useState<StepByStepGuide | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [guideProgress, setGuideProgress] = useState(0);
  const [isGuideActive, setIsGuideActive] = useState(false);
  const [stepAttempts, setStepAttempts] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isWaitingForAction, setIsWaitingForAction] = useState(false);
  const [autoProgression, setAutoProgression] = useState(true);

  const activeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentStep = selectedGuide?.steps[currentStepIndex];

  // Stop training when context changes or user navigates
  useEffect(() => {
    if (isGuideActive && selectedGuide && selectedGuide.context !== currentContext.toLowerCase()) {
      handleStopGuide("Context changed");
    }
  }, [currentContext, isGuideActive, selectedGuide]);

  // Enhanced command processing for guided training
  useEffect(() => {
    if (!isGuideActive || !currentStep || !lastCommand) return;

    const userCommand = lastCommand.toLowerCase().trim();
    const expectedCommand = currentStep.voiceCommand.toLowerCase();
    
    // Check if command matches (with fuzzy matching)
    const isMatch = userCommand.includes(expectedCommand) || 
                   expectedCommand.includes(userCommand) ||
                   calculateCommandSimilarity(userCommand, expectedCommand) > 0.7;

    if (isMatch) {
      setStepAttempts(0);
      setFeedbackText("Perfect! Command recognized. Executing action...");
      speakText("Excellent! Let me execute that action for you.");
      
      // Execute the expected action
      executeStepAction(currentStep);
      
      setTimeout(() => {
        markStepComplete();
      }, 2000);
    } else {
      setStepAttempts(prev => prev + 1);
      
      if (stepAttempts < currentStep.maxAttempts - 1) {
        setFeedbackText(`Not quite right. Try saying: "${currentStep.voiceCommand}"`);
        speakText(`Try saying: ${currentStep.voiceCommand}`);
      } else {
        setFeedbackText("Maximum attempts reached. Showing hints and moving forward.");
        speakText("Let me show you hints and we'll move to the next step.");
        setShowHints(true);
        
        setTimeout(() => {
          markStepComplete();
        }, 3000);
      }
    }
  }, [lastCommand, isGuideActive, currentStep, stepAttempts]);

  const calculateCommandSimilarity = (cmd1: string, cmd2: string): number => {
    const words1 = cmd1.split(' ');
    const words2 = cmd2.split(' ');
    
    let matches = 0;
    words2.forEach(word => {
      if (words1.some(w => w.includes(word) || word.includes(w))) {
        matches++;
      }
    });
    
    return matches / words2.length;
  };

  const executeStepAction = (step: TrainingStep) => {
    switch (step.expectedAction) {
      case "Navigate to /zaps or /zaps/create":
        navigate("/zaps/create");
        break;
      case "Navigate to /interfaces":
        navigate("/interfaces");
        break;
      case "Open workflow creation interface":
        // Simulate workflow creation action
        toast({
          title: "Action Executed",
          description: "Workflow creation interface opened",
        });
        break;
      case "Open trigger selection dialog":
        toast({
          title: "Action Executed",
          description: "Trigger selection dialog opened",
        });
        break;
      default:
        toast({
          title: "Action Simulated",
          description: `Executed: ${step.expectedAction}`,
        });
    }
  };

  const startGuide = (guide: StepByStepGuide) => {
    setSelectedGuide(guide);
    setCurrentStepIndex(0);
    setGuideProgress(0);
    setIsGuideActive(true);
    setStepAttempts(0);
    setShowHints(false);
    setFeedbackText("");
    
    startTrainingSession(guide.context);
    
    // Register contextual commands for this guide
    guide.steps.forEach(step => {
      registerCommand({
        command: step.voiceCommand,
        description: step.instruction,
        action: () => executeStepAction(step),
        contextTags: [guide.context],
        priority: 3
      });
    });

    speakText(`Starting ${guide.title}. I'll guide you through each step. Listen carefully and follow along.`);
    
    setTimeout(() => {
      startCurrentStep();
    }, 3000);
  };

  const startCurrentStep = () => {
    if (!currentStep) return;

    setIsWaitingForAction(true);
    setShowHints(false);
    setStepAttempts(0);
    
    const instruction = `Step ${currentStepIndex + 1}: ${currentStep.title}. ${currentStep.instruction}`;
    speakText(instruction);
    
    setTimeout(() => {
      speakText(`Say: ${currentStep.voiceCommand}`);
    }, 3000);
  };

  const markStepComplete = () => {
    if (!selectedGuide || !currentStep) return;

    const updatedGuide = {
      ...selectedGuide,
      steps: selectedGuide.steps.map((step, index) => 
        index === currentStepIndex ? { ...step, completed: true } : step
      )
    };
    
    setSelectedGuide(updatedGuide);
    setGuideProgress(((currentStepIndex + 1) / selectedGuide.steps.length) * 100);
    setIsWaitingForAction(false);

    if (currentStepIndex < selectedGuide.steps.length - 1) {
      speakText("Step completed! Moving to next step.");
      
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
        setShowHints(false);
        
        if (autoProgression) {
          setTimeout(startCurrentStep, 2000);
        }
      }, 1500);
    } else {
      completeGuide();
    }
  };

  const completeGuide = () => {
    if (!selectedGuide) return;

    setIsGuideActive(false);
    setGuideProgress(100);
    endTrainingSession();
    
    // Unregister guide commands
    selectedGuide.steps.forEach(step => {
      unregisterCommand(step.voiceCommand);
    });

    const completedSteps = selectedGuide.steps.filter(s => s.completed).length;
    const successRate = Math.round((completedSteps / selectedGuide.steps.length) * 100);
    
    speakText(`Congratulations! You've completed ${selectedGuide.title} with ${successRate}% success rate. Well done!`);
    
    toast({
      title: "Guide Complete!",
      description: `${selectedGuide.title} completed with ${successRate}% success rate.`,
    });
  };

  const handleStopGuide = (reason: string = "User stopped") => {
    if (selectedGuide) {
      selectedGuide.steps.forEach(step => {
        unregisterCommand(step.voiceCommand);
      });
    }
    
    setIsGuideActive(false);
    setSelectedGuide(null);
    setCurrentStepIndex(0);
    setGuideProgress(0);
    endTrainingSession();
    stopSpeaking();
    
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
    }
    
    speakText(`Training stopped. ${reason}`);
  };

  const repeatCurrentStep = () => {
    if (currentStep) {
      startCurrentStep();
    }
  };

  const skipCurrentStep = () => {
    speakText("Skipping this step.");
    markStepComplete();
  };

  const showStepHints = () => {
    if (!currentStep) return;
    
    setShowHints(true);
    const hintsText = currentStep.hints.join(". ");
    speakText(`Here are some hints: ${hintsText}`);
  };

  if (!isEnabled) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <VolumeX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Voice Assistant Disabled</h3>
          <p className="text-gray-600 mb-4">
            Enable the voice assistant to start comprehensive training
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isGuideActive && selectedGuide) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>{selectedGuide.title}</span>
              </CardTitle>
              <CardDescription>{selectedGuide.description}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => handleStopGuide("User stopped")}>
              Exit Training
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Guide Progress</span>
              <span>{Math.round(guideProgress)}%</span>
            </div>
            <Progress value={guideProgress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Step {currentStepIndex + 1} of {selectedGuide.steps.length}</span>
              <span>~{selectedGuide.estimatedTime} min total</span>
            </div>
          </div>

          {/* Current Step */}
          {currentStep && (
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    Step {currentStepIndex + 1}
                  </Badge>
                  <h3 className="font-semibold">{currentStep.title}</h3>
                  {isWaitingForAction && (
                    <Badge className="bg-orange-500 text-white animate-pulse">
                      Waiting for Action
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300">
                  {currentStep.instruction}
                </p>
                
                <div className="p-3 bg-white dark:bg-gray-800 rounded border-l-4 border-blue-500">
                  <div className="flex items-center space-x-2 mb-1">
                    <Mic className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">Say this command:</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    "{currentStep.voiceCommand}"
                  </div>
                </div>

                {showHints && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-sm">Hints:</span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {currentStep.hints.map((hint, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-yellow-500">•</span>
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedbackText && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-500">
                    <p className="text-green-800 dark:text-green-200">{feedbackText}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              onClick={repeatCurrentStep}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Repeat</span>
            </Button>
            
            <Button
              variant={isListening ? "destructive" : "default"}
              onClick={() => isListening ? stopListening() : startListening()}
              className="flex items-center space-x-2 min-w-[140px]"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" />
                  <span>Stop Listening</span>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  <span>Start Listening</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={showStepHints}
              className="flex items-center space-x-2"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Hints</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={skipCurrentStep}
              className="flex items-center space-x-2"
            >
              <ArrowRight className="h-4 w-4" />
              <span>Skip</span>
            </Button>
          </div>

          {/* Real-time Recognition */}
          {isListening && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Listening...</span>
              </div>
              <Input
                value={lastCommand}
                placeholder="Your voice input will appear here..."
                readOnly
                className="bg-white dark:bg-gray-900"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Confidence: {Math.round(confidenceLevel * 100)}%</span>
                <span>Attempts: {stepAttempts}/{currentStep?.maxAttempts}</span>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {selectedGuide.steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "p-2 rounded text-xs border",
                  index === currentStepIndex ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" :
                  step.completed ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" :
                  "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                )}
              >
                <div className="flex items-center space-x-1">
                  {step.completed ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : index === currentStepIndex ? (
                    <Activity className="h-3 w-3 text-blue-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-gray-400" />
                  )}
                  <span className="font-medium truncate">{step.title}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Comprehensive Voice Training</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete step-by-step guides to master voice commands
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stepByStepGuides.map((guide) => (
          <Card key={guide.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{guide.title}</span>
                  </CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </div>
                <Badge 
                  className={cn(
                    guide.difficulty === "beginner" ? "bg-green-500 text-white" :
                    guide.difficulty === "intermediate" ? "bg-yellow-500 text-white" :
                    "bg-red-500 text-white"
                  )}
                >
                  {guide.difficulty}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>~{guide.estimatedTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{guide.steps.length} steps</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">What you'll learn:</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {guide.steps.slice(0, 3).map((step) => (
                    <li key={step.id} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{step.title}</span>
                    </li>
                  ))}
                  {guide.steps.length > 3 && (
                    <li className="text-gray-500 text-xs">
                      +{guide.steps.length - 3} more steps...
                    </li>
                  )}
                </ul>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => startGuide(guide)}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Guide
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};