
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle,
  BookOpen,
  Zap,
  Settings,
  Users,
  Database,
  Code,
  GitBranch,
  Webhook,
  Calendar,
  Filter,
  BarChart3
} from "lucide-react";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { toast } from "@/hooks/use-toast";

interface TrainingModule {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number; // minutes
  commands: {
    command: string;
    description: string;
    example: string;
  }[];
  practiceScenarios: {
    id: string;
    scenario: string;
    steps: string[];
    expectedCommands: string[];
  }[];
  completed: boolean;
  score: number;
}

const trainingModules: TrainingModule[] = [
  {
    id: "workflow-basics",
    name: "Workflow Basics",
    description: "Learn fundamental workflow creation and management",
    icon: Zap,
    difficulty: "beginner",
    estimatedTime: 15,
    commands: [
      {
        command: "Create new workflow",
        description: "Start a new automation workflow",
        example: "Say: 'Create new workflow' or 'Start new automation'"
      },
      {
        command: "Add trigger step",
        description: "Add a trigger to start your workflow",
        example: "Say: 'Add trigger' or 'Create trigger step'"
      },
      {
        command: "Add action step",
        description: "Add an action to your workflow",
        example: "Say: 'Add action' or 'Create action step'"
      },
      {
        command: "Save workflow",
        description: "Save your current workflow",
        example: "Say: 'Save workflow' or 'Save automation'"
      }
    ],
    practiceScenarios: [
      {
        id: "basic-workflow",
        scenario: "Create a simple email notification workflow",
        steps: [
          "Create a new workflow",
          "Add a Gmail trigger for new emails",
          "Add a Slack action to send notifications",
          "Save the workflow"
        ],
        expectedCommands: [
          "Create new workflow",
          "Add trigger step",
          "Connect Gmail",
          "Add action step",
          "Connect Slack",
          "Save workflow"
        ]
      }
    ],
    completed: false,
    score: 0
  },
  {
    id: "data-transformation",
    name: "Data Transformation",
    description: "Master data mapping and transformation techniques",
    icon: Database,
    difficulty: "intermediate",
    estimatedTime: 25,
    commands: [
      {
        command: "Open data mapper",
        description: "Open the visual data mapping interface",
        example: "Say: 'Open data mapper' or 'Show field mapping'"
      },
      {
        command: "Map field [source] to [target]",
        description: "Map a source field to a target field",
        example: "Say: 'Map email to customer_email' or 'Connect name to full_name'"
      },
      {
        command: "Add transformation",
        description: "Add a data transformation function",
        example: "Say: 'Add transformation' or 'Apply formula'"
      },
      {
        command: "Test transformation",
        description: "Test your data transformation",
        example: "Say: 'Test transformation' or 'Preview results'"
      }
    ],
    practiceScenarios: [
      {
        id: "field-mapping",
        scenario: "Transform customer data between systems",
        steps: [
          "Open the data transformation interface",
          "Map source fields to target fields",
          "Add uppercase transformation to name field",
          "Test the transformation with sample data"
        ],
        expectedCommands: [
          "Open data mapper",
          "Map name to customer_name",
          "Map email to customer_email",
          "Add transformation",
          "Test transformation"
        ]
      }
    ],
    completed: false,
    score: 0
  },
  {
    id: "conditional-logic",
    name: "Conditional Logic",
    description: "Learn to create smart workflows with conditions",
    icon: GitBranch,
    difficulty: "intermediate",
    estimatedTime: 20,
    commands: [
      {
        command: "Add condition",
        description: "Add a conditional step to your workflow",
        example: "Say: 'Add condition' or 'Create filter'"
      },
      {
        command: "Set condition [field] [operator] [value]",
        description: "Set a specific condition",
        example: "Say: 'Set condition status equals active' or 'If priority is high'"
      },
      {
        command: "Add else branch",
        description: "Add an alternative path for false conditions",
        example: "Say: 'Add else branch' or 'Create alternative path'"
      }
    ],
    practiceScenarios: [
      {
        id: "priority-routing",
        scenario: "Route emails based on priority",
        steps: [
          "Add a condition to check email priority",
          "Create high priority path to Slack",
          "Create low priority path to email archive",
          "Test both conditions"
        ],
        expectedCommands: [
          "Add condition",
          "Set condition priority equals high",
          "Add action step",
          "Add else branch",
          "Test workflow"
        ]
      }
    ],
    completed: false,
    score: 0
  },
  {
    id: "webhooks-advanced",
    name: "Advanced Webhooks",
    description: "Master webhook creation and management",
    icon: Webhook,
    difficulty: "advanced",
    estimatedTime: 30,
    commands: [
      {
        command: "Create webhook",
        description: "Create a new webhook endpoint",
        example: "Say: 'Create webhook' or 'Generate webhook URL'"
      },
      {
        command: "Set webhook method [method]",
        description: "Set the HTTP method for webhook",
        example: "Say: 'Set webhook method POST' or 'Use GET method'"
      },
      {
        command: "Add webhook authentication",
        description: "Add security to your webhook",
        example: "Say: 'Add webhook authentication' or 'Secure webhook'"
      },
      {
        command: "Test webhook",
        description: "Send a test request to your webhook",
        example: "Say: 'Test webhook' or 'Send test payload'"
      }
    ],
    practiceScenarios: [
      {
        id: "secure-webhook",
        scenario: "Create a secure webhook for external integrations",
        steps: [
          "Create a new webhook endpoint",
          "Set it to use POST method",
          "Add API key authentication",
          "Test with sample payload",
          "Configure response handling"
        ],
        expectedCommands: [
          "Create webhook",
          "Set webhook method POST",
          "Add webhook authentication",
          "Test webhook",
          "Save webhook configuration"
        ]
      }
    ],
    completed: false,
    score: 0
  },
  {
    id: "team-collaboration",
    name: "Team Collaboration",
    description: "Learn team features and workflow sharing",
    icon: Users,
    difficulty: "intermediate",
    estimatedTime: 18,
    commands: [
      {
        command: "Share workflow",
        description: "Share a workflow with team members",
        example: "Say: 'Share workflow' or 'Add team member'"
      },
      {
        command: "Set permissions [user] [role]",
        description: "Set user permissions for workflow",
        example: "Say: 'Set permissions john editor' or 'Make sarah viewer'"
      },
      {
        command: "Create team folder",
        description: "Organize workflows in team folders",
        example: "Say: 'Create team folder' or 'New folder for marketing'"
      }
    ],
    practiceScenarios: [
      {
        id: "team-workflow",
        scenario: "Set up a shared marketing workflow",
        steps: [
          "Create a team folder for marketing",
          "Share workflow with marketing team",
          "Set different permission levels",
          "Add workflow description and documentation"
        ],
        expectedCommands: [
          "Create team folder",
          "Share workflow",
          "Set permissions sarah editor",
          "Set permissions john viewer",
          "Add workflow description"
        ]
      }
    ],
    completed: false,
    score: 0
  },
  {
    id: "monitoring-analytics",
    name: "Monitoring & Analytics",
    description: "Track workflow performance and troubleshoot issues",
    icon: BarChart3,
    difficulty: "advanced",
    estimatedTime: 22,
    commands: [
      {
        command: "Show workflow stats",
        description: "Display workflow performance metrics",
        example: "Say: 'Show workflow stats' or 'Display analytics'"
      },
      {
        command: "View error logs",
        description: "Check workflow error logs",
        example: "Say: 'View error logs' or 'Show failed runs'"
      },
      {
        command: "Set up alerts",
        description: "Configure workflow monitoring alerts",
        example: "Say: 'Set up alerts' or 'Create failure notification'"
      }
    ],
    practiceScenarios: [
      {
        id: "workflow-monitoring",
        scenario: "Set up comprehensive workflow monitoring",
        steps: [
          "View current workflow performance",
          "Analyze error patterns",
          "Set up failure alerts",
          "Configure performance notifications",
          "Create monitoring dashboard"
        ],
        expectedCommands: [
          "Show workflow stats",
          "View error logs",
          "Set up alerts",
          "Configure notifications",
          "Create dashboard"
        ]
      }
    ],
    completed: false,
    score: 0
  }
];

