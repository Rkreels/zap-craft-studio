import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Trash2, Copy, Share2, Database, Filter, Download, Upload, Calendar } from "lucide-react";

interface TableColumn {
  id: string;
  name: string;
  type: "text" | "number" | "email" | "date" | "select" | "checkbox";
  options?: string[];
}

interface TableRecord {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  recordCount: number;
  status: "active" | "draft";
  columns: TableColumn[];
  automations: number;
}

const initialTables: TableRecord[] = [
  {
    id: "table-1",
    name: "Customer Contacts",
    description: "Centralized customer contact information",
    createdAt: "2025-01-15T14:30:00Z",
    updatedAt: "2025-01-19T09:15:00Z",
    recordCount: 342,
    status: "active",
    automations: 3,
    columns: [
      { id: "col-1", name: "Name", type: "text" },
      { id: "col-2", name: "Email", type: "email" },
      { id: "col-3", name: "Phone", type: "text" },
      { id: "col-4", name: "Status", type: "select", options: ["Lead", "Customer", "Inactive"] },
    ]
  },
  {
    id: "table-2",
    name: "Product Inventory",
    description: "Track all products and stock levels",
    createdAt: "2025-01-10T11:20:00Z",
    updatedAt: "2025-01-18T16:45:00Z",
    recordCount: 156,
    status: "active",
    automations: 2,
    columns: [
      { id: "col-1", name: "Product Name", type: "text" },
      { id: "col-2", name: "SKU", type: "text" },
      { id: "col-3", name: "Stock", type: "number" },
      { id: "col-4", name: "Price", type: "number" },
    ]
  },
  {
    id: "table-3",
    name: "Project Tasks",
    description: "Manage all project tasks and deadlines",
    createdAt: "2025-01-12T08:45:00Z",
    updatedAt: "2025-01-19T13:30:00Z",
    recordCount: 89,
    status: "draft",
    automations: 1,
    columns: [
      { id: "col-1", name: "Task", type: "text" },
      { id: "col-2", name: "Assignee", type: "text" },
      { id: "col-3", name: "Due Date", type: "date" },
      { id: "col-4", name: "Completed", type: "checkbox" },
    ]
  }
];

