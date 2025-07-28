import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  AlertCircle
} from "lucide-react";
import { useEnhancedVoiceAssistant } from "@/contexts/EnhancedVoiceAssistantContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TrainingExercise {
  id: string;
  title: string;
  description: string;
  commands: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  estimatedTime: number;
  completed: boolean;
  score?: number;
}

const trainingExercises: TrainingExercise[] = [
  {
    id: "basic-navigation",
    title: "Basic Navigation",
    description: "Learn essential navigation commands",
    commands: [
      "go to dashboard",
      "open interfaces",
      "show workflows",
      "navigate to tables",
      "view chatbots"
    ],
    difficulty: "beginner",
    category: "Navigation",
    estimatedTime: 5,
    completed: false
  },
  {
    id: "workflow-creation",
    title: "Workflow Creation",
    description: "Practice workflow and automation commands",
    commands: [
      "create new workflow",
      "add trigger step",
      "add action step",
      "connect to gmail",
      "save workflow",
      "test automation"
    ],
    difficulty: "intermediate",
    category: "Workflows",
    estimatedTime: 8,
    completed: false
  },
  {
    id: "interface-management",
    title: "Interface Management",
    description: "Master interface creation and editing",
    commands: [
      "create new interface",
      "add form field",
      "set field type to email",
      "add validation rules",
      "preview interface",
      "publish interface"
    ],
    difficulty: "intermediate",
    category: "Interfaces",
    estimatedTime: 7,
    completed: false
  },
  {
    id: "advanced-features",
    title: "Advanced Features",
    description: "Learn complex automation commands",
    commands: [
      "create conditional logic",
      "add data transformation",
      "set up webhook endpoint",
      "configure error handling",
      "enable monitoring",
      "export configuration"
    ],
    difficulty: "advanced",
    category: "Advanced",
    estimatedTime: 12,
    completed: false
  }
];

