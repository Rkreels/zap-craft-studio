
import { InterfaceItem } from "@/types/interfaces";
import { Dispatch, SetStateAction } from "react";

export interface InterfaceManagerHook {
  interfaces: InterfaceItem[];
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  filterType: string;
  setFilterType: Dispatch<SetStateAction<string>>;
  filterStatus: string;
  setFilterStatus: Dispatch<SetStateAction<string>>;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  sortDirection: "asc" | "desc";
  setSortDirection: Dispatch<SetStateAction<"asc" | "desc">>;
  isLoading: boolean;
  editingInterface: InterfaceItem | null;
  setEditingInterface: Dispatch<SetStateAction<InterfaceItem | null>>;
  viewingInterface: InterfaceItem | null;
  setViewingInterface: Dispatch<SetStateAction<InterfaceItem | null>>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  interfaceToDelete: string | null;
  setInterfaceToDelete: Dispatch<SetStateAction<string | null>>;
  isZapierDialogOpen: boolean;
  setIsZapierDialogOpen: Dispatch<SetStateAction<boolean>>;
  selectedForAction: string[];
  setSelectedForAction: Dispatch<SetStateAction<string[]>>;
  newInterface: {
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  };
  setNewInterface: Dispatch<SetStateAction<{
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  }>>;
  formatDate: (dateString: string) => string;
  getPreviewImage: (type: string) => string;
  toggleSort: (field: string) => void;
  createInterface: () => void;
  updateInterface: () => void;
  deleteInterface: () => void;
  bulkDeleteInterfaces: () => void;
  bulkPublishInterfaces: () => void;
  duplicateInterface: (item: InterfaceItem) => void;
  confirmDelete: (id: string) => void;
  openInterfaceEditor: (id: string) => void;
  openInterfaceDetails: (id: string) => void;  // Changed from (item: InterfaceItem) => void to (id: string) => void
  handleSelectInterface: (id: string) => void;
  toggleSelectAll: () => void;
}
