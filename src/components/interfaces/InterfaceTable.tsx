import React from 'react';
import { InterfaceItem } from '@/types/interfaces';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, FileEdit, MoreHorizontal, Trash2, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface InterfaceTableProps {
  interfaces: InterfaceItem[];
  selectedForAction: string[];
  handleSelectInterface: (id: string) => void;
  toggleSelectAll: () => void;
  openInterfaceEditor: (id: string) => void;
  openInterfaceDetails: (id: string) => void;
  duplicateInterface: (item: InterfaceItem) => void;
  confirmDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
  openVersionHistory: (interfaceId: string) => void;
}

export function InterfaceTable({ 
  interfaces, 
  selectedForAction, 
  handleSelectInterface, 
  toggleSelectAll, 
  openInterfaceEditor, 
  openInterfaceDetails,
  duplicateInterface, 
  confirmDelete, 
  formatDate,
  openVersionHistory 
}: InterfaceTableProps) {
  const isAllSelected = selectedForAction.length === interfaces.length;

  return (
    <div className="w-full relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interfaces.map((item) => {
            const isSelected = selectedForAction.includes(item.id);
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium w-[50px]">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleSelectInterface(item.id)}
                    aria-label={`Select ${item.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openInterfaceDetails(item)}>
                        <Copy className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openInterfaceEditor(item.id)}>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit Interface
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateInterface(item)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openVersionHistory(item.id)}>
                        <Clock className="mr-2 h-4 w-4" />
                        View Version History
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => confirmDelete(item.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