export const InteractiveVoiceTrainer: React.FC = () => {
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
    getTrainingFeedback,
    setTrainingMode,
    resetTraining,
    trainingSessions,
    currentContext
  } = useEnhancedVoiceAssistant();

  const [selectedExercise, setSelectedExercise] = useState<TrainingExercise | null>(null);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState(0);
  const [exercises, setExercises] = useState<TrainingExercise[]>(trainingExercises);
  const [userAttempt, setUserAttempt] = useState("");
  const [exerciseScore, setExerciseScore] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isExerciseComplete, setIsExerciseComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentCommand = selectedExercise?.commands[currentCommandIndex];
  const completedExercises = exercises.filter(ex => ex.completed).length;
  const totalAccuracy = trainingSessions.reduce((acc, session) => acc + session.accuracy, 0) / trainingSessions.length || 0;

  // Calculate similarity between user command and target command
  const calculateSimilarity = useCallback((userCmd: string, targetCmd: string): number => {
    const user = userCmd.toLowerCase().trim();
    const target = targetCmd.toLowerCase().trim();
    
    if (user === target) return 1.0;
    
    const userWords = user.split(' ');
    const targetWords = target.split(' ');
    
    let matchingWords = 0;
    targetWords.forEach(word => {
      if (userWords.includes(word)) {
        matchingWords++;
      }
    });
    
    return matchingWords / targetWords.length;
  }, []);

  // Handle command recognition during training
  useEffect(() => {
    if (!selectedExercise || !lastCommand || !isTraining) return;

    const similarity = calculateSimilarity(lastCommand, currentCommand || "");
    const isGoodMatch = similarity >= 0.7;

    if (isGoodMatch) {
      const score = Math.round(similarity * confidenceLevel * 100);
      setExerciseScore(prev => prev + score);
      setFeedbackText(`Great! Command recognized with ${Math.round(similarity * 100)}% accuracy.`);
      
      speakText("Excellent! Moving to next command.");
      
      setTimeout(() => {
        if (currentCommandIndex < selectedExercise.commands.length - 1) {
          setCurrentCommandIndex(prev => prev + 1);
          setExerciseProgress(((currentCommandIndex + 1) / selectedExercise.commands.length) * 100);
        } else {
          completeExercise();
        }
      }, 1500);
    } else if (confidenceLevel < 0.5) {
      setFeedbackText("I didn't quite catch that. Please speak more clearly.");
      speakText("Please repeat the command more clearly.");
    } else {
      setFeedbackText(`Close! Try saying: "${currentCommand}"`);
      speakText("Close, but not quite right. Try again.");
    }
  }, [lastCommand, selectedExercise, currentCommand, currentCommandIndex, confidenceLevel, calculateSimilarity, isTraining]);

  const startExercise = (exercise: TrainingExercise) => {
    setSelectedExercise(exercise);
    setCurrentCommandIndex(0);
    setExerciseProgress(0);
    setExerciseScore(0);
    setIsExerciseComplete(false);
    setFeedbackText("");
    setShowHint(false);
    
    startTrainingSession(exercise.category.toLowerCase());
    
    setTimeout(() => {
      speakText(`Starting ${exercise.title} training. Listen carefully and repeat each command.`);
      setTimeout(() => {
        speakText(`First command: ${exercise.commands[0]}`);
      }, 2000);
    }, 500);
  };

  const completeExercise = () => {
    if (!selectedExercise) return;
    
    const finalScore = Math.round(exerciseScore / selectedExercise.commands.length);
    
    setExercises(prev => prev.map(ex => 
      ex.id === selectedExercise.id 
        ? { ...ex, completed: true, score: finalScore }
        : ex
    ));
    
    setIsExerciseComplete(true);
    setExerciseProgress(100);
    
    endTrainingSession();
    
    const message = finalScore >= 80 
      ? `Outstanding! You completed ${selectedExercise.title} with ${finalScore}% accuracy.`
      : finalScore >= 60
      ? `Good job! You completed ${selectedExercise.title} with ${finalScore}% accuracy. Keep practicing!`
      : `Exercise completed with ${finalScore}% accuracy. Consider practicing this exercise again.`;
    
    speakText(message);
    
    toast({
      title: "Exercise Complete!",
      description: `${selectedExercise.title} completed with ${finalScore}% score.`,
      variant: finalScore >= 60 ? "default" : "destructive"
    });
  };

  const skipCommand = () => {
    if (!selectedExercise) return;
    
    speakText("Skipping to next command.");
    
    if (currentCommandIndex < selectedExercise.commands.length - 1) {
      setCurrentCommandIndex(prev => prev + 1);
      setExerciseProgress(((currentCommandIndex + 1) / selectedExercise.commands.length) * 100);
      
      setTimeout(() => {
        speakText(`Next command: ${selectedExercise.commands[currentCommandIndex + 1]}`);
      }, 1000);
    } else {
      completeExercise();
    }
  };

  const repeatCommand = () => {
    if (currentCommand) {
      speakText(`Repeat after me: ${currentCommand}`);
    }
  };

  const showCommandHint = () => {
    setShowHint(true);
    if (currentCommand) {
      const words = currentCommand.split(' ');
      const hint = `This command has ${words.length} words and starts with "${words[0]}"`;
      speakText(hint);
      setFeedbackText(hint);
    }
  };

  const exitExercise = () => {
    setSelectedExercise(null);
    setCurrentCommandIndex(0);
    setExerciseProgress(0);
    setIsExerciseComplete(false);
    endTrainingSession();
    stopSpeaking();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500 text-white";
      case "intermediate": return "bg-yellow-500 text-white";
      case "advanced": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return <Target className="h-4 w-4" />;
      case "intermediate": return <Brain className="h-4 w-4" />;
      case "advanced": return <Activity className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  if (!isEnabled) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <VolumeX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Voice Assistant Disabled</h3>
          <p className="text-gray-600 mb-4">
            Enable the voice assistant to start interactive training
          </p>
          <Button variant="outline">
            Enable Voice Assistant
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (selectedExercise) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getDifficultyIcon(selectedExercise.difficulty)}
              <div>
                <CardTitle>{selectedExercise.title}</CardTitle>
                <CardDescription>{selectedExercise.description}</CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={exitExercise}>
              Exit Training
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Exercise Progress</span>
              <span>{Math.round(exerciseProgress)}%</span>
            </div>
            <Progress value={exerciseProgress} className="h-2" />
          </div>
          
          {/* Current Command */}
          <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border">
            <div className="text-center space-y-4">
              <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                Command {currentCommandIndex + 1} of {selectedExercise.commands.length}
              </Badge>
              
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {currentCommand}
              </div>
              
              {showHint && (
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Hint: This command has {currentCommand?.split(' ').length} words
                </div>
              )}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={repeatCommand}
              title="Repeat command"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant={isListening ? "destructive" : "default"}
              onClick={() => isListening ? stopListening() : startListening()}
              className="min-w-[140px]"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Listening
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={showCommandHint}
              title="Show hint"
            >
              Hint
            </Button>
            
            <Button
              variant="outline"
              onClick={skipCommand}
              title="Skip command"
            >
              Skip
            </Button>
          </div>
          
          {/* Feedback */}
          {feedbackText && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">{feedbackText}</p>
            </div>
          )}
          
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
                <span>Context: {currentContext}</span>
              </div>
            </div>
          )}
          
          {/* Exercise Complete */}
          {isExerciseComplete && (
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                Exercise Complete!
              </h3>
              <p className="text-green-600 dark:text-green-300 mb-4">
                Final Score: {Math.round(exerciseScore / selectedExercise.commands.length)}%
              </p>
              <div className="flex justify-center space-x-3">
                <Button onClick={() => startExercise(selectedExercise)}>
                  Practice Again
                </Button>
                <Button variant="outline" onClick={exitExercise}>
                  Choose New Exercise
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Interactive Voice Training</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Improve your voice command accuracy with guided exercises
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{completedExercises}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{Math.round(totalAccuracy * 100)}%</div>
            <div className="text-sm text-gray-600">Avg Accuracy</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{trainingSessions.length}</div>
            <div className="text-sm text-gray-600">Sessions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{Math.round(trainingProgress)}%</div>
            <div className="text-sm text-gray-600">Progress</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Training Exercises */}
      <Card>
        <CardHeader>
          <CardTitle>Training Exercises</CardTitle>
          <CardDescription>
            Choose an exercise to practice specific voice commands
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exercises.map((exercise) => (
              <Card 
                key={exercise.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  exercise.completed && "bg-green-50 dark:bg-green-900/10 border-green-200"
                )}
                onClick={() => startExercise(exercise)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getDifficultyIcon(exercise.difficulty)}
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    {exercise.completed && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{exercise.score}%</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold mb-2">{exercise.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{exercise.commands.length} commands</span>
                    <span>~{exercise.estimatedTime} min</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setTrainingMode(!isTraining)}
            >
              {isTraining ? "Stop Training" : "Start Free Training"}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetTraining}
              className="text-red-600 hover:text-red-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Progress
            </Button>
            
            <Button
              variant="outline"
              onClick={() => speakText(getTrainingFeedback())}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Get Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};