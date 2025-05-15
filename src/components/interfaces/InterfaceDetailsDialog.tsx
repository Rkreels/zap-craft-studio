
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, Copy, FileText, Layout, List } from "lucide-react";
import { InterfaceItem } from "@/types/interfaces";

interface InterfaceDetailsDialogProps {
  viewingInterface: InterfaceItem | null;
  setViewingInterface: React.Dispatch<React.SetStateAction<InterfaceItem | null>>;
  setEditingInterface: React.Dispatch<React.SetStateAction<InterfaceItem | null>>;
  confirmDelete: (id: string) => void;
  duplicateInterface: (item: InterfaceItem) => void;
  formatDate: (dateString: string) => string;
}

const InterfaceDetailsDialog: React.FC<InterfaceDetailsDialogProps> = ({
  viewingInterface,
  setViewingInterface,
  setEditingInterface,
  confirmDelete,
  duplicateInterface,
  formatDate
}) => {
  // Get icon based on type
  const getTypeIcon = (type: string) => {
    switch(type) {
      case "form": return <FileText size={16} />;
      case "page": return <Layout size={16} />;
      case "dashboard": return <List size={16} />;
      default: return <FileText size={16} />;
    }
  };

  if (!viewingInterface) return null;

  return (
    <Dialog open={!!viewingInterface} onOpenChange={(open) => !open && setViewingInterface(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(viewingInterface.type)}
            {viewingInterface.name}
            {viewingInterface.status === "published" && (
              <Badge className="ml-2 bg-green-100 text-green-700">Published</Badge>
            )}
            {viewingInterface.status === "draft" && (
              <Badge className="ml-2 bg-gray-100 text-gray-700">Draft</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Interface details and statistics
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex gap-4 mb-6">
            <div className="w-1/3">
              <img 
                src={viewingInterface.preview}
                alt={viewingInterface.name}
                className="w-full h-auto rounded-md border"
              />
            </div>
            <div className="w-2/3">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600 mb-4">
                {viewingInterface.description || "No description provided."}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Created</div>
                  <div>{formatDate(viewingInterface.createdAt)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Last Updated</div>
                  <div>{formatDate(viewingInterface.updatedAt)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(viewingInterface.type)}
                    {viewingInterface.type.charAt(0).toUpperCase() + viewingInterface.type.slice(1)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Views</div>
                  <div>{viewingInterface.viewCount || 0}</div>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="font-medium mb-2">Fields</h3>
          <div className="mb-4">
            {(viewingInterface.fields || []).length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Required</th>
                  </tr>
                </thead>
                <tbody>
                  {(viewingInterface.fields || []).map(field => (
                    <tr key={field.id} className="border-b">
                      <td className="py-2">{field.label}</td>
                      <td className="py-2">{field.type}</td>
                      <td className="py-2">{field.required ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No fields defined</p>
            )}
          </div>
          
          <h3 className="font-medium mb-2">Integrations</h3>
          <div className="mb-4">
            {(viewingInterface.integrations || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(viewingInterface.integrations || []).map(integration => (
                  <Badge key={integration.id} variant="outline" className="px-3 py-1">
                    {integration.name} ({integration.type})
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No integrations connected</p>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div>
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => {
                  setEditingInterface(viewingInterface);
                  setViewingInterface(null);
                }}
              >
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline"
                onClick={() => duplicateInterface(viewingInterface)}
              >
                <Copy size={16} className="mr-1" />
                Duplicate
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="text-red-600"
              onClick={() => {
                confirmDelete(viewingInterface.id);
                setViewingInterface(null);
              }}
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterfaceDetailsDialog;
