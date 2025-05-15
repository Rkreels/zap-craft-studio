
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onPublish: () => void;
  onDelete: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedCount, onPublish, onDelete }) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="bg-gray-100 p-3 rounded-md mb-4 flex justify-between items-center">
      <div>
        <span className="font-medium">{selectedCount} items selected</span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onPublish}
        >
          <Check size={16} className="mr-1" />
          Publish
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:text-red-700"
          onClick={onDelete}
        >
          <Trash2 size={16} className="mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
