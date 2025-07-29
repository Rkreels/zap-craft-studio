import React, { useEffect, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { useEnhancedVoiceAssistant } from "@/contexts/EnhancedVoiceAssistantContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Target, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Lightbulb
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PageCommand {
  command: string;
  description: string;
  example: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

const pageCommands: Record<string, PageCommand[]> = {
  "/": [
    {
      command: "create workflow",
      description: "Start creating a new automation workflow",
      example: "Say 'create workflow' or 'new automation'",
      difficulty: "easy",
      category: "creation"
    },
    {
      command: "view interfaces",
      description: "Navigate to interface management",
      example: "Say 'view interfaces' or 'open interfaces'",
      difficulty: "easy",
      category: "navigation"
    },
    {
      command: "open analytics",
      description: "View analytics dashboard",
      example: "Say 'open analytics' or 'show analytics'",
      difficulty: "easy",
      category: "navigation"
    }
  ],
  "/interfaces": [
    {
      command: "create interface",
      description: "Start creating a new interface",
      example: "Say 'create interface' or 'new interface'",
      difficulty: "easy",
      category: "creation"
    },
    {
      command: "gallery view",
      description: "Switch to gallery view",
      example: "Say 'gallery view' or 'show gallery'",
      difficulty: "easy",
      category: "view"
    },
    {
      command: "table view",
      description: "Switch to table view",
      example: "Say 'table view' or 'list view'",
      difficulty: "easy",
      category: "view"
    },
    {
      command: "filter by forms",
      description: "Filter to show only form interfaces",
      example: "Say 'filter by forms' or 'show forms only'",
      difficulty: "medium",
      category: "filtering"
    },
    {
      command: "export interfaces",
      description: "Export selected interfaces",
      example: "Say 'export interfaces' or 'download interfaces'",
      difficulty: "medium",
      category: "action"
    }
  ],
  "/zaps": [
    {
      command: "create workflow",
      description: "Create a new workflow",
      example: "Say 'create workflow' or 'new automation'",
      difficulty: "easy",
      category: "creation"
    },
    {
      command: "add trigger",
      description: "Add a trigger to the workflow",
      example: "Say 'add trigger' or 'create trigger'",
      difficulty: "medium",
      category: "building"
    },
    {
      command: "add action",
      description: "Add an action to the workflow",
      example: "Say 'add action' or 'create action'",
      difficulty: "medium",
      category: "building"
    },
    {
      command: "test workflow",
      description: "Test the current workflow",
      example: "Say 'test workflow' or 'run test'",
      difficulty: "hard",
      category: "testing"
    },
    {
      command: "save workflow",
      description: "Save the current workflow",
      example: "Say 'save workflow' or 'save automation'",
      difficulty: "easy",
      category: "action"
    }
  ],
  "/tables": [
    {
      command: "create table",
      description: "Create a new data table",
      example: "Say 'create table' or 'new table'",
      difficulty: "easy",
      category: "creation"
    },
    {
      command: "add column",
      description: "Add a new column to the table",
      example: "Say 'add column' or 'new column'",
      difficulty: "medium",
      category: "building"
    },
    {
      command: "import data",
      description: "Import data from CSV or other sources",
      example: "Say 'import data' or 'upload data'",
      difficulty: "hard",
      category: "action"
    }
  ],
  "/chatbot": [
    {
      command: "create chatbot",
      description: "Create a new chatbot",
      example: "Say 'create chatbot' or 'new bot'",
      difficulty: "easy",
      category: "creation"
    },
    {
      command: "add intent",
      description: "Add a new intent to the chatbot",
      example: "Say 'add intent' or 'create intent'",
      difficulty: "medium",
      category: "building"
    },
    {
      command: "train chatbot",
      description: "Start training the chatbot",
      example: "Say 'train chatbot' or 'train bot'",
      difficulty: "hard",
      category: "training"
    },
    {
      command: "test chatbot",
      description: "Test the chatbot responses",
      example: "Say 'test chatbot' or 'try bot'",
      difficulty: "medium",
      category: "testing"
    }
  ]
};

export const PageSpecificVoiceTrainer: React.FC = () => {
  const location = useLocation();
  const {
    isEnabled,
    isListening,
    isTraining,
    startListening,
    stopListening,
    speakText,
    lastCommand,
    confidenceLevel,
    startTrainingSession,
    endTrainingSession,
    setTrainingMode,
    currentContext
  } = useEnhancedVoiceAssistant();

  const [currentCommands, setCurrentCommands] = useState<PageCommand[]>([]);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [practiceProgress, setPracticeProgress] = useState(0);
  const [practiceResults, setPracticeResults] = useState<{ command: string; success: boolean }[]>([]);
  const [showHint, setShowHint] = useState(false);

  // Update commands when page changes
  useEffect(() => {
    const pathname = location.pathname;
    const commands = pageCommands[pathname] || pageCommands["/"];
    setCurrentCommands(commands);
    
    // Reset practice mode when page changes
    if (practiceMode) {
      endPracticeMode();
    }
  }, [location.pathname]);

  // Announce available commands when context changes
  useEffect(() => {
    if (isEnabled && currentCommands.length > 0) {
      const pageName = location.pathname === "/" ? "dashboard" : location.pathname.slice(1);
      setTimeout(() => {
        speakText(`You're on the ${pageName} page. There are ${currentCommands.length} voice commands available for this page.`);
      }, 1000);
    }
  }, [currentCommands, isEnabled, location.pathname]);

  // Handle voice command recognition during practice
  useEffect(() => {
    if (!practiceMode || !lastCommand || currentCommandIndex >= currentCommands.length) return;

    const currentCommand = currentCommands[currentCommandIndex];
    const userCommand = lastCommand.toLowerCase().trim();
    const targetCommand = currentCommand.command.toLowerCase();
    
    // Check if command matches
    const isMatch = userCommand.includes(targetCommand) || 
                   targetCommand.includes(userCommand) ||
                   calculateSimilarity(userCommand, targetCommand) > 0.7;

    if (isMatch) {
      // Success
      setPracticeResults(prev => [...prev, { command: currentCommand.command, success: true }]);
      speakText("Perfect! Command recognized successfully.");
      
      setTimeout(() => {
        nextCommand();
      }, 1500);
    } else if (confidenceLevel < 0.5) {
      speakText("I didn't catch that clearly. Please try again.");
    } else {
      // Close but not exact
      speakText(`Close, but try saying: ${currentCommand.command}`);
      setShowHint(true);
    }
  }, [lastCommand, practiceMode, currentCommandIndex, currentCommands, confidenceLevel]);

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    
    let matches = 0;
    words2.forEach(word => {
      if (words1.some(w => w.includes(word) || word.includes(w))) {
        matches++;
      }
    });
    
    return matches / words2.length;
  };

  const startPracticeMode = () => {
    if (currentCommands.length === 0) {
      toast({
        title: "No commands available",
        description: "No voice commands are available for this page.",
        variant: "destructive"
      });
      return;
    }

    setPracticeMode(true);
    setCurrentCommandIndex(0);
    setPracticeProgress(0);
    setPracticeResults([]);
    setShowHint(false);
    
    startTrainingSession(currentContext);
    
    speakText(`Starting practice mode for ${currentCommands.length} commands. Listen carefully and repeat each command.`);
    
    setTimeout(() => {
      announceCurrentCommand();
    }, 2000);
  };

  const endPracticeMode = () => {
    setPracticeMode(false);
    setCurrentCommandIndex(0);
    setPracticeProgress(0);
    setShowHint(false);
    endTrainingSession();
    
    if (practiceResults.length > 0) {
      const successCount = practiceResults.filter(r => r.success).length;
      const accuracy = Math.round((successCount / practiceResults.length) * 100);
      
      speakText(`Practice completed! Your accuracy was ${accuracy} percent.`);
      
      toast({
        title: "Practice Complete",
        description: `You completed ${successCount} out of ${practiceResults.length} commands successfully.`,
      });
    }
  };

  const announceCurrentCommand = () => {
    if (currentCommandIndex >= currentCommands.length) return;
    
    const command = currentCommands[currentCommandIndex];
    speakText(`Command ${currentCommandIndex + 1}: ${command.description}. Say: ${command.command}`);
  };

  const nextCommand = () => {
    if (currentCommandIndex < currentCommands.length - 1) {
      setCurrentCommandIndex(prev => prev + 1);
      setPracticeProgress(((currentCommandIndex + 1) / currentCommands.length) * 100);
      setShowHint(false);
      
      setTimeout(() => {
        announceCurrentCommand();
      }, 1000);
    } else {
      // Practice complete
      setPracticeProgress(100);
      endPracticeMode();
    }
  };

  const skipCommand = () => {
    setPracticeResults(prev => [...prev, { command: currentCommands[currentCommandIndex].command, success: false }]);
    speakText("Skipping to next command.");
    nextCommand();
  };

  const repeatCommand = () => {
    announceCurrentCommand();
  };

  const showCommandHint = () => {
    setShowHint(true);
    const command = currentCommands[currentCommandIndex];
    speakText(`Hint: ${command.example}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "hard": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  if (!isEnabled) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Mic className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Voice Assistant Disabled</h3>
          <p className="text-sm text-gray-600 mb-4">
            Enable voice assistant to practice page-specific commands
          </p>
        </CardContent>
      </Card>
    );
  }

  if (practiceMode) {
    const currentCommand = currentCommands[currentCommandIndex];
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Voice Command Practice</CardTitle>
              <CardDescription>
                Practice voice commands for this page
              </CardDescription>
            </div>
            <Button variant="outline" onClick={endPracticeMode}>
              Exit Practice
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{currentCommandIndex + 1} of {currentCommands.length}</span>
            </div>
            <Progress value={practiceProgress} className="h-2" />
          </div>
          
          {/* Current Command */}
          {currentCommand && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge className={getDifficultyColor(currentCommand.difficulty)}>
                    {currentCommand.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {currentCommand.category}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">{currentCommand.description}</h3>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    "{currentCommand.command}"
                  </div>
                </div>
                
                {showHint && (
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-500">
                    <div className="flex items-center space-x-1">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Hint:</span>
                    </div>
                    <p className="text-sm mt-1">{currentCommand.example}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={repeatCommand}
              title="Repeat command"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant={isListening ? "destructive" : "default"}
              onClick={() => isListening ? stopListening() : startListening()}
              className="min-w-[120px]"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Listen
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={showCommandHint}
              title="Show hint"
            >
              <Lightbulb className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={skipCommand}
              title="Skip command"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Results Summary */}
          {practiceResults.length > 0 && (
            <div className="grid grid-cols-5 gap-1">
              {practiceResults.map((result, index) => (
                <div
                  key={index}
                  className={`w-full h-2 rounded ${
                    result.success ? "bg-green-500" : "bg-red-500"
                  }`}
                  title={`${result.command}: ${result.success ? "Success" : "Skipped"}`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Page Voice Commands</CardTitle>
        <CardDescription>
          Practice voice commands available on this page
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentCommands.length > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {currentCommands.length} commands available
              </span>
              <Button onClick={startPracticeMode}>
                <Play className="h-4 w-4 mr-2" />
                Start Practice
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCommands.map((command, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{command.description}</h4>
                    <Badge className={getDifficultyColor(command.difficulty)}>
                      {command.difficulty}
                    </Badge>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-mono text-sm mb-2">
                    "{command.command}"
                  </div>
                  <p className="text-xs text-gray-500">{command.example}</p>
                  <Badge variant="outline" className="mt-2">
                    {command.category}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-medium mb-2">No commands available</h3>
            <p className="text-gray-600 text-sm">
              No voice commands are available for this page yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};