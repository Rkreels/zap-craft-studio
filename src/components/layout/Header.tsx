
import React, { useState } from "react";
import { Search, HelpCircle, Grid, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [query, setQuery] = useState("");

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button className="text-gray-700 hover:text-gray-900 flex items-center gap-1">
          <HelpCircle size={18} />
          <span className="hidden md:inline">Help</span>
        </button>
        <button className="text-gray-700 hover:text-gray-900 flex items-center gap-1">
          <Grid size={18} />
          <span className="hidden md:inline">Explore Apps</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <Button variant="outline" size="sm" className="text-gray-700 border-gray-300 hidden md:flex">
          Contact Sales
        </Button>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
          Upgrade
        </Button>
        
        {/* Notifications dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-700 p-1.5 rounded-md hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <div className="p-3 hover:bg-gray-50 cursor-pointer">
                <p className="font-medium text-sm">New template available</p>
                <p className="text-xs text-gray-500">AI-powered Gmail to Notion workflow</p>
                <p className="text-xs text-gray-400 mt-1">2 min ago</p>
              </div>
              <div className="p-3 hover:bg-gray-50 cursor-pointer">
                <p className="font-medium text-sm">Zap failed</p>
                <p className="text-xs text-gray-500">Slack to Google Sheets automation</p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
              <div className="p-3 hover:bg-gray-50 cursor-pointer">
                <p className="font-medium text-sm">Usage alert</p>
                <p className="text-xs text-gray-500">80% of your monthly tasks used</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-purple-600 cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded-md">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center hover:ring-2 hover:ring-gray-300">
                <span className="text-sm font-medium">JD</span>
              </div>
              <ChevronDown size={16} className="text-gray-600 hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-3">
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-500">john.doe@example.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User size={16} className="mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Bell size={16} className="mr-2" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings size={16} className="mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600">
              <LogOut size={16} className="mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
