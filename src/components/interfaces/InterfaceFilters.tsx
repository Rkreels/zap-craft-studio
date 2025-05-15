
import React from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

interface InterfaceFiltersProps {
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  sortDirection: "asc" | "desc";
  toggleSort: (field: string) => void;
}

const InterfaceFilters: React.FC<InterfaceFiltersProps> = ({
  filterStatus,
  setFilterStatus,
  sortBy,
  sortDirection,
  toggleSort
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-between">
      <div className="flex gap-2">
        <Button 
          variant={filterStatus === "all" ? "default" : "outline"} 
          onClick={() => setFilterStatus("all")}
        >
          All Status
        </Button>
        <Button 
          variant={filterStatus === "published" ? "default" : "outline"} 
          onClick={() => setFilterStatus("published")}
        >
          Published
        </Button>
        <Button 
          variant={filterStatus === "draft" ? "default" : "outline"} 
          onClick={() => setFilterStatus("draft")}
        >
          Draft
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => toggleSort("updatedAt")}
          className="gap-1"
        >
          Sort: {sortBy === "updatedAt" ? (sortDirection === "asc" ? "Oldest" : "Newest") : "Date"}
        </Button>
        <Button
          variant="outline"
          onClick={() => toggleSort("viewCount")}
          className="gap-1"
        >
          <EyeIcon size={16} /> 
          {sortBy === "viewCount" ? (sortDirection === "asc" ? "Least" : "Most") : ""} Views
        </Button>
      </div>
    </div>
  );
};

export default InterfaceFilters;
