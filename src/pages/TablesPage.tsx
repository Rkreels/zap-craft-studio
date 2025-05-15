
import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Trash2, Copy, Share2 } from "lucide-react";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { tablesScripts } from "@/data/voiceScripts";

// Type definitions for our data
interface TableRecord {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  recordCount: number;
  status: "active" | "draft";
}

// Mock data for tables
const initialTables: TableRecord[] = [
  {
    id: "table-1",
    name: "Customer Data",
    createdAt: "2025-05-01T14:30:00Z",
    updatedAt: "2025-05-14T09:15:00Z",
    recordCount: 128,
    status: "active"
  },
  {
    id: "table-2",
    name: "Product Inventory",
    createdAt: "2025-05-03T11:20:00Z",
    updatedAt: "2025-05-12T16:45:00Z",
    recordCount: 75,
    status: "active"
  },
  {
    id: "table-3",
    name: "Marketing Campaigns",
    createdAt: "2025-05-05T08:45:00Z",
    updatedAt: "2025-05-10T13:30:00Z",
    recordCount: 12,
    status: "draft"
  }
];

export default function TablesPage() {
  const [tables, setTables] = useState<TableRecord[]>(initialTables);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingTable, setEditingTable] = useState<TableRecord | null>(null);
  const [newTableName, setNewTableName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);
  
  // Voice guidance
  const headerVoiceProps = {
    elementName: "Table Header",
    hoverText: tablesScripts.tableHeader.hover,
    clickText: tablesScripts.tableHeader.click
  };
  
  const listVoiceProps = {
    elementName: "Table List",
    hoverText: tablesScripts.tableList.hover,
    clickText: tablesScripts.tableList.click
  };
  
  const { handleMouseEnter: headerMouseEnter, handleClick: headerClick } = useVoiceGuidance(headerVoiceProps);
  const { handleMouseEnter: listMouseEnter, handleClick: listClick } = useVoiceGuidance(listVoiceProps);

  // Filter tables based on search query
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // CRUD Operations
  const createTable = () => {
    if (!newTableName.trim()) {
      toast({
        title: "Table name required",
        description: "Please enter a name for your new table",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTable: TableRecord = {
        id: `table-${Date.now()}`,
        name: newTableName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recordCount: 0,
        status: "draft"
      };
      
      setTables(prev => [...prev, newTable]);
      setNewTableName("");
      setIsLoading(false);
      
      toast({
        title: "Table created",
        description: `${newTableName} has been created successfully.`
      });
    }, 800);
  };

  const updateTable = () => {
    if (!editingTable) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTables(prev => prev.map(table => 
        table.id === editingTable.id 
          ? { ...editingTable, updatedAt: new Date().toISOString() } 
          : table
      ));
      
      setIsLoading(false);
      setEditingTable(null);
      
      toast({
        title: "Table updated",
        description: `${editingTable.name} has been updated successfully.`
      });
    }, 800);
  };

  const deleteTable = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTables(prev => prev.filter(table => table.id !== id));
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setTableToDelete(null);
      
      toast({
        title: "Table deleted",
        description: "The table has been deleted successfully.",
        variant: "destructive"
      });
    }, 800);
  };

  const duplicateTable = (table: TableRecord) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const duplicatedTable: TableRecord = {
        ...table,
        id: `table-${Date.now()}`,
        name: `${table.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recordCount: 0,
        status: "draft"
      };
      
      setTables(prev => [...prev, duplicatedTable]);
      setIsLoading(false);
      
      toast({
        title: "Table duplicated",
        description: `A copy of ${table.name} has been created.`
      });
    }, 800);
  };

  const confirmDelete = (id: string) => {
    setTableToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Simulate loading tables from API on mount
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div 
        className="mb-6"
        onMouseEnter={headerMouseEnter}
        onClick={headerClick}
      >
        <h1 className="text-2xl font-bold mb-2">Tables</h1>
        <p className="text-gray-600">Create and manage your data tables</p>
      </div>

      {/* Action bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search tables"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              New Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Table</DialogTitle>
              <DialogDescription>
                Enter a name for your new table. You can add fields after creation.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Table Name"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                className="mb-4"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewTableName("")}>Cancel</Button>
              <Button onClick={createTable} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Table"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tables list */}
      <div 
        className="bg-white rounded-lg border border-gray-200"
        onMouseEnter={listMouseEnter}
        onClick={listClick}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Records</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700"></div>
                    <span className="ml-2">Loading tables...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-gray-500">No tables found</p>
                  <Button variant="link" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              filteredTables.map((table) => (
                <TableRow key={table.id} className="group">
                  <TableCell className="font-medium">{table.name}</TableCell>
                  <TableCell>{formatDate(table.createdAt)}</TableCell>
                  <TableCell>{formatDate(table.updatedAt)}</TableCell>
                  <TableCell>{table.recordCount}</TableCell>
                  <TableCell>
                    <Badge className={table.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {table.status === 'active' ? 'Active' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setEditingTable(table)}>
                            <Edit size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Table</DialogTitle>
                            <DialogDescription>
                              Update the details of your table.
                            </DialogDescription>
                          </DialogHeader>
                          {editingTable && (
                            <div className="py-4">
                              <Input
                                placeholder="Table Name"
                                value={editingTable.name}
                                onChange={(e) => setEditingTable({...editingTable, name: e.target.value})}
                                className="mb-4"
                              />
                              <div className="flex items-center mb-4">
                                <span className="mr-2">Status:</span>
                                <Button 
                                  variant={editingTable.status === 'active' ? 'default' : 'outline'} 
                                  size="sm"
                                  onClick={() => setEditingTable({...editingTable, status: 'active'})}
                                  className="mr-2"
                                >
                                  Active
                                </Button>
                                <Button 
                                  variant={editingTable.status === 'draft' ? 'default' : 'outline'} 
                                  size="sm"
                                  onClick={() => setEditingTable({...editingTable, status: 'draft'})}
                                >
                                  Draft
                                </Button>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingTable(null)}>Cancel</Button>
                            <Button onClick={updateTable} disabled={isLoading}>
                              {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="ghost" size="icon" onClick={() => duplicateTable(table)}>
                        <Copy size={16} />
                      </Button>
                      
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete(table.id)}>
                        <Trash2 size={16} />
                      </Button>
                      
                      <Button variant="ghost" size="icon">
                        <Share2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
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
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Table"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
