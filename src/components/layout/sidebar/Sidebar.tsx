
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
  Code,
  Filter,
  Database,
  Timer,
  FileText,
  Activity
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
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (isHovering) {
      setIsExpanded(false);
    }
  };

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Search, label: "Discover", path: "/discover" },
    { icon: Zap, label: "Zaps", path: "/zaps" },
    { icon: Table, label: "Tables", path: "/tables" },
    { icon: Layers, label: "Interfaces", path: "/interfaces" },
    { icon: MessageSquare, label: "Chatbot", path: "/chatbot" },
    { icon: PenTool, label: "Canvas", path: "/canvas" },
    { icon: Bot, label: "AI Agents", path: "/agents" },
    { icon: Grid, label: "App Connections", path: "/app-connections" },
    { icon: History, label: "History", path: "/zap-history" },
    { icon: Code2, label: "Functions", path: "/functions" },
    { icon: Code, label: "Developer Platform", path: "/developer-platform" },
    { icon: Webhook, label: "Webhooks", path: "/webhooks" },
    { icon: Filter, label: "Filters", path: "/filters" },
    { icon: Database, label: "Storage", path: "/storage" },
    { icon: Timer, label: "Scheduler", path: "/scheduler" },
    { icon: FileText, label: "Templates", path: "/templates" },
    { icon: Activity, label: "Analytics", path: "/analytics" },
    { icon: MoreHorizontal, label: "More", path: "/more" },
  ];

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50 shadow-lg flex flex-col",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      {/* Logo/Brand */}
      <div className="flex justify-center items-center py-4 px-3 border-b border-gray-100">
        <div className={cn("transition-all duration-300", isExpanded ? "block" : "hidden")}>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Zapier</span>
        </div>
        <div className={cn("transition-all duration-300", isExpanded ? "hidden" : "block")}>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Z</span>
        </div>
      </div>

      {/* Create Zap button */}
      <div className="px-3 mb-4 mt-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/zaps/create" className="w-full block">
                 <button 
                  className={cn(
                    "w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-md flex items-center justify-center py-2.5 transition-all font-medium shadow-lg hover:shadow-xl",
                    isExpanded ? "px-4" : "px-2"
                  )}
                >
                  <Plus size={20} />
                  {isExpanded && <span className="ml-2">Create Zap</span>}
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
      <nav className="flex-1 overflow-y-auto px-2">
        <ul className="space-y-1">
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
              <div className="flex items-center cursor-pointer hover:bg-gray-50 rounded-md p-2 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-medium">
                  JD
                </div>
                {isExpanded && (
                  <div className="ml-3">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-gray-500">Pro Plan</p>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side="right">
                <p>John Doe - Pro Plan</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
