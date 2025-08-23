import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useWorkflowData } from '@/hooks/useWorkflowData';

interface WorkflowSaveManagerProps {
  workflowId?: string;
  workflowData: any;
  autoSave?: boolean;
  autoSaveInterval?: number;
  onSave?: () => void;
  onError?: (error: any) => void;
}

export const WorkflowSaveManager: React.FC<WorkflowSaveManagerProps> = ({
  workflowId,
  workflowData,
  autoSave = true,
  autoSaveInterval = 30000,
  onSave,
  onError
}) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { createWorkflow, updateWorkflow } = useWorkflowData();

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [workflowData]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges) return;

    const timer = setTimeout(async () => {
      await handleSave(false);
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [workflowData, autoSave, autoSaveInterval, hasUnsavedChanges]);

  const handleSave = async (showToast = true) => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      if (workflowId) {
        await updateWorkflow({ id: workflowId, data: workflowData });
      } else {
        await createWorkflow(workflowData);
      }
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      if (showToast) {
        toast({
          title: 'Workflow saved',
          description: 'Your workflow has been saved successfully.',
        });
      }
      
      onSave?.();
    } catch (error) {
      console.error('Failed to save workflow:', error);
      if (showToast) {
        toast({
          title: 'Save failed',
          description: 'Failed to save workflow. Please try again.',
          variant: 'destructive',
        });
      }
      onError?.(error);
    } finally {
      setIsSaving(false);
    }
  };

  const getSaveStatus = () => {
    if (isSaving) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving...
        </Badge>
      );
    }
    
    if (hasUnsavedChanges) {
      return (
        <Badge variant="outline" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Unsaved changes
        </Badge>
      );
    }
    
    if (lastSaved) {
      return (
        <Badge variant="secondary" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Saved {lastSaved.toLocaleTimeString()}
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <div className="flex items-center gap-2">
      {getSaveStatus()}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleSave(true)}
        disabled={isSaving || !hasUnsavedChanges}
        className="gap-1"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
};