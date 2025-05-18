
import { InterfaceItem } from "@/types/interfaces";

export interface InterfaceManagerState {
  interfaces: InterfaceItem[];
  searchQuery: string;
  filterType: string;
  filterStatus: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  isLoading: boolean;
  editingInterface: InterfaceItem | null;
  viewingInterface: InterfaceItem | null;
  isDeleteDialogOpen: boolean;
  interfaceToDelete: string | null;
  isZapierDialogOpen: boolean;
  selectedForAction: string[];
  newInterface: {
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  };
}

export interface InterfaceManagerActions {
  setSearchQuery: (query: string) => void;
  setFilterType: (type: string) => void;
  setFilterStatus: (status: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  setEditingInterface: (interface_: InterfaceItem | null) => void;
  setViewingInterface: (interface_: InterfaceItem | null) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setInterfaceToDelete: (id: string | null) => void;
  setIsZapierDialogOpen: (isOpen: boolean) => void;
  setSelectedForAction: (ids: string[]) => void;
  setNewInterface: (interface_: InterfaceManagerState['newInterface']) => void;
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
  openInterfaceDetails: (item: InterfaceItem) => void;
  handleSelectInterface: (id: string) => void;
  toggleSelectAll: () => void;
}

export type InterfaceManagerHook = InterfaceManagerState & InterfaceManagerActions;
