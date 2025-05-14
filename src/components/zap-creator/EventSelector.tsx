
import React from "react";
import { cn } from "@/lib/utils";

export interface TriggerEvent {
  id: string;
  name: string;
  description: string;
  appId: string;
}

interface EventSelectorProps {
  events: TriggerEvent[];
  selectedEventId?: string;
  onSelectEvent: (event: TriggerEvent) => void;
  appIcon: string;
  appName: string;
  appColor?: string;
  title: string;
  className?: string;
}

export const EventSelector = ({ 
  events, 
  selectedEventId, 
  onSelectEvent, 
  appIcon, 
  appName,
  appColor,
  title,
  className 
}: EventSelectorProps) => {
  const bgColor = appColor || 'bg-gray-100';
  
  return (
    <div className={cn("space-y-4", className)}>
      <h4 className="font-medium text-lg">{title}</h4>
      <div className="space-y-2">
        {events.map(event => (
          <div 
            key={event.id}
            className={cn(
              "border border-gray-200 rounded-md p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors",
              selectedEventId === event.id && "border-purple-500 bg-purple-50"
            )}
            onClick={() => onSelectEvent(event)}
          >
            <div className={cn("w-8 h-8 rounded-md flex items-center justify-center text-white font-bold", bgColor)}>
              {appIcon}
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">{event.name}</p>
              <p className="text-xs text-gray-500">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
