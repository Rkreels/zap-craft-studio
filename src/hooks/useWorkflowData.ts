
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { useRealTimeUpdates } from './useRealTimeUpdates';

export const useWorkflowData = () => {
  const queryClient = useQueryClient();
  
  // Enable real-time updates for workflows
  useRealTimeUpdates({
    queryKeys: ['workflows'],
    interval: 30000,
    enabled: true
  });
  
  const { data: workflowsData, isLoading, error } = useQuery({
    queryKey: ['workflows'],
    queryFn: apiService.getWorkflows,
    refetchInterval: 30000,
  });
  
  const createWorkflowMutation = useMutation({
    mutationFn: apiService.createWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({
        title: 'Workflow created',
        description: 'Your new workflow has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create workflow. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  const updateWorkflowMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiService.updateWorkflow(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({
        title: 'Workflow updated',
        description: 'Your workflow has been updated successfully.',
      });
    },
  });
  
  const deleteWorkflowMutation = useMutation({
    mutationFn: apiService.deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({
        title: 'Workflow deleted',
        description: 'The workflow has been deleted successfully.',
        variant: 'destructive',
      });
    },
  });
  
  const executeWorkflowMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiService.executeWorkflow(id, data),
    onSuccess: () => {
      toast({
        title: 'Workflow executed',
        description: 'Your workflow has been executed successfully.',
      });
    },
  });
  
  return {
    workflows: (workflowsData as any)?.workflows || [],
    isLoading,
    error,
    createWorkflow: createWorkflowMutation.mutate,
    updateWorkflow: (params: { id: string; data: any }) => updateWorkflowMutation.mutate(params),
    deleteWorkflow: deleteWorkflowMutation.mutate,
    executeWorkflow: executeWorkflowMutation.mutate,
    isCreating: createWorkflowMutation.isPending,
    isUpdating: updateWorkflowMutation.isPending,
    isDeleting: deleteWorkflowMutation.isPending,
    isExecuting: executeWorkflowMutation.isPending,
  };
};
