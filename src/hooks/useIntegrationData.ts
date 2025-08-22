
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const useIntegrationData = () => {
  const queryClient = useQueryClient();
  
  const { data: integrationsData, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: apiService.getIntegrations,
    refetchInterval: 60000,
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
