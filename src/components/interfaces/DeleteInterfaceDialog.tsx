
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteInterfaceDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirmDelete: () => void;
  isLoading: boolean;
}

const DeleteInterfaceDialog: React.FC<DeleteInterfaceDialogProps> = ({
  isOpen,
  setIsOpen,
  onConfirmDelete,
  isLoading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Interface</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this interface? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Interface"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInterfaceDialog;
