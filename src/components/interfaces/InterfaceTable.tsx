import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Copy, Check } from "lucide-react";
import { InterfaceItem } from "@/types/interfaces";
import { getTypeIcon } from "@/utils/interfaceIcons";

interface InterfaceTableProps {
  interfaces: InterfaceItem[];
  selectedForAction: string[];
  handleSelectInterface: (id: string) => void;
  toggleSelectAll: () => void;
  openInterfaceEditor: (id: string) => void;
  duplicateInterface: (item: InterfaceItem) => void;
  confirmDelete: (id: string) => void;
  sortBy: string;
  sortDirection: "asc" | "desc";
  toggleSort: (field: string) => void;
  bulkPublishInterfaces: () => void;
  bulkDeleteInterfaces: () => void;
  formatDate: (dateString: string) => string;
}

const InterfaceTable: React.FC<InterfaceTableProps> = ({
  interfaces,
  selectedForAction,
  handleSelectInterface,
  toggleSelectAll,
  openInterfaceEditor,
  duplicateInterface,
  confirmDelete,
  sortBy,
  sortDirection,
  toggleSort,
  bulkPublishInterfaces,
  bulkDeleteInterfaces,
  formatDate,
}) => {
  return (
    <>
      {selectedForAction.length > 0 && (
        <div className="bg-gray-100 p-3 rounded-md mb-4 flex justify-between items-center">
          <div>
            <span className="font-medium">{selectedForAction.length} items selected</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={bulkPublishInterfaces}
            >
              <Check size={16} className="mr-1" />
              Publish
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={bulkDeleteInterfaces}
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}
            
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input 
                type="checkbox" 
                checked={selectedForAction.length === interfaces.length && interfaces.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-gray-300"
              />
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort("name")}
            >
              Name {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort("type")}
            >
              Type {sortBy === "type" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort("status")}
            >
              Status {sortBy === "status" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort("updatedAt")}
            >
              Updated {sortBy === "updatedAt" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort("viewCount")}
            >
              Views {sortBy === "viewCount" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interfaces.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <input 
                  type="checkbox" 
                  checked={selectedForAction.includes(item.id)}
                  onChange={() => handleSelectInterface(item.id)}
                  className="rounded border-gray-300"
                />
              </TableCell>
              <TableCell>
                <div className="font-medium">{item.name}</div>
                {item.description && (
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">
                    {item.description}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="flex items-center w-fit gap-1">
                  {getTypeIcon(item.type)}
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {item.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(item.updatedAt)}</TableCell>
              <TableCell>{item.viewCount || 0}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openInterfaceEditor(item.id)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => duplicateInterface(item)}>
                    <Copy size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => confirmDelete(item.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default InterfaceTable;
