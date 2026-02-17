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
  { id: "t-1", name: "Customer Contacts", description: "Centralized customer contact information", createdAt: "2025-10-01T08:00:00Z", updatedAt: "2026-02-17T06:00:00Z", recordCount: 1247, status: "active", automations: 3, columns: [{id:"c1",name:"Name",type:"text"},{id:"c2",name:"Email",type:"email"},{id:"c3",name:"Phone",type:"text"},{id:"c4",name:"Status",type:"select",options:["Lead","Customer","Churned"]}] },
  { id: "t-2", name: "Product Inventory", description: "Product catalog and stock levels", createdAt: "2025-09-15T10:00:00Z", updatedAt: "2026-02-16T14:00:00Z", recordCount: 584, status: "active", automations: 2, columns: [{id:"c1",name:"Product",type:"text"},{id:"c2",name:"SKU",type:"text"},{id:"c3",name:"Price",type:"number"},{id:"c4",name:"Stock",type:"number"}] },
  { id: "t-3", name: "Project Tasks", description: "Task tracking for active projects", createdAt: "2025-11-20T09:00:00Z", updatedAt: "2026-02-17T05:30:00Z", recordCount: 342, status: "active", automations: 4, columns: [{id:"c1",name:"Task",type:"text"},{id:"c2",name:"Assignee",type:"text"},{id:"c3",name:"Due Date",type:"date"},{id:"c4",name:"Completed",type:"checkbox"}] },
  { id: "t-4", name: "Sales Pipeline", description: "Track deals from lead to close", createdAt: "2025-08-10T12:00:00Z", updatedAt: "2026-02-16T16:00:00Z", recordCount: 89, status: "active", automations: 5, columns: [{id:"c1",name:"Deal",type:"text"},{id:"c2",name:"Value",type:"number"},{id:"c3",name:"Stage",type:"select",options:["Prospecting","Proposal","Negotiation","Won","Lost"]}] },
  { id: "t-5", name: "Employee Directory", description: "Company employee information", createdAt: "2025-07-05T08:00:00Z", updatedAt: "2026-02-15T11:00:00Z", recordCount: 156, status: "active", automations: 1, columns: [{id:"c1",name:"Name",type:"text"},{id:"c2",name:"Email",type:"email"},{id:"c3",name:"Department",type:"text"},{id:"c4",name:"Start Date",type:"date"}] },
  { id: "t-6", name: "Marketing Campaigns", description: "Track all marketing initiatives", createdAt: "2025-12-01T10:00:00Z", updatedAt: "2026-02-14T13:00:00Z", recordCount: 67, status: "active", automations: 2, columns: [{id:"c1",name:"Campaign",type:"text"},{id:"c2",name:"Channel",type:"text"},{id:"c3",name:"Budget",type:"number"}] },
  { id: "t-7", name: "Support Tickets", description: "Customer support ticket tracking", createdAt: "2025-06-20T09:00:00Z", updatedAt: "2026-02-17T07:00:00Z", recordCount: 2340, status: "active", automations: 6, columns: [{id:"c1",name:"Subject",type:"text"},{id:"c2",name:"Customer",type:"text"},{id:"c3",name:"Priority",type:"select",options:["Low","Medium","High","Urgent"]}] },
  { id: "t-8", name: "Invoice Records", description: "All client invoices and payments", createdAt: "2025-10-12T11:00:00Z", updatedAt: "2026-02-16T09:00:00Z", recordCount: 478, status: "active", automations: 3, columns: [{id:"c1",name:"Invoice #",type:"text"},{id:"c2",name:"Client",type:"text"},{id:"c3",name:"Amount",type:"number"},{id:"c4",name:"Paid",type:"checkbox"}] },
  { id: "t-9", name: "Event Registrations", description: "Event attendee management", createdAt: "2025-11-08T14:00:00Z", updatedAt: "2026-02-15T16:00:00Z", recordCount: 234, status: "active", automations: 2, columns: [{id:"c1",name:"Attendee",type:"text"},{id:"c2",name:"Email",type:"email"},{id:"c3",name:"Ticket",type:"select",options:["Free","Standard","VIP"]}] },
  { id: "t-10", name: "Content Calendar", description: "Content publishing schedule", createdAt: "2025-09-25T10:00:00Z", updatedAt: "2026-02-17T04:00:00Z", recordCount: 145, status: "active", automations: 1, columns: [{id:"c1",name:"Title",type:"text"},{id:"c2",name:"Author",type:"text"},{id:"c3",name:"Publish Date",type:"date"}] },
  { id: "t-11", name: "Vendor Contacts", description: "Supplier and vendor information", createdAt: "2025-12-15T08:00:00Z", updatedAt: "2026-02-10T12:00:00Z", recordCount: 78, status: "draft", automations: 0, columns: [{id:"c1",name:"Vendor",type:"text"},{id:"c2",name:"Contact",type:"text"},{id:"c3",name:"Email",type:"email"}] },
  { id: "t-12", name: "Bug Tracker", description: "Software bug reports and fixes", createdAt: "2025-08-30T09:00:00Z", updatedAt: "2026-02-16T18:00:00Z", recordCount: 567, status: "active", automations: 3, columns: [{id:"c1",name:"Bug",type:"text"},{id:"c2",name:"Severity",type:"select",options:["Low","Medium","High","Critical"]},{id:"c3",name:"Fixed",type:"checkbox"}] },
  { id: "t-13", name: "Expense Reports", description: "Employee expense tracking", createdAt: "2025-07-18T11:00:00Z", updatedAt: "2026-02-15T15:00:00Z", recordCount: 890, status: "active", automations: 2, columns: [{id:"c1",name:"Employee",type:"text"},{id:"c2",name:"Amount",type:"number"},{id:"c3",name:"Category",type:"text"},{id:"c4",name:"Approved",type:"checkbox"}] },
  { id: "t-14", name: "Newsletter Subscribers", description: "Email newsletter subscriber list", createdAt: "2025-06-01T08:00:00Z", updatedAt: "2026-02-17T03:00:00Z", recordCount: 4567, status: "active", automations: 4, columns: [{id:"c1",name:"Name",type:"text"},{id:"c2",name:"Email",type:"email"},{id:"c3",name:"Active",type:"checkbox"}] },
  { id: "t-15", name: "Meeting Notes", description: "Notes from meetings", createdAt: "2025-10-08T13:00:00Z", updatedAt: "2026-02-14T10:00:00Z", recordCount: 234, status: "active", automations: 1, columns: [{id:"c1",name:"Meeting",type:"text"},{id:"c2",name:"Date",type:"date"},{id:"c3",name:"Notes",type:"text"}] },
  { id: "t-16", name: "Feedback Responses", description: "Customer feedback and surveys", createdAt: "2025-09-12T09:00:00Z", updatedAt: "2026-02-16T20:00:00Z", recordCount: 1890, status: "active", automations: 2, columns: [{id:"c1",name:"Respondent",type:"text"},{id:"c2",name:"Rating",type:"number"},{id:"c3",name:"Comment",type:"text"}] },
  { id: "t-17", name: "Shipping Tracking", description: "Order shipping status", createdAt: "2025-08-05T10:00:00Z", updatedAt: "2026-02-17T06:30:00Z", recordCount: 3456, status: "active", automations: 5, columns: [{id:"c1",name:"Order #",type:"text"},{id:"c2",name:"Customer",type:"text"},{id:"c3",name:"Status",type:"select",options:["Processing","Shipped","Delivered"]}] },
  { id: "t-18", name: "Interview Schedule", description: "Hiring interview management", createdAt: "2025-12-20T14:00:00Z", updatedAt: "2026-02-13T11:00:00Z", recordCount: 45, status: "draft", automations: 1, columns: [{id:"c1",name:"Candidate",type:"text"},{id:"c2",name:"Position",type:"text"},{id:"c3",name:"Date",type:"date"}] },
  { id: "t-19", name: "API Endpoints", description: "API documentation and testing", createdAt: "2025-11-01T08:00:00Z", updatedAt: "2026-02-12T15:00:00Z", recordCount: 124, status: "active", automations: 0, columns: [{id:"c1",name:"Endpoint",type:"text"},{id:"c2",name:"Method",type:"select",options:["GET","POST","PUT","DELETE"]},{id:"c3",name:"Auth Required",type:"checkbox"}] },
  { id: "t-20", name: "Social Media Posts", description: "Scheduled social content", createdAt: "2025-10-18T10:00:00Z", updatedAt: "2026-02-16T22:00:00Z", recordCount: 312, status: "active", automations: 3, columns: [{id:"c1",name:"Content",type:"text"},{id:"c2",name:"Platform",type:"select",options:["Twitter","LinkedIn","Instagram"]},{id:"c3",name:"Published",type:"checkbox"}] },
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
