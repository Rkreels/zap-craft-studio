
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { dashboardScripts } from "@/data/voiceScripts";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  className?: string;
  onClick?: () => boolean; // Added onClick prop
}

export function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  path,
  className,
  onClick 
}: FeatureCardProps) {
  const voiceProps = {
    elementName: `${title} feature card`,
    hoverText: dashboardScripts.featureCard.hover,
    clickText: dashboardScripts.featureCard.click(title)
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(voiceProps);
  
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick && !onClick()) {
      e.preventDefault();
    }
    
    // Call handleClick without passing the event - this fixes the error
    handleClick();
  };

  return (
    <Link
      to={path}
      className={cn(
        "bg-white border border-gray-200 rounded-lg p-4 transition-all",
        "hover:border-orange-400 hover:shadow-md hover:-translate-y-1",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onClick={handleCardClick}
    >
      <div className="flex flex-col h-full">
        <div className="mb-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-orange-100 text-orange-500">
            <Icon size={24} />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}
