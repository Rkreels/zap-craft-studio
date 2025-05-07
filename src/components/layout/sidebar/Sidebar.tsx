
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Home, Table, Layout, MessageSquare, PenTool, History, Settings, MoreHorizontal, Plus } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar = ({ isExpanded, setIsExpanded }: SidebarProps) => {
  // Save sidebar state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarExpanded");
    if (savedState) {
      setIsExpanded(savedState === "true");
    }
  }, [setIsExpanded]);

  const handleMouseEnter = () => {
    setIsExpanded(true);
    localStorage.setItem("sidebarExpanded", "true");
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    localStorage.setItem("sidebarExpanded", "false");
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Table, label: "Zaps", path: "/zaps" },
    { icon: Table, label: "Tables", path: "/tables" },
    { icon: Layout, label: "Interfaces", path: "/interfaces" },
    { icon: MessageSquare, label: "Chatbot", path: "/chatbot" },
    { icon: PenTool, label: "Canvas", path: "/canvas" },
    { icon: History, label: "History", path: "/history" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: MoreHorizontal, label: "More", path: "/more" },
  ];

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-width duration-300 ease-in-out z-10",
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

      {/* Create Zap button */}
      <div className="px-3 mb-4 mt-2">
        <button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center py-2 transition-all"
        >
          <Plus size={20} />
          <span className={cn("ml-2 font-medium", !isExpanded && "hidden")}>Create Zap</span>
        </button>
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
    </div>
  );
};
