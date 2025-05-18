
import React from 'react';
import { InterfaceItem } from '@/types/interfaces';
import InterfaceCard from './InterfaceCard';

export interface InterfaceGalleryProps {
  interfaces: InterfaceItem[];
  isLoading: boolean;
  openInterfaceEditor: (id: string) => void;
  duplicateInterface: (item: InterfaceItem) => void;
  confirmDelete: (id: string) => void;
  openInterfaceDetails: (id: string) => void; // Updated to accept id instead of item
  openVersionHistory: (interfaceId: string) => void;
}

export function InterfaceGallery({
  interfaces,
  isLoading,
  openInterfaceEditor,
  duplicateInterface,
  confirmDelete,
  openInterfaceDetails,
  openVersionHistory
}: InterfaceGalleryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-[280px]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {interfaces.length === 0 ? (
        <div className="col-span-3 text-center py-12">
          <p className="text-gray-500">No interfaces found</p>
        </div>
      ) : (
        interfaces.map(item => (
          <InterfaceCard
            key={item.id}
            interface={item}
            onEdit={() => openInterfaceEditor(item.id)}
            onDuplicate={() => duplicateInterface(item)}
            onDelete={() => confirmDelete(item.id)}
            onView={() => openInterfaceDetails(item.id)}
            onVersionHistory={() => openVersionHistory(item.id)}
          />
        ))
      )}
    </div>
  );
}
