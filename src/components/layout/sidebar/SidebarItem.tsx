
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isExpanded: boolean;
}

export const SidebarItem = ({ icon: Icon, label, path, isExpanded }: SidebarItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-gray-100 hover:text-gray-900",
                "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1",
                "text-sm font-medium",
                isActive 
                  ? "bg-orange-50 text-orange-600 border-r-2 border-orange-500 shadow-sm" 
                  : "text-gray-700 hover:text-gray-900",
                "group relative"
              )
            }
          >
            <div className="flex items-center w-full min-w-0">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                <Icon size={20} className="transition-transform group-hover:scale-110" />
              </div>
              {isExpanded && (
                <span className="ml-3 truncate transition-all duration-200">
                  {label}
                </span>
              )}
            </div>
          </NavLink>
        </TooltipTrigger>
        {!isExpanded && (
          <TooltipContent side="right" className="ml-2">
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
