import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { ZapierButton } from '@/components/ui/zapier-button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, History, Save, TestTube, Trash, Play, Pause, Settings, MoreHorizontal, Copy, Share } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

export interface EnhancedZapHeaderProps {
  zapName: string;
  setZapName: Dispatch<SetStateAction<string>>;
  isActive: boolean;
  toggleActivation: () => void;
  handleSave: (showToast?: boolean) => void;
  handleTest: () => void;
  handleDelete: () => void;
  lastSaved: Date | null;
  isLoading: boolean;
  onViewVersionHistory: () => void;
  zapStats?: {
    totalRuns: number;
    successRate: number;
    lastRun: Date | null;
  };
}

export function EnhancedZapHeader({
  zapName,
  setZapName,
  isActive,
  toggleActivation,
  handleSave,
  handleTest,
  handleDelete,
  lastSaved,
  isLoading,
  onViewVersionHistory,
  zapStats
}: EnhancedZapHeaderProps) {
  
  const handleDuplicate = () => {
    toast({
      title: "Zap duplicated",
      description: "A copy of this Zap has been created.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Zap link has been copied to clipboard.",
    });
  };

  return (
    <div className="bg-white border-b border-border shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Zap Name */}
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Name your Zap"
                value={zapName}
                onChange={(e) => setZapName(e.target.value)}
                className="text-lg font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0 bg-transparent"
              />
            </div>
            
            {/* Status Badge */}
            <Badge variant={isActive ? "default" : "secondary"} className="px-3 py-1">
              {isActive ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  On
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                  Off
                </>
              )}
            </Badge>

            {/* Stats */}
            {zapStats && (
              <div className="hidden md:flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{zapStats.totalRuns} runs</span>
                <span>{zapStats.successRate}% success</span>
                {zapStats.lastRun && (
                  <span>Last run: {zapStats.lastRun.toLocaleDateString()}</span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Toggle Switch */}
            <div className="flex items-center space-x-2">
              <Switch 
                id="zap-active" 
                checked={isActive} 
                onCheckedChange={toggleActivation}
                disabled={isLoading}
              />
              <label htmlFor="zap-active" className="text-sm font-medium">
                {isActive ? 'On' : 'Off'}
              </label>
            </div>

            {/* Test Button */}
            <ZapierButton 
              variant="outline" 
              size="sm"
              onClick={handleTest} 
              disabled={isLoading}
            >
              <TestTube size={16} />
              Test
            </ZapierButton>

            {/* Save Button */}
            <ZapierButton 
              variant="zapier"
              size="sm"
              onClick={() => handleSave(true)} 
              disabled={isLoading}
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Publish'}
            </ZapierButton>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Zap Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy size={16} className="mr-2" />
                  Duplicate
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleShare}>
                  <Share size={16} className="mr-2" />
                  Share
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={onViewVersionHistory}>
                  <History size={16} className="mr-2" />
                  Version History
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash size={16} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Save Status */}
        {lastSaved && (
          <div className="mt-2 text-xs text-muted-foreground">
            Last saved: {lastSaved.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}