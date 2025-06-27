
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
  Code2,
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
    { icon: Code2, label: "Functions", path: "/functions" },
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
      {/* Logo/Brand */}
      <div className="flex justify-center items-center py-4 px-3">
        <div className={cn("transition-all duration-300", isExpanded ? "block" : "hidden")}>
          <span className="text-2xl font-bold text-orange-500">Zapier</span>
        </div>
        <div className={cn("transition-all duration-300", isExpanded ? "hidden" : "block")}>
          <span className="text-2xl font-bold text-orange-500">Z</span>
        </div>
      </div>

      {/* Create Zap button */}
      <div className="px-3 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/zaps/create" className="w-full block">
                <button 
                  className={cn(
                    "w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center py-2 transition-all",
                    isExpanded ? "px-4" : "px-2"
                  )}
                >
                  <Plus size={20} />
                  {isExpanded && <span className="ml-2 font-medium">Create Zap</span>}
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

      {/* Navigation */}
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

      {/* User profile section */}
      <div className={cn(
        "border-t border-gray-200 p-3 mt-auto",
        !isExpanded && "flex justify-center"
      )}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center cursor-pointer">
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
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side="right">
                <p>John Doe - Free Plan</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
