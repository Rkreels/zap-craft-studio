
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Volume, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface SettingsSectionProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ apiKey, setApiKey }) => {
  const [voiceType, setVoiceType] = useState("Bella (Female)");
  const [speechRate, setSpeechRate] = useState("1");
  const [volume, setVolume] = useState("0.8");
  const [wakeWord, setWakeWord] = useState("Hey Assistant");
  const [timeout, setTimeout] = useState("10");
  const [autoListen, setAutoListen] = useState(true);
  const [model, setModel] = useState("eleven_turbo_v2");

  const handleSaveSettings = () => {
    if (apiKey) {
      toast({
        title: "Settings Saved",
        description: "Your voice assistant is now configured.",
      });
    } else {
      toast({
        title: "API Key Required",
        description: "Please enter your API key before saving.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Volume size={20} className="mr-2" />
          Voice Assistant Settings
        </CardTitle>
        <CardDescription>Configure your voice assistant preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center p-4 bg-sky-50 border border-sky-200 rounded-md">
          <Info size={20} className="text-sky-600 mr-2" />
          <p className="text-sm">
            Voice assistant functionality requires an ElevenLabs API key. 
            <a href="https://elevenlabs.io" className="text-purple-600 hover:underline ml-1" target="_blank" rel="noreferrer">
              Get your API key
            </a>
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Voice Settings</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="voiceType">Voice Type</Label>
                  <select 
                    id="voiceType" 
                    className="w-full border rounded p-2"
                    value={voiceType}
                    onChange={(e) => setVoiceType(e.target.value)}
                  >
                    <option>Bella (Female)</option>
                    <option>Adam (Male)</option>
                    <option>Sam (Neutral)</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="speechRate">Speech Rate</Label>
                  <input 
                    id="speechRate" 
                    type="range" 
                    className="w-full" 
                    min="0.5" 
                    max="1.5" 
                    step="0.1" 
                    value={speechRate}
                    onChange={(e) => setSpeechRate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="volume">Volume</Label>
                  <input 
                    id="volume" 
                    type="range" 
                    className="w-full" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Assistant Settings</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="wakeWord">Wake Word</Label>
                  <input 
                    id="wakeWord" 
                    type="text" 
                    className="w-full border rounded p-2" 
                    value={wakeWord}
                    onChange={(e) => setWakeWord(e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="timeout">Listening Timeout (seconds)</Label>
                  <input 
                    id="timeout" 
                    type="number" 
                    className="w-full border rounded p-2" 
                    min="5" 
                    max="30" 
                    value={timeout}
                    onChange={(e) => setTimeout(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-listen" 
                    checked={autoListen}
                    onCheckedChange={setAutoListen}
                  />
                  <Label htmlFor="auto-listen">Auto-listen after response</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">API Configuration</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="apiKeyConfig">ElevenLabs API Key</Label>
                <input 
                  id="apiKeyConfig" 
                  type="password" 
                  className="w-full border rounded p-2" 
                  placeholder="Enter your API key" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="model">Model</Label>
                <select 
                  id="model" 
                  className="w-full border rounded p-2"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option>eleven_turbo_v2</option>
                  <option>eleven_multilingual_v2</option>
                  <option>eleven_monolingual_v1</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <Button className="w-full" onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
