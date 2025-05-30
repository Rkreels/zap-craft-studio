
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Search, 
  Zap,
  PenTool,
  Bot,
  Grid,
  History,
  MoreHorizontal,
  Plus,
  Settings,
  MessageSquare,
  Table,
  Layers,
  Webhook,
  BarChart3,
  Mic,
  Users,
  Function,
  Code
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar = ({ isExpanded, setIsExpanded }: SidebarProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsExpanded(false);
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Discover", path: "/discover" },
    { icon: Zap, label: "Zaps", path: "/zaps" },
    { icon: Table, label: "Tables", path: "/tables" },
    { icon: Layers, label: "Interfaces", path: "/interfaces" },
    { icon: MessageSquare, label: "Chatbot", path: "/chatbot" },
    { icon: PenTool, label: "Canvas", path: "/canvas" },
    { icon: Bot, label: "Agents", path: "/agents" },
    { icon: Grid, label: "App Connections", path: "/app-connections" },
    { icon: History, label: "Zap History", path: "/zap-history" },
    { icon: MoreHorizontal, label: "More", path: "/more" },
    { icon: Function, label: "Functions", path: "/functions" },
    { icon: Code, label: "Developer Platform", path: "/developer-platform" },
  ];

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50 shadow-lg",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex justify-center py-4">
        <span className={cn("text-2xl font-bold text-orange-500", !isExpanded && "hidden")}>
          Zapier
        </span>
        <span className={cn("text-2xl font-bold text-orange-500", isExpanded && "hidden")}>
          Z
        </span>
      </div>

      {/* Create Zap button with tooltip */}
      <div className="px-3 mb-4 mt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/zaps/create" className="w-full">
                <button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center py-2 transition-all"
                >
                  <Plus size={20} />
                  <span className={cn("ml-2 font-medium", !isExpanded && "hidden")}>Create Zap</span>
                </button>
              </NavLink>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side="right">
                <p>Create Zap</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <SidebarItem 
                icon={item.icon} 
                label={item.label} 
                path={item.path}
                isExpanded={isExpanded} 
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* User profile section at bottom */}
      <div className={cn(
        "border-t border-gray-200 p-3 mt-auto", 
        !isExpanded && "flex justify-center"
      )}>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
            JD
          </div>
          {isExpanded && (
            <div className="ml-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
