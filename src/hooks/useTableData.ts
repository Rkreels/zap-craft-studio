
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const useTableData = () => {
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
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create table. Please try again.',
        variant: 'destructive',
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
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update table. Please try again.',
        variant: 'destructive',
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
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete table. Please try again.',
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
