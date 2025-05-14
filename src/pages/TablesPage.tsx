
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Download, Trash, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Mock data for tables
const mockTables = [
  {
    id: "table-1",
    name: "Customer Data",
    rows: 1245,
    lastUpdated: "2025-05-12T14:30:00Z",
    status: "active",
  },
  {
    id: "table-2",
    name: "Product Inventory",
    rows: 578,
    lastUpdated: "2025-05-10T09:45:00Z",
    status: "active",
  },
  {
    id: "table-3",
    name: "Marketing Campaigns",
    rows: 32,
    lastUpdated: "2025-05-08T16:20:00Z",
    status: "archived",
  },
  {
    id: "table-4",
    name: "User Analytics",
    rows: 4120,
    lastUpdated: "2025-05-05T11:15:00Z",
    status: "active",
  },
  {
    id: "table-5",
    name: "Financial Reports",
    rows: 215,
    lastUpdated: "2025-05-01T13:40:00Z",
    status: "active",
  },
];

export default function TablesPage() {
  const [tables, setTables] = useState(mockTables);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter tables based on search and status filter
  const filteredTables = tables.filter((table) => {
    const matchesSearch = table.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || table.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleCreateTable = () => {
    toast({
      title: "Create new table",
      description: "This feature is coming soon!",
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Edit table",
      description: `Editing table with ID: ${id}`,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      const updatedTables = tables.filter(table => table.id !== id);
      setTables(updatedTables);
      
      toast({
        title: "Table deleted",
        description: "The table has been deleted successfully",
        variant: "destructive",
      });
    }
  };

  const handleExport = (id: string) => {
    toast({
      title: "Exporting table",
      description: `Exporting table with ID: ${id}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tables</h1>
        <p className="text-gray-600">
          Manage and organize your data in structured tables
        </p>
      </div>

      {/* Filters and actions */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search tables"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter size={16} className="mr-2" />
                {statusFilter === "all"
                  ? "All Status"
                  : statusFilter === "active"
                  ? "Active"
                  : "Archived"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("archived")}>
                Archived
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleCreateTable} className="bg-purple-600 hover:bg-purple-700">
            <Plus size={16} className="mr-2" />
            New Table
          </Button>
        </div>
      </div>

      {/* Tables list */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rows</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTables.length > 0 ? (
              filteredTables.map((table) => (
                <TableRow key={table.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{table.name}</TableCell>
                  <TableCell>{table.rows.toLocaleString()}</TableCell>
                  <TableCell>{formatDate(table.lastUpdated)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        table.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(table.id)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleExport(table.id)}
                        title="Export"
                      >
                        <Download size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(table.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-gray-500">No tables found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
