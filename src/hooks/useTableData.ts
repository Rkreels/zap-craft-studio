
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface TableColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'email' | 'url';
  required?: boolean;
  default?: any;
}

export interface TableRow {
  id: string;
  [key: string]: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface TableSchema {
  id: string;
  name: string;
  columns: TableColumn[];
  rows: TableRow[];
  createdAt: Date;
  updatedAt: Date;
}

export const useTableData = (tableId?: string) => {
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [currentTable, setCurrentTable] = useState<TableSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    const savedTables = localStorage.getItem('app-tables');
    if (savedTables) {
      const parsedTables = JSON.parse(savedTables);
      setTables(parsedTables);
      if (tableId) {
        const table = parsedTables.find((t: TableSchema) => t.id === tableId);
        if (table) setCurrentTable(table);
      }
    }
  }, [tableId]);

  // Save to localStorage whenever tables change
  useEffect(() => {
    localStorage.setItem('app-tables', JSON.stringify(tables));
  }, [tables]);

  const createTable = useCallback((name: string, columns: Omit<TableColumn, 'id'>[]) => {
    setIsLoading(true);
    
    const newTable: TableSchema = {
      id: `table_${Date.now()}`,
      name,
      columns: columns.map((col, index) => ({ ...col, id: `col_${index}_${Date.now()}` })),
      rows: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTables(prev => [...prev, newTable]);
    setCurrentTable(newTable);
    setIsLoading(false);

    toast({
      title: 'Table created',
      description: `Table "${name}" has been created successfully.`
    });

    return newTable;
  }, []);

  const addRow = useCallback((tableId: string, data: Record<string, any>) => {
    const newRow: TableRow = {
      id: `row_${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, rows: [...table.rows, newRow], updatedAt: new Date() }
        : table
    ));

    if (currentTable?.id === tableId) {
      setCurrentTable(prev => prev ? { ...prev, rows: [...prev.rows, newRow] } : null);
    }

    toast({
      title: 'Row added',
      description: 'New row has been added to the table.'
    });

    return newRow;
  }, [currentTable]);

  const updateRow = useCallback((tableId: string, rowId: string, data: Record<string, any>) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? {
            ...table,
            rows: table.rows.map(row => 
              row.id === rowId 
                ? { ...row, ...data, updatedAt: new Date() }
                : row
            ),
            updatedAt: new Date()
          }
        : table
    ));

    if (currentTable?.id === tableId) {
      setCurrentTable(prev => prev ? {
        ...prev,
        rows: prev.rows.map(row => 
          row.id === rowId ? { ...row, ...data, updatedAt: new Date() } : row
        )
      } : null);
    }

    toast({
      title: 'Row updated',
      description: 'Row has been updated successfully.'
    });
  }, [currentTable]);

  const deleteRow = useCallback((tableId: string, rowId: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, rows: table.rows.filter(row => row.id !== rowId), updatedAt: new Date() }
        : table
    ));

    if (currentTable?.id === tableId) {
      setCurrentTable(prev => prev ? {
        ...prev,
        rows: prev.rows.filter(row => row.id !== rowId)
      } : null);
    }

    toast({
      title: 'Row deleted',
      description: 'Row has been deleted successfully.'
    });
  }, [currentTable]);

  const addColumn = useCallback((tableId: string, column: Omit<TableColumn, 'id'>) => {
    const newColumn: TableColumn = {
      ...column,
      id: `col_${Date.now()}`
    };

    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, columns: [...table.columns, newColumn], updatedAt: new Date() }
        : table
    ));

    if (currentTable?.id === tableId) {
      setCurrentTable(prev => prev ? {
        ...prev,
        columns: [...prev.columns, newColumn]
      } : null);
    }

    toast({
      title: 'Column added',
      description: `Column "${column.name}" has been added.`
    });
  }, [currentTable]);

  const deleteTable = useCallback((tableId: string) => {
    setTables(prev => prev.filter(table => table.id !== tableId));
    if (currentTable?.id === tableId) {
      setCurrentTable(null);
    }

    toast({
      title: 'Table deleted',
      description: 'Table has been deleted successfully.'
    });
  }, [currentTable]);

  return {
    tables,
    currentTable,
    isLoading,
    createTable,
    addRow,
    updateRow,
    deleteRow,
    addColumn,
    deleteTable,
    setCurrentTable
  };
};
