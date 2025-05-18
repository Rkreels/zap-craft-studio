
import { InterfaceItem } from "@/types/interfaces";

export interface InterfaceManagerHook {
  interfaces: InterfaceItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  isLoading: boolean;
  editingInterface: InterfaceItem | null;
  setEditingInterface: React.Dispatch<React.SetStateAction<InterfaceItem | null>>;
  viewingInterface: InterfaceItem | null;
  setViewingInterface: React.Dispatch<React.SetStateAction<InterfaceItem | null>>;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  interfaceToDelete: string | null;
  setInterfaceToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  isZapierDialogOpen: boolean;
  setIsZapierDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedForAction: string[];
  setSelectedForAction: React.Dispatch<React.SetStateAction<string[]>>;
  newInterface: {
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  };
  setNewInterface: React.Dispatch<React.SetStateAction<{
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
  openInterfaceDetails: (id: string) => void;
  handleSelectInterface: (id: string) => void;
  toggleSelectAll: () => void;
}
