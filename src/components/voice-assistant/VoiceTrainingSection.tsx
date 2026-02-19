
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, Play, Volume2 } from "lucide-react";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { voiceTrainingScripts } from "@/data/voiceScripts";
import { cn } from "@/lib/utils";

interface VoiceTrainingSectionProps {
  onComplete?: () => void;
}

export const VoiceTrainingSection: React.FC<VoiceTrainingSectionProps> = ({ onComplete }) => {
  const { 
    isEnabled, 
    isListening, 
    startListening, 
    stopListening, 
    lastCommand,
    confidenceLevel,
    speakText,
    trainingProgress 
  } = useVoiceAssistant();
  
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [recordedPhrases, setRecordedPhrases] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const currentScript = voiceTrainingScripts[currentScriptIndex];
  
  // Handle recording completion
  const handleRecordingComplete = () => {
    if (lastCommand) {
      setRecordedPhrases(prev => [...prev, lastCommand]);
    }
    
    // Move to next script or show results
    if (currentScriptIndex < voiceTrainingScripts.length - 1) {
      setCurrentScriptIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      if (onComplete) {
        onComplete();
      }
    }
  };
  
  // Play the current phrase using text-to-speech
  const playCurrentPhrase = () => {
    if (currentScript) {
      speakText(currentScript.phrase);
    }
  };
  
  // Calculate match score between original phrase and recorded phrase
  const calculateMatchScore = (original: string, recorded: string): number => {
    if (!recorded) return 0;
    
    const originalWords = original.toLowerCase().split(' ');
    const recordedWords = recorded.toLowerCase().split(' ');
    
    let matchCount = 0;
    originalWords.forEach(word => {
      if (recordedWords.includes(word)) {
        matchCount++;
      }
    });
    
    return (matchCount / originalWords.length) * 100;
  };
  
  // Render training interface
  const renderTrainingInterface = () => {
    return (
      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Phrase {currentScriptIndex + 1} of {voiceTrainingScripts.length}</h3>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md mb-6">
            <p className="text-lg">{currentScript.phrase}</p>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={playCurrentPhrase}
              className="h-10 w-10"
            >
              <Play className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant={isListening ? "default" : "outline"}
                onClick={() => isListening ? stopListening() : startListening()}
                disabled={!isEnabled}
                className={cn(
                  "gap-2",
                  isListening && "bg-red-500 hover:bg-red-600"
                )}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </>
                )}
              </Button>
              
              <Button
                variant="default"
                onClick={handleRecordingComplete}
                disabled={!lastCommand}
              >
                Next
              </Button>
            </div>
          </div>
          
          {lastCommand && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Recorded phrase:</p>
              <p>{lastCommand}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Recognition confidence</span>
              <span>{Math.round(confidenceLevel * 100)}%</span>
            </div>
            <Progress 
              value={confidenceLevel * 100} 
              className="h-2 bg-gray-200 dark:bg-gray-700"
            />
          </div>
        </div>
        
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Training progress</span>
              <span>{trainingProgress}%</span>
            </div>
            <Progress 
              value={trainingProgress} 
              className="h-2 bg-gray-200 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>
    );
  };
  
  // Render results
  const renderResults = () => {
    return (
      <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm space-y-6">
        <h3 className="text-lg font-medium">Training Results</h3>
        
        <div className="space-y-4">
          {voiceTrainingScripts.map((script, index) => {
            const recorded = recordedPhrases[index] || "";
            const matchScore = calculateMatchScore(script.phrase, recorded);
            
            return (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="font-medium mb-2">Phrase {index + 1}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Original</p>
                    <p>{script.phrase}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recorded</p>
                    <p>{recorded || "No recording"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Match accuracy</span>
                    <span>{Math.round(matchScore)}%</span>
                  </div>
                  <Progress 
                    value={matchScore} 
                    className="h-2 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => {
            setShowResults(false);
            setCurrentScriptIndex(0);
            setRecordedPhrases([]);
          }}>
            Train Again
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Voice Recognition Training</h2>
        <p className="text-muted-foreground mt-2">
          Improve the voice assistant's ability to understand your commands
        </p>
      </div>
      
      <Separator />
      
      {!isEnabled && (
        <div className="p-6 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-900/50 rounded-lg text-center">
          <Volume2 className="h-8 w-8 text-sky-500 mx-auto mb-2" />
          <p>Voice assistant is currently disabled. Enable it to start training.</p>
        </div>
      )}
      
      {isEnabled && (showResults ? renderResults() : renderTrainingInterface())}
    </div>
  );
};

export default VoiceTrainingSection;
