
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
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                "hover:bg-gray-100",
                isActive ? "bg-gray-100 text-orange-500" : "text-gray-700"
              )
            }
          >
            <div className="flex items-center">
              <Icon size={20} className="flex-shrink-0" />
              <span className={cn("ml-3 font-medium", !isExpanded && "hidden")}>
                {label}
              </span>
            </div>
          </NavLink>
        </TooltipTrigger>
        {!isExpanded && (
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
