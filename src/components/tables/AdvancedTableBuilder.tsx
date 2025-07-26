import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow as UITableRow 
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Download, 
  Upload, 
  Filter, 
  Search,
  Database,
  Settings,
  Eye,
  Code,
  Zap
} from 'lucide-react';
import { useTableData, TableColumn, TableRow, TableSchema } from '@/hooks/useTableData';

interface AdvancedTableBuilderProps {
  tableId?: string;
  onSave?: (table: TableSchema) => void;
  onClose?: () => void;
}

const columnTypes = [
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'url', label: 'URL', icon: '🔗' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'boolean', label: 'Boolean', icon: '✅' }
];

export const AdvancedTableBuilder: React.FC<AdvancedTableBuilderProps> = ({
  tableId,
  onSave,
  onClose
}) => {
  const { 
    tables, 
    currentTable, 
    isLoading, 
    createTable, 
    addRow, 
    updateRow, 
    deleteRow, 
    addColumn,
    setCurrentTable 
  } = useTableData(tableId);

  const [activeTab, setActiveTab] = useState('design');
  const [tableName, setTableName] = useState(currentTable?.name || '');
  const [columns, setColumns] = useState<TableColumn[]>(currentTable?.columns || []);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('text');
  const [editingRow, setEditingRow] = useState<TableRow | null>(null);
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});
  const [filterText, setFilterText] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Initialize with existing table data
  React.useEffect(() => {
    if (currentTable) {
      setTableName(currentTable.name);
      setColumns(currentTable.columns);
    }
  }, [currentTable]);

  const addNewColumn = useCallback(() => {
    if (!newColumnName.trim()) {
      toast({
        title: 'Column name required',
        description: 'Please enter a name for the new column',
        variant: 'destructive'
      });
      return;
    }

    const newColumn: TableColumn = {
      id: `col_${Date.now()}`,
      name: newColumnName,
      type: newColumnType as any,
      required: false
    };

    setColumns(prev => [...prev, newColumn]);
    setNewColumnName('');
    setNewColumnType('text');

    toast({
      title: 'Column added',
      description: `Column "${newColumnName}" has been added`
    });
  }, [newColumnName, newColumnType]);

  const removeColumn = useCallback((columnId: string) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
    
    toast({
      title: 'Column removed',
      description: 'Column has been removed from the table'
    });
  }, []);

  const updateColumn = useCallback((columnId: string, updates: Partial<TableColumn>) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    ));
  }, []);

  const saveTable = useCallback(async () => {
    if (!tableName.trim()) {
      toast({
        title: 'Table name required',
        description: 'Please enter a name for the table',
        variant: 'destructive'
      });
      return;
    }

    if (columns.length === 0) {
      toast({
        title: 'Columns required',
        description: 'Please add at least one column to the table',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (currentTable) {
        // Update existing table
        const updatedTable = {
          ...currentTable,
          name: tableName,
          columns,
          updatedAt: new Date()
        };
        setCurrentTable(updatedTable);
        onSave?.(updatedTable);
      } else {
        // Create new table
        const newTable = createTable(tableName, columns);
        onSave?.(newTable);
      }

      toast({
        title: 'Table saved',
        description: `Table "${tableName}" has been saved successfully`
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save the table. Please try again.',
        variant: 'destructive'
      });
    }
  }, [tableName, columns, currentTable, createTable, onSave, setCurrentTable]);

  const addNewRow = useCallback(() => {
    if (!currentTable) return;

    const rowData: Record<string, any> = {};
    columns.forEach(col => {
      rowData[col.id] = newRowData[col.id] || (col.default || '');
    });

    addRow(currentTable.id, rowData);
    setNewRowData({});
    
    toast({
      title: 'Row added',
      description: 'New row has been added to the table'
    });
  }, [currentTable, columns, newRowData, addRow]);

  const updateExistingRow = useCallback(() => {
    if (!currentTable || !editingRow) return;

    updateRow(currentTable.id, editingRow.id, editingRow);
    setEditingRow(null);
    
    toast({
      title: 'Row updated',
      description: 'Row has been updated successfully'
    });
  }, [currentTable, editingRow, updateRow]);

  const deleteExistingRow = useCallback((rowId: string) => {
    if (!currentTable) return;

    deleteRow(currentTable.id, rowId);
    
    toast({
      title: 'Row deleted',
      description: 'Row has been deleted successfully'
    });
  }, [currentTable, deleteRow]);

  // Filter and sort rows
  const filteredAndSortedRows = React.useMemo(() => {
    if (!currentTable) return [];

    let rows = [...currentTable.rows];

    // Apply filter
    if (filterText) {
      rows = rows.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }

    // Apply sort
    if (sortColumn) {
      rows.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [currentTable, filterText, sortColumn, sortDirection]);

  const exportToCSV = useCallback(() => {
    if (!currentTable) return;

    const csvContent = [
      columns.map(col => col.name).join(','),
      ...currentTable.rows.map(row => 
        columns.map(col => row[col.id] || '').join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTable.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: 'Table exported to CSV file'
    });
  }, [currentTable, columns]);

  const generateAPI = useCallback(() => {
    if (!currentTable) return;

    const apiCode = `
// Auto-generated API endpoints for table: ${currentTable.name}

// GET /api/tables/${currentTable.id}/rows
export async function getRows() {
  return await fetch('/api/tables/${currentTable.id}/rows');
}

// POST /api/tables/${currentTable.id}/rows
export async function createRow(data) {
  return await fetch('/api/tables/${currentTable.id}/rows', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// PUT /api/tables/${currentTable.id}/rows/:id
export async function updateRow(id, data) {
  return await fetch(\`/api/tables/${currentTable.id}/rows/\${id}\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// DELETE /api/tables/${currentTable.id}/rows/:id
export async function deleteRow(id) {
  return await fetch(\`/api/tables/${currentTable.id}/rows/\${id}\`, {
    method: 'DELETE'
  });
}
    `.trim();

    navigator.clipboard.writeText(apiCode);
    
    toast({
      title: 'API code generated',
      description: 'API endpoints copied to clipboard'
    });
  }, [currentTable]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Advanced Table Builder
          </CardTitle>
          <CardDescription>
            Create and manage dynamic tables with real-time data operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="table-name">Table Name</Label>
              <Input
                id="table-name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Enter table name"
              />
            </div>
            <Button onClick={saveTable} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Table'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="design">
          <Card>
            <CardHeader>
              <CardTitle>Column Design</CardTitle>
              <CardDescription>
                Define the structure of your table by adding columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Column name"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                  />
                  <Select value={newColumnType} onValueChange={setNewColumnType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addNewColumn}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                  </Button>
                </div>

                <div className="space-y-2">
                  {columns.map((column, index) => (
                    <div key={column.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {columnTypes.find(t => t.value === column.type)?.icon}
                        </span>
                        <div>
                          <div className="font-medium">{column.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {columnTypes.find(t => t.value === column.type)?.label}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={column.required}
                          onCheckedChange={(checked) => updateColumn(column.id, { required: checked })}
                        />
                        <Label className="text-sm">Required</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeColumn(column.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your table data with filtering and sorting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Filter data..."
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Button onClick={exportToCSV} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Row
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Row</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {columns.map(column => (
                          <div key={column.id}>
                            <Label>{column.name}</Label>
                            <Input
                              type={column.type === 'number' ? 'number' : 
                                   column.type === 'email' ? 'email' : 
                                   column.type === 'date' ? 'date' : 'text'}
                              value={newRowData[column.id] || ''}
                              onChange={(e) => setNewRowData(prev => ({
                                ...prev,
                                [column.id]: e.target.value
                              }))}
                              placeholder={`Enter ${column.name}`}
                            />
                          </div>
                        ))}
                        <Button onClick={addNewRow} className="w-full">
                          Add Row
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {currentTable && (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <UITableRow>
                          {columns.map(column => (
                            <TableHead 
                              key={column.id}
                              className="cursor-pointer hover:bg-muted"
                              onClick={() => {
                                if (sortColumn === column.id) {
                                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                } else {
                                  setSortColumn(column.id);
                                  setSortDirection('asc');
                                }
                              }}
                            >
                              {column.name}
                              {sortColumn === column.id && (
                                <span className="ml-2">
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </TableHead>
                          ))}
                          <TableHead>Actions</TableHead>
                        </UITableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedRows.map(row => (
                          <UITableRow key={row.id}>
                            {columns.map(column => (
                              <TableCell key={column.id}>
                                {editingRow?.id === row.id ? (
                                  <Input
                                    value={editingRow[column.id] || ''}
                                    onChange={(e) => setEditingRow(prev => prev ? {
                                      ...prev,
                                      [column.id]: e.target.value
                                    } : null)}
                                  />
                                ) : (
                                  String(row[column.id] || '')
                                )}
                              </TableCell>
                            ))}
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {editingRow?.id === row.id ? (
                                  <>
                                    <Button size="sm" onClick={updateExistingRow}>
                                      <Save className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingRow(null)}>
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button size="sm" variant="ghost" onClick={() => setEditingRow(row)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => deleteExistingRow(row.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </UITableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Integration
              </CardTitle>
              <CardDescription>
                Generate API endpoints and integrate with external services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={generateAPI} className="mb-4">
                  <Code className="h-4 w-4 mr-2" />
                  Generate API Code
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">REST Endpoints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div><Badge variant="outline">GET</Badge> /api/tables/{tableId}/rows</div>
                        <div><Badge variant="outline">POST</Badge> /api/tables/{tableId}/rows</div>
                        <div><Badge variant="outline">PUT</Badge> /api/tables/{tableId}/rows/:id</div>
                        <div><Badge variant="outline">DELETE</Badge> /api/tables/{tableId}/rows/:id</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Webhook Integration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Webhook URL</Label>
                        <Input placeholder="https://your-webhook-url.com" />
                        <Button variant="outline" size="sm" className="w-full">
                          Test Webhook
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Table Settings</CardTitle>
              <CardDescription>
                Configure advanced table settings and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Auto-save changes</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable real-time sync</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Allow public access</Label>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Description</Label>
                      <Textarea 
                        placeholder="Describe your table..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};