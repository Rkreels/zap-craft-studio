import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

// Real-time data management for workflows
export const useRealTimeWorkflows = () => {
  const queryClient = useQueryClient();
  
  const { data: workflowsData, isLoading, error } = useQuery({
    queryKey: ['workflows'],
    queryFn: apiService.getWorkflows,
    refetchInterval: 30000, // Refetch every 30 seconds
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
    onError: (error) => {
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
    onSuccess: (result) => {
      toast({
        title: 'Workflow executed',
        description: 'Your workflow has been executed successfully.',
      });
      return result;
    },
  });
  
  return {
    workflows: (workflowsData as any)?.workflows || [],
    isLoading,
    error,
    createWorkflow: createWorkflowMutation.mutate,
    updateWorkflow: updateWorkflowMutation.mutate,
    deleteWorkflow: deleteWorkflowMutation.mutate,
    executeWorkflow: executeWorkflowMutation.mutate,
    isCreating: createWorkflowMutation.isPending,
    isUpdating: updateWorkflowMutation.isPending,
    isDeleting: deleteWorkflowMutation.isPending,
    isExecuting: executeWorkflowMutation.isPending,
  };
};

// Real-time data management for tables
export const useRealTimeTables = () => {
  const queryClient = useQueryClient();
  
  const { data: tablesData, isLoading, error } = useQuery({
    queryKey: ['tables'],
    queryFn: apiService.getTables,
    refetchInterval: 30000,
  });
  
  const createTableMutation = useMutation({
    mutationFn: apiService.createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast({
        title: 'Table created',
        description: 'Your new table has been created successfully.',
      });
    },
  });
  
  const updateTableMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiService.updateTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast({
        title: 'Table updated',
        description: 'Your table has been updated successfully.',
      });
    },
  });
  
  const deleteTableMutation = useMutation({
    mutationFn: apiService.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast({
        title: 'Table deleted',
        description: 'The table has been deleted successfully.',
        variant: 'destructive',
      });
    },
  });
  
  return {
    tables: (tablesData as any)?.tables || [],
    isLoading,
    error,
    createTable: createTableMutation.mutate,
    updateTable: updateTableMutation.mutate,
    deleteTable: deleteTableMutation.mutate,
    isCreating: createTableMutation.isPending,
    isUpdating: updateTableMutation.isPending,
    isDeleting: deleteTableMutation.isPending,
  };
};

// Real-time monitoring for system health
export const useSystemMonitoring = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [metrics, setMetrics] = useState({
    activeWorkflows: 0,
    totalRuns: 0,
    successRate: 0,
    avgExecutionTime: 0,
  });
  
  const { data: health } = useQuery({
    queryKey: ['system-health'],
    queryFn: apiService.getSystemHealth,
    refetchInterval: 10000, // Check every 10 seconds
  });
  
  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeWorkflows: Math.max(0, prev.activeWorkflows + Math.floor(Math.random() * 3) - 1),
        totalRuns: prev.totalRuns + Math.floor(Math.random() * 5),
        successRate: Math.min(100, Math.max(85, prev.successRate + (Math.random() - 0.5) * 2)),
        avgExecutionTime: Math.max(500, prev.avgExecutionTime + (Math.random() - 0.5) * 100),
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return {
    isOnline,
    metrics,
    health: health || { status: 'healthy', uptime: '99.9%' },
  };
};

// Real-time integrations management
export const useRealTimeIntegrations = () => {
  const queryClient = useQueryClient();
  
  const { data: integrationsData, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: apiService.getIntegrations,
    refetchInterval: 60000, // Check every minute
  });
  
  const connectIntegrationMutation = useMutation({
    mutationFn: ({ service, credentials }: { service: string; credentials: any }) =>
      apiService.connectIntegration(service, credentials),
    onSuccess: (_, { service }) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: 'Integration connected',
        description: `Successfully connected to ${service}.`,
      });
    },
    onError: (_, { service }) => {
      toast({
        title: 'Connection failed',
        description: `Failed to connect to ${service}. Please check your credentials.`,
        variant: 'destructive',
      });
    },
  });
  
  const disconnectIntegrationMutation = useMutation({
    mutationFn: apiService.disconnectIntegration,
    onSuccess: (_, service) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: 'Integration disconnected',
        description: `Successfully disconnected from ${service}.`,
      });
    },
  });
  
  return {
    integrations: (integrationsData as any)?.integrations || [],
    isLoading,
    connectIntegration: connectIntegrationMutation.mutate,
    disconnectIntegration: disconnectIntegrationMutation.mutate,
    isConnecting: connectIntegrationMutation.isPending,
    isDisconnecting: disconnectIntegrationMutation.isPending,
  };
};