
import { InterfaceItem } from "@/types/interfaces";
import { Dispatch, SetStateAction } from "react";

export const processInterfaces = (
  interfaces: InterfaceItem[],
  searchQuery: string,
  filterType: string,
  filterStatus: string,
  sortBy: string,
  sortDirection: "asc" | "desc"
): InterfaceItem[] => {
  return interfaces
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || item.type === filterType;
      const matchesStatus = filterStatus === "all" || item.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch(sortBy) {
        case "name":
          valueA = a.name;
          valueB = b.name;
          break;
        case "type":
          valueA = a.type;
          valueB = b.type;
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        case "viewCount":
          valueA = a.viewCount || 0;
          valueB = b.viewCount || 0;
          break;
        default: // updatedAt
          valueA = new Date(a.updatedAt).getTime();
          valueB = new Date(b.updatedAt).getTime();
      }
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
};

// Hook for filtering interfaces
export const useInterfaceFiltering = (
  interfaces: InterfaceItem[],
  searchQuery: string,
  filterType: string,
  filterStatus: string,
  sortBy: string,
  sortDirection: "asc" | "desc",
  setSortBy: Dispatch<SetStateAction<string>>,
  setSortDirection: Dispatch<SetStateAction<"asc" | "desc">>
) => {
  const processedInterfaces = processInterfaces(
    interfaces,
    searchQuery,
    filterType,
    filterStatus,
    sortBy,
    sortDirection
  );

  const toggleSortOperation = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  return { processedInterfaces, toggleSortOperation };
};