export default function TablesPage() {
  const [tables, setTables] = useState<TableRecord[]>(initialTables);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableRecord | null>(null);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);
  const [newTableData, setNewTableData] = useState({
    name: "",
    description: "",
  });
  const [newField, setNewField] = useState<Partial<TableColumn>>({
    name: "",
    type: "text"
  });

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         table.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || table.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const createTable = () => {
    if (!newTableData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your table",
        variant: "destructive"
      });
      return;
    }

    const newTable: TableRecord = {
      id: `table-${Date.now()}`,
      name: newTableData.name,
      description: newTableData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recordCount: 0,
      status: "draft",
      automations: 0,
      columns: [
        { id: "col-1", name: "ID", type: "text" },
      ]
    };
    
    setTables(prev => [...prev, newTable]);
    setNewTableData({ name: "", description: "" });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Table created",
      description: `${newTableData.name} has been created successfully.`
    });
  };

  const updateTable = () => {
    if (!selectedTable) return;
    
    setTables(prev => prev.map(table => 
      table.id === selectedTable.id 
        ? { ...selectedTable, updatedAt: new Date().toISOString() } 
        : table
    ));
    
    setIsEditDialogOpen(false);
    setSelectedTable(null);
    
    toast({
      title: "Table updated",
      description: "Table has been updated successfully."
    });
  };

  const deleteTable = (id: string) => {
    setTables(prev => prev.filter(table => table.id !== id));
    setIsDeleteDialogOpen(false);
    setTableToDelete(null);
    
    toast({
      title: "Table deleted",
      description: "The table has been deleted successfully.",
      variant: "destructive"
    });
  };

  const duplicateTable = (table: TableRecord) => {
    const duplicated: TableRecord = {
      ...table,
      id: `table-${Date.now()}`,
      name: `${table.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recordCount: 0,
      status: "draft"
    };
    
    setTables(prev => [...prev, duplicated]);
    
    toast({
      title: "Table duplicated",
      description: `A copy of ${table.name} has been created.`
    });
  };

  const addField = () => {
    if (!selectedTable || !newField.name) {
      toast({
        title: "Field name required",
        description: "Please enter a name for the field",
        variant: "destructive"
      });
      return;
    }

    const updatedTable = {
      ...selectedTable,
      columns: [...selectedTable.columns, {
        id: `col-${Date.now()}`,
        name: newField.name,
        type: newField.type as any,
        options: newField.options
      }]
    };

    setTables(prev => prev.map(t => t.id === selectedTable.id ? updatedTable : t));
    setSelectedTable(updatedTable);
    setNewField({ name: "", type: "text" });
    
    toast({
      title: "Field added",
      description: `${newField.name} field has been added to the table.`
    });
  };

  const exportTable = (table: TableRecord) => {
    toast({
      title: "Export started",
      description: `Exporting ${table.name} as CSV...`
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tables</h1>
        <p className="text-muted-foreground">Create and manage data tables with powerful automations</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search tables..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tables</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus size={16} />
          Create Table
        </Button>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Records</TableHead>
              <TableHead>Fields</TableHead>
              <TableHead>Automations</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No tables found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredTables.map((table) => (
                <TableRow key={table.id} className="group">
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <Database size={16} className="text-muted-foreground" />
                        {table.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{table.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{table.recordCount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>{table.columns.length}</TableCell>
                  <TableCell>
                    {table.automations > 0 ? (
                      <Badge variant="secondary">{table.automations} active</Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={table.status === 'active' ? 'default' : 'secondary'}>
                      {table.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(table.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedTable(table);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => duplicateTable(table)}>
                        <Copy size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => exportTable(table)}>
                        <Download size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setTableToDelete(table.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Table Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Table</DialogTitle>
            <DialogDescription>
              Create a new data table to store and organize your information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Table Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Customer Contacts"
                value={newTableData.name}
                onChange={(e) => setNewTableData({...newTableData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What will you store in this table?"
                value={newTableData.description}
                onChange={(e) => setNewTableData({...newTableData, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={createTable}>Create Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Table Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
            <DialogDescription>
              Update table details and manage fields.
            </DialogDescription>
          </DialogHeader>
          {selectedTable && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Table Name</Label>
                  <Input
                    value={selectedTable.name}
                    onChange={(e) => setSelectedTable({...selectedTable, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={selectedTable.status} 
                    onValueChange={(value: any) => setSelectedTable({...selectedTable, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={selectedTable.description}
                  onChange={(e) => setSelectedTable({...selectedTable, description: e.target.value})}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Fields ({selectedTable.columns.length})</Label>
                  <Button variant="outline" size="sm" onClick={() => setIsFieldDialogOpen(true)}>
                    <Plus size={14} className="mr-1" />
                    Add Field
                  </Button>
                </div>
                <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                  {selectedTable.columns.map((col) => (
                    <div key={col.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <span className="font-medium">{col.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">{col.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={updateTable}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Field Dialog */}
      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Field</DialogTitle>
            <DialogDescription>
              Add a new field to your table.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Field Name</Label>
              <Input
                placeholder="e.g., Email Address"
                value={newField.name || ""}
                onChange={(e) => setNewField({...newField, name: e.target.value})}
              />
            </div>
            <div>
              <Label>Field Type</Label>
              <Select 
                value={newField.type} 
                onValueChange={(value: any) => setNewField({...newField, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFieldDialogOpen(false)}>Cancel</Button>
            <Button onClick={addField}>Add Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Table</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this table? This action cannot be undone and all data will be permanently lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => tableToDelete && deleteTable(tableToDelete)}
            >
              Delete Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
