
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Layout, List, Plus } from "lucide-react";

interface CreateInterfaceProps {
  newInterface?: {
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  };
  setNewInterface?: React.Dispatch<React.SetStateAction<{
    name: string;
    type: "form" | "page" | "dashboard";
    description: string;
  }>>;
  isLoading?: boolean;
  createInterface?: () => void;
}

const CreateInterfaceDialog: React.FC<CreateInterfaceProps> = ({
  newInterface = { name: "", type: "form", description: "" },
  setNewInterface = () => {},
  isLoading = false,
  createInterface = () => {}
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 whitespace-nowrap">
          <Plus size={16} />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Interface</DialogTitle>
          <DialogDescription>
            Select a type and enter a name for your new interface.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Interface Name"
            value={newInterface.name}
            onChange={(e) => setNewInterface({...newInterface, name: e.target.value})}
            className="mb-4"
          />
          
          <Textarea
            placeholder="Description (optional)"
            value={newInterface.description}
            onChange={(e) => setNewInterface({...newInterface, description: e.target.value})}
            className="mb-4"
          />
          
          <div className="mb-2">Interface Type:</div>
          <div className="flex gap-2">
            <Button 
              variant={newInterface.type === "form" ? "default" : "outline"} 
              onClick={() => setNewInterface({...newInterface, type: "form"})}
              className="flex-1"
            >
              <FileText size={16} className="mr-2" />
              Form
            </Button>
            <Button 
              variant={newInterface.type === "page" ? "default" : "outline"} 
              onClick={() => setNewInterface({...newInterface, type: "page"})}
              className="flex-1"
            >
              <Layout size={16} className="mr-2" />
              Page
            </Button>
            <Button 
              variant={newInterface.type === "dashboard" ? "default" : "outline"} 
              onClick={() => setNewInterface({...newInterface, type: "dashboard"})}
              className="flex-1"
            >
              <List size={16} className="mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setNewInterface({ name: "", type: "form", description: "" })}>Cancel</Button>
          <Button onClick={createInterface} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Interface"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInterfaceDialog;
