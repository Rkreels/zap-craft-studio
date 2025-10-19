
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
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const Header = () => {
  const [query, setQuery] = useState("");
  const { user, logout } = useAuth();

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
        <button 
          onClick={() => {
            toast({
              title: "Help Center",
              description: "Visit help.zapier.com for documentation and support.",
            });
          }}
          className="text-gray-700 hover:text-gray-900 flex items-center gap-1"
        >
          <HelpCircle size={18} />
          <span className="hidden md:inline">Help</span>
        </button>
        <Link to="/explore-apps" className="text-gray-700 hover:text-gray-900 flex items-center gap-1">
          <Grid size={18} />
          <span className="hidden md:inline">Explore Apps</span>
        </Link>
        <a 
          href="https://skillsim.vercel.app/dashboard" 
          className="text-gray-700 hover:text-gray-900 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
          rel="noopener noreferrer"
        >
          <span className="text-sm font-medium">Master Dashboard</span>
        </a>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
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
            <DropdownMenuItem 
              className="justify-center text-purple-600 cursor-pointer"
              onClick={() => {
                toast({
                  title: "Notifications",
                  description: "All notifications have been loaded.",
                });
              }}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded-md">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center hover:ring-2 hover:ring-primary/30">
                <span className="text-sm font-medium text-white">{user?.avatarInitials || 'JD'}</span>
              </div>
              <ChevronDown size={16} className="text-gray-600 hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-3">
              <p className="font-medium">{user?.name || 'John Doe'}</p>
              <p className="text-sm text-gray-500">{user?.email || 'john.doe@example.com'}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => {
                toast({
                  title: "Profile",
                  description: "Profile page coming soon!",
                });
              }}
            >
              <User size={16} className="mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => {
                toast({
                  title: "Notifications",
                  description: "Notification settings available in Settings.",
                });
              }}
            >
              <Bell size={16} className="mr-2" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <Link to="/settings">
              <DropdownMenuItem className="cursor-pointer">
                <Settings size={16} className="mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={logout}>
              <LogOut size={16} className="mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
