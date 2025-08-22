
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export interface TableColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'email' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: any;
  default?: any;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface TableSchema {
  id: string;
  name: string;
  columns: TableColumn[];
  rows: TableRow[];
  createdAt: string;
  updatedAt: string;
}

export const useTableData = (tableId?: string) => {
  const queryClient = useQueryClient();
  const [currentTable, setCurrentTable] = useState<TableSchema | null>(null);
  
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
  
  const addRow = (tableId: string, newRow: Partial<TableRow>) => {
    if (!currentTable) return;
    const row: TableRow = {
      id: `row-${Date.now()}`,
      ...newRow
    };
    const updatedTable = {
      ...currentTable,
      rows: [...currentTable.rows, row]
    };
    setCurrentTable(updatedTable);
  };

  const updateRow = (tableId: string, rowId: string, updates: Partial<TableRow>) => {
    if (!currentTable) return;
    const updatedRows = currentTable.rows.map(row =>
      row.id === rowId ? { ...row, ...updates } : row
    );
    setCurrentTable({
      ...currentTable,
      rows: updatedRows
    });
  };

  const deleteRow = (tableId: string, rowId: string) => {
    if (!currentTable) return;
    const updatedRows = currentTable.rows.filter(row => row.id !== rowId);
    setCurrentTable({
      ...currentTable,
      rows: updatedRows
    });
  };

  const addColumn = (column: Omit<TableColumn, 'id'>) => {
    if (!currentTable) return;
    const newColumn: TableColumn = {
      id: `col-${Date.now()}`,
      ...column
    };
    setCurrentTable({
      ...currentTable,
      columns: [...currentTable.columns, newColumn]
    });
  };

  return {
    tables: (tablesData as any)?.tables || [],
    currentTable,
    setCurrentTable,
    isLoading,
    error,
    createTable: createTableMutation.mutate,
    updateTable: updateTableMutation.mutate,
    deleteTable: deleteTableMutation.mutate,
    addRow,
    updateRow,
    deleteRow,
    addColumn,
    isCreating: createTableMutation.isPending,
    isUpdating: updateTableMutation.isPending,
    isDeleting: deleteTableMutation.isPending,
  };
};
