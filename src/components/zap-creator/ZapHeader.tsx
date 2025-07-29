import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, History, Save, TestTube, Trash } from 'lucide-react';

export interface ZapHeaderProps {
  zapName: string;
  setZapName: Dispatch<SetStateAction<string>>;
  isActive: boolean;
  toggleActivation: () => void;
  handleSave: (showToast?: boolean) => void;
  handleTest: () => void;
  handleDelete: () => void;
  lastSaved: Date | null;
  isLoading: boolean;
  onViewVersionHistory: () => void; // Added this prop
}

export function ZapHeader({
  zapName,
  setZapName,
  isActive,
  toggleActivation,
  handleSave,
  handleTest,
  handleDelete,
  lastSaved,
  isLoading,
  onViewVersionHistory, // Added this prop
}: ZapHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Zap Name"
          value={zapName}
          onChange={(e) => setZapName(e.target.value)}
          className="w-64 md:w-80 lg:w-96"
        />
        <div className="flex items-center space-x-2">
          <Switch id="zap-active" checked={isActive} onCheckedChange={toggleActivation} />
          <label htmlFor="zap-active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {isActive ? 'Active' : 'Inactive'}
          </label>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={handleTest} disabled={isLoading}>
          <TestTube size={16} className="mr-2" />
          Test
        </Button>
        <Button onClick={() => handleSave(true)} disabled={isLoading}>
          <Save size={16} className="mr-2" />
          Save
        </Button>
        <Button variant="ghost" onClick={onViewVersionHistory}>
          <History size={16} className="mr-2" />
          Version History
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
          <Trash size={16} className="mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}
