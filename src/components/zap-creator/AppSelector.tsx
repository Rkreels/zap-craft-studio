
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { zapCreatorScripts } from "@/data/voiceScripts";

export interface AppItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  color?: string;
  popular?: boolean;
}

interface AppSelectorProps {
  title: string;
  description: string;
  apps: AppItem[];
  onSelectApp: (app: AppItem) => void;
  selectedAppId?: string;
  className?: string;
}

export const AppSelector = ({
  title,
  description,
  apps,
  onSelectApp,
  selectedAppId,
  className
}: AppSelectorProps) => {
  const popularApps = apps.filter(app => app.popular);
  const otherApps = apps.filter(app => !app.popular);
  
  const voiceProps = {
    elementName: "App Selector",
    hoverText: zapCreatorScripts.appSelector.hover,
    clickText: zapCreatorScripts.appSelector.click
  };
  
  const { handleMouseEnter, handleClick } = useVoiceGuidance(voiceProps);

  return (
    <div 
      className={cn("space-y-4", className)}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <div>
        <h4 className="font-medium text-lg">{title}</h4>
        <p className="text-gray-500 text-sm mb-3">{description}</p>
      </div>
      
      {popularApps.length > 0 && (
        <>
          <h5 className="font-medium text-sm text-gray-500">POPULAR</h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {popularApps.map(app => (
              <AppCard 
                key={app.id} 
                app={app} 
                onClick={() => onSelectApp(app)}
                selected={app.id === selectedAppId}
              />
            ))}
          </div>
        </>
      )}

      {otherApps.length > 0 && (
        <>
          <h5 className="font-medium text-sm text-gray-500 mt-4">ALL APPS</h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherApps.map(app => (
              <AppCard 
                key={app.id} 
                app={app} 
                onClick={() => onSelectApp(app)}
                selected={app.id === selectedAppId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

interface AppCardProps {
  app: AppItem;
  onClick: () => void;
  selected?: boolean;
}

const AppCard = ({ app, onClick, selected }: AppCardProps) => {
  const bgColor = app.color || 'bg-gray-100';
  
  return (
    <Card 
      className={cn(
        "border border-gray-200 rounded-md p-3 flex flex-col items-center cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-all",
        selected && "border-purple-500 bg-purple-50"
      )}
      onClick={onClick}
    >
      <div className={cn(`w-12 h-12 rounded-md flex items-center justify-center text-white font-bold`, bgColor)}>
        {app.icon}
      </div>
      <p className="mt-2 text-sm font-medium text-center">{app.name}</p>
    </Card>
  );
};
