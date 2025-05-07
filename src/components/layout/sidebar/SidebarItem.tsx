
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isExpanded: boolean;
}

export const SidebarItem = ({ icon: Icon, label, path, isExpanded }: SidebarItemProps) => {
  return (
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
      <Icon size={20} />
      <span className={cn("ml-3 font-medium", !isExpanded && "hidden")}>
        {label}
      </span>
    </NavLink>
  );
};
