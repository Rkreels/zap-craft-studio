
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { dashboardScripts } from "@/data/voiceScripts";

export function GetStartedCard() {
  const voiceProps = {
    elementName: "Get Started Card",
    hoverText: dashboardScripts.getStartedCard.hover,
    clickText: dashboardScripts.getStartedCard.click
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(voiceProps);
  
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-6"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-16 h-24 border-2 border-gray-300 rounded-md opacity-40"></div>
            <div className="absolute -top-1.5 -left-1.5 w-16 h-24 border-2 border-gray-300 rounded-md opacity-70"></div>
            <div className="relative w-16 h-24 border-2 border-gray-300 rounded-md bg-white flex items-center justify-center">
              <Zap className="text-orange-500" size={28} />
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">Get started with Zapier</h3>
          <p className="text-gray-600 mb-4">
            Zapier connects your apps and automates workflows. Build automations called Zaps that connect your apps and services together. Start with a template below or create a custom Zap from scratch.
          </p>
          <Link to="/zaps/create">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
