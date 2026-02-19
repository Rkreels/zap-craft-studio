
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
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const Header = () => {
  const [query, setQuery] = useState("");
  const { user, logout } = useAuth();

  return (
    <header className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
          />
        </div>
        <button 
          onClick={() => toast({ title: "Help Center", description: "Visit help.zapier.com for documentation and support." })}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
        >
          <HelpCircle size={18} />
          <span className="hidden md:inline">Help</span>
        </button>
        <Link to="/explore-apps" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
          <Grid size={18} />
          <span className="hidden md:inline">Explore Apps</span>
        </Link>
        <a 
          href="https://skillsim.vercel.app/dashboard" 
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-muted transition-colors text-sm"
          rel="noopener noreferrer"
        >
          <span className="font-medium">Master Dashboard</span>
        </a>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notifications dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground p-1.5 rounded-md hover:bg-muted relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <div className="p-3 hover:bg-muted cursor-pointer rounded-sm">
                <p className="font-medium text-sm">New template available</p>
                <p className="text-xs text-muted-foreground">AI-powered Gmail to Notion workflow</p>
                <p className="text-xs text-muted-foreground/60 mt-1">2 min ago</p>
              </div>
              <div className="p-3 hover:bg-muted cursor-pointer rounded-sm">
                <p className="font-medium text-sm">Zap failed</p>
                <p className="text-xs text-muted-foreground">Slack to Google Sheets automation</p>
                <p className="text-xs text-muted-foreground/60 mt-1">1 hour ago</p>
              </div>
              <div className="p-3 hover:bg-muted cursor-pointer rounded-sm">
                <p className="font-medium text-sm">Usage alert</p>
                <p className="text-xs text-muted-foreground">80% of your monthly tasks used</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Yesterday</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="justify-center text-primary cursor-pointer"
              onClick={() => toast({ title: "Notifications", description: "Viewing all notifications." })}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-1 hover:bg-muted p-1 rounded-md">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center hover:ring-2 hover:ring-primary/30">
                <span className="text-sm font-medium text-white">{user?.avatarInitials || 'JD'}</span>
              </div>
              <ChevronDown size={16} className="text-muted-foreground hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-3">
              <p className="font-medium">{user?.name || 'John Doe'}</p>
              <p className="text-sm text-muted-foreground">{user?.email || 'john.doe@example.com'}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => toast({ title: "Profile", description: "Profile settings available in Settings tab." })}>
              <User size={16} className="mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => toast({ title: "Notifications", description: "Notification settings available in Settings." })}>
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
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={logout}>
              <LogOut size={16} className="mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
