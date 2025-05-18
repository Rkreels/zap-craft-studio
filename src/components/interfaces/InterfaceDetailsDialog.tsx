
import React, { Dispatch, SetStateAction } from 'react';
import { InterfaceItem } from '@/types/interfaces';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, FileEdit, History, Trash2, ExternalLink } from 'lucide-react';
import { getTypeIcon } from '@/utils/interfaceIcons';

export interface InterfaceDetailsDialogProps {
  viewingInterface: InterfaceItem | null;
  setViewingInterface: Dispatch<SetStateAction<InterfaceItem | null>>;
  setEditingInterface: Dispatch<SetStateAction<InterfaceItem | null>>;
  confirmDelete: (id: string) => void;
  duplicateInterface: (item: InterfaceItem) => void;
  formatDate: (dateString: string) => string;
  openVersionHistory: (interfaceId: string) => void;
}

export function InterfaceDetailsDialog({
  viewingInterface,
  setViewingInterface,
  setEditingInterface,
  confirmDelete,
  duplicateInterface,
  formatDate,
  openVersionHistory,
}: InterfaceDetailsDialogProps) {
  if (!viewingInterface) {
    return null;
  }

  const { id, name, description, type, createdAt, updatedAt } = viewingInterface;
  const TypeIcon = getTypeIcon(type);

  return (
    <Dialog open={!!viewingInterface} onOpenChange={() => setViewingInterface(null)}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {TypeIcon}
            {name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">Version History</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <h4 className="text-sm font-medium leading-none">Description</h4>
                <p className="text-sm text-gray-500">{description || 'No description provided.'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium leading-none">Type</h4>
                <p className="text-sm text-gray-500">{type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium leading-none">Created At</h4>
                <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium leading-none">Last Updated</h4>
                <p className="text-sm text-gray-500">{formatDate(updatedAt)}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div>
              <p className="text-sm text-gray-500">
                No version history available for this interface.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-6">
          <Button variant="ghost" onClick={() => setViewingInterface(null)}>
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setEditingInterface(viewingInterface);
              setViewingInterface(null);
            }}
          >
            <FileEdit size={16} className="mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              duplicateInterface(viewingInterface);
              setViewingInterface(null);
            }}
          >
            <Copy size={16} className="mr-2" />
            Duplicate
          </Button>
          <Button
            variant="outline"
            onClick={() => openVersionHistory(id)}
          >
            <History size={16} className="mr-2" />
            Version History
          </Button>
          <Button variant="destructive" onClick={() => confirmDelete(id)}>
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
