
import { useState, useEffect } from "react";
import { InterfaceItem } from "@/types/interfaces";
import { initialInterfaces } from "./mockData";
import { InterfaceManagerHook } from "./types";
import { 
  formatDate, 
  getPreviewImage
} from "./interfaceOperations";
import { 
  useInterfaceCreation,
  useInterfaceUpdate,
  useInterfaceDeletion,
  useInterfaceBulkOperations
} from "./interfaceHooks";
import { useInterfaceFiltering } from "./interfaceFilters";

export const useInterfaceManager = (): InterfaceManagerHook => {
  // State for interfaces data
  const [interfaces, setInterfaces] = useState<InterfaceItem[]>(initialInterfaces);
  
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // State for loading and UI
  const [isLoading, setIsLoading] = useState(false);
  
  // State for dialogs
  const [editingInterface, setEditingInterface] = useState<InterfaceItem | null>(null);
  const [viewingInterface, setViewingInterface] = useState<InterfaceItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [interfaceToDelete, setInterfaceToDelete] = useState<string | null>(null);
  const [isZapierDialogOpen, setIsZapierDialogOpen] = useState(false);
  
  // State for bulk actions
  const [selectedForAction, setSelectedForAction] = useState<string[]>([]);
  
  // State for new interface creation
  const [newInterface, setNewInterface] = useState<{
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  }>({
    name: "",
    type: "form",
    description: ""
  });

  // Get filtered and sorted interfaces
  const { processedInterfaces, toggleSortOperation } = useInterfaceFiltering(
    interfaces,
    searchQuery,
    filterType,
    filterStatus,
    sortBy,
    sortDirection,
    setSortBy,
    setSortDirection
  );

  // CRUD operations hooks
  const { createInterface } = useInterfaceCreation(
    newInterface,
    setIsLoading,
    setInterfaces,
    setNewInterface
  );

  const { updateInterface } = useInterfaceUpdate(
    editingInterface,
    setIsLoading,
    setInterfaces,
    setEditingInterface
  );

  const { deleteInterface } = useInterfaceDeletion(
    interfaceToDelete,
    setIsLoading,
    setInterfaces,
    setIsDeleteDialogOpen,
    setInterfaceToDelete
  );

  const { 
    bulkDeleteInterfaces, 
    bulkPublishInterfaces, 
    duplicateInterface 
  } = useInterfaceBulkOperations(
    selectedForAction,
    setIsLoading,
    setInterfaces,
    setSelectedForAction
  );

  const toggleSort = (field: string) => {
    toggleSortOperation(field);
  };
  
  const confirmDelete = (id: string) => {
    setInterfaceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const openInterfaceEditor = (id: string) => {
    const interface_ = interfaces.find(item => item.id === id);
    if (interface_) {
      // Increment view count
      const updatedInterfaces = interfaces.map(item => 
        item.id === id ? { ...item, viewCount: (item.viewCount || 0) + 1 } : item
      );
      setInterfaces(updatedInterfaces);
      setEditingInterface(interface_);
    }
  };
  
  const openInterfaceDetails = (id: string) => {
    const interface_ = interfaces.find(item => item.id === id);
    if (interface_) {
      // Increment view count
      const updatedInterfaces = interfaces.map(item => 
        item.id === id ? { ...item, viewCount: (item.viewCount || 0) + 1 } : item
      );
      setInterfaces(updatedInterfaces);
      setViewingInterface(interface_);
    }
  };
  
  const handleSelectInterface = (id: string) => {
    setSelectedForAction(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedForAction.length === processedInterfaces.length) {
      setSelectedForAction([]);
    } else {
      setSelectedForAction(processedInterfaces.map(item => item.id));
    }
  };

  // Simulate loading interfaces from API on mount
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return {
    interfaces: processedInterfaces,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    isLoading,
    editingInterface,
    setEditingInterface,
    viewingInterface,
    setViewingInterface,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    interfaceToDelete,
    setInterfaceToDelete,
    isZapierDialogOpen,
    setIsZapierDialogOpen,
    selectedForAction,
    setSelectedForAction,
    newInterface,
    setNewInterface,
    formatDate,
    getPreviewImage,
    toggleSort,
    createInterface,
    updateInterface,
    deleteInterface,
    bulkDeleteInterfaces,
    bulkPublishInterfaces,
    duplicateInterface,
    confirmDelete,
    openInterfaceEditor,
    openInterfaceDetails,
    handleSelectInterface,
    toggleSelectAll
  };
};
