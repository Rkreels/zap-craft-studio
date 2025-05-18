import React from 'react';
import { InterfaceCard } from './InterfaceCard';
import { InterfaceItem } from '@/types/interfaces';
import { Button } from '@/components/ui/button';
import { CreateInterfaceDialog } from './CreateInterfaceDialog';

export interface InterfaceGalleryProps {
  interfaces: InterfaceItem[];
  isLoading: boolean;
  openInterfaceEditor: (id: string) => void;
  duplicateInterface: (item: InterfaceItem) => void;
  confirmDelete: (id: string) => void;
  openInterfaceDetails: (item: InterfaceItem) => void;
  openVersionHistory: (interfaceId: string) => void; // Added this prop
}

export function InterfaceGallery({
  interfaces,
  isLoading,
  openInterfaceEditor,
  duplicateInterface,
  confirmDelete,
  openInterfaceDetails,
  openVersionHistory, // Added this prop
}: InterfaceGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Interfaces</h2>
        <CreateInterfaceDialog />
      </div>
      
      {isLoading ? (
        <p>Loading interfaces...</p>
      ) : interfaces.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No interfaces created yet.</p>
          <Button>Create your first interface</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {interfaces.map((item) => (
            <InterfaceCard
              key={item.id}
              item={item}
              openInterfaceEditor={openInterfaceEditor}
              duplicateInterface={duplicateInterface}
              confirmDelete={confirmDelete}
              openInterfaceDetails={openInterfaceDetails}
              openVersionHistory={openVersionHistory} // Passed this prop
            />
          ))}
        </div>
      )}
    </div>
  );
}
