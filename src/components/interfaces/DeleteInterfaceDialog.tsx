
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
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";

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
  // Voice guidance for delete dialog
  const dialogVoiceProps = {
    elementName: "Delete Dialog",
    hoverText: "Delete interface confirmation dialog.",
    clickText: "Please confirm if you want to delete this interface. This action cannot be undone."
  };
  const dialogGuidance = useVoiceGuidance(dialogVoiceProps);

  // Voice guidance for cancel button
  const cancelVoiceProps = {
    elementName: "Cancel Button",
    hoverText: "Cancel deletion.",
    clickText: "Canceling deletion and closing dialog."
  };
  const cancelGuidance = useVoiceGuidance(cancelVoiceProps);

  // Voice guidance for confirm delete button
  const confirmVoiceProps = {
    elementName: "Confirm Delete Button",
    hoverText: "Confirm interface deletion.",
    clickText: "Deleting interface. This action cannot be undone."
  };
  const confirmGuidance = useVoiceGuidance(confirmVoiceProps);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent onMouseEnter={dialogGuidance.handleMouseEnter}>
        <DialogHeader>
          <DialogTitle>Delete Interface</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this interface? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              cancelGuidance.handleClick();
              setIsOpen(false);
            }}
            onMouseEnter={cancelGuidance.handleMouseEnter}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              confirmGuidance.handleClick();
              onConfirmDelete();
            }}
            disabled={isLoading}
            onMouseEnter={confirmGuidance.handleMouseEnter}
          >
            {isLoading ? "Deleting..." : "Delete Interface"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInterfaceDialog;