export const ComprehensiveVoiceTraining: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isTraining, setIsTraining] = useState(false);
  const [modules, setModules] = useState<TrainingModule[]>(trainingModules);
  const [overallProgress, setOverallProgress] = useState(0);
  const { isEnabled, isListening, startListening, stopListening, speakText } = useVoiceAssistant();

  const currentModule = modules.find(m => m.id === selectedModule);
  const completedModules = modules.filter(m => m.completed).length;

  useEffect(() => {
    const progress = (completedModules / modules.length) * 100;
    setOverallProgress(progress);
  }, [completedModules, modules.length]);

  const startModuleTraining = (moduleId: string) => {
    setSelectedModule(moduleId);
    setCurrentScenario(0);
    setCurrentStep(0);
    setIsTraining(true);
    
    const module = modules.find(m => m.id === moduleId);
    if (module && isEnabled) {
      speakText(`Starting ${module.name} training. This module will take approximately ${module.estimatedTime} minutes to complete.`);
    }
  };

  const completeModule = (moduleId: string, score: number) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId 
        ? { ...m, completed: true, score }
        : m
    ));
    
    toast({
      title: "Module Completed!",
      description: `You've completed ${currentModule?.name} with a score of ${score}%`,
    });
    
    if (isEnabled) {
      speakText(`Congratulations! You've completed the ${currentModule?.name} module with a score of ${score} percent.`);
    }
    
    setIsTraining(false);
    setSelectedModule(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedModule && currentModule) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <currentModule.icon className="h-6 w-6" />
              <div>
                <CardTitle>{currentModule.name}</CardTitle>
                <CardDescription>{currentModule.description}</CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={() => setSelectedModule(null)}>
              Exit Training
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className={getDifficultyColor(currentModule.difficulty)}>
              {currentModule.difficulty}
            </Badge>
            <span className="text-sm text-gray-500">
              ~{currentModule.estimatedTime} minutes
            </span>
          </div>
          
          <Tabs defaultValue="commands" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="commands">Voice Commands</TabsTrigger>
              <TabsTrigger value="practice">Practice Scenarios</TabsTrigger>
              <TabsTrigger value="test">Live Practice</TabsTrigger>
            </TabsList>
            
            <TabsContent value="commands" className="space-y-4">
              <h3 className="text-lg font-semibold">Available Voice Commands</h3>
              <div className="grid gap-4">
                {currentModule.commands.map((cmd, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mic className="h-4 w-4 text-purple-500" />
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {cmd.command}
                          </code>
                        </div>
                        <p className="text-sm text-gray-600">{cmd.description}</p>
                        <p className="text-xs text-gray-500">{cmd.example}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="practice" className="space-y-4">
              <h3 className="text-lg font-semibold">Practice Scenarios</h3>
              {currentModule.practiceScenarios.map((scenario, index) => (
                <Card key={scenario.id}>
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2">{scenario.scenario}</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-1">Steps to Complete:</h5>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          {scenario.steps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-1">Expected Commands:</h5>
                        <div className="flex flex-wrap gap-2">
                          {scenario.expectedCommands.map((cmd, cmdIndex) => (
                            <Badge key={cmdIndex} variant="outline" className="text-xs">
                              {cmd}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="test" className="space-y-4">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Live Voice Practice</h3>
                <p className="text-gray-600">
                  Practice the commands in real-time with voice recognition
                </p>
                
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    disabled={!isEnabled}
                    className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                    {isListening ? "Stop Listening" : "Start Voice Practice"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => completeModule(currentModule.id, 85)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Module
                  </Button>
                </div>
                
                {!isEnabled && (
                  <p className="text-yellow-600 text-sm">
                    Enable voice assistant to use live practice features
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Comprehensive Voice Training</span>
          </CardTitle>
          <CardDescription>
            Master all aspects of workflow automation with voice commands
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{completedModules}/{modules.length} modules completed</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <Card 
                key={module.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  module.completed ? 'border-green-200 bg-green-50' : ''
                }`}
                onClick={() => startModuleTraining(module.id)}
              >
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <module.icon className="h-6 w-6 text-purple-600" />
                      {module.completed && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{module.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        ~{module.estimatedTime}min
                      </span>
                    </div>
                    
                    {module.completed && (
                      <div className="text-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Score: {module.score}%
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
