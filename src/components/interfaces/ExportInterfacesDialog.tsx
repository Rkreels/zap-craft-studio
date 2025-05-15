
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { transformForExport } from "@/utils/dataTransformationUtils";
import { InterfaceItem } from "@/types/interfaces";

interface ExportInterfacesDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  interfaces: InterfaceItem[];
}

const ExportInterfacesDialog: React.FC<ExportInterfacesDialogProps> = ({
  isOpen,
  setIsOpen,
  interfaces
}) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [includeFields, setIncludeFields] = useState(true);
  const [includeIntegrations, setIncludeIntegrations] = useState(true);
  
  // Voice guidance for export dialog
  const dialogVoiceProps = {
    elementName: "Export Interfaces Dialog",
    hoverText: "Dialog for exporting interfaces in different formats.",
    clickText: "This dialog lets you export your interfaces in JSON or CSV format."
  };
  const dialogGuidance = useVoiceGuidance(dialogVoiceProps);

  // Voice guidance for export button
  const exportVoiceProps = {
    elementName: "Export Button",
    hoverText: "Export interfaces in the selected format.",
    clickText: `Exporting interfaces in ${exportFormat} format.`
  };
  const exportGuidance = useVoiceGuidance(exportVoiceProps);

  const handleExport = () => {
    try {
      // Get the export data using the utility function
      const exportData = transformForExport(interfaces, exportFormat);
      
      // Create blob for download
      const blob = new Blob(
        [exportData], 
        { type: exportFormat === 'json' ? 'application/json' : 'text/csv' }
      );
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `interfaces-export.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `Interfaces exported as ${exportFormat.toUpperCase()} file.`
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your interfaces.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" onMouseEnter={dialogGuidance.handleMouseEnter}>
        <DialogHeader>
          <DialogTitle>Export Interfaces</DialogTitle>
          <DialogDescription>
            Export your interfaces in different formats for use in other applications.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Export Format</h3>
            <RadioGroup 
              defaultValue={exportFormat} 
              onValueChange={(value) => setExportFormat(value as 'json' | 'csv')}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center cursor-pointer">
                  <FileJson size={16} className="mr-2" />
                  JSON
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center cursor-pointer">
                  <FileSpreadsheet size={16} className="mr-2" />
                  CSV
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Include Details</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-fields" 
                  checked={includeFields}
                  onCheckedChange={(checked) => setIncludeFields(checked as boolean)}
                />
                <Label htmlFor="include-fields" className="cursor-pointer">Include fields</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-integrations" 
                  checked={includeIntegrations}
                  onCheckedChange={(checked) => setIncludeIntegrations(checked as boolean)}
                />
                <Label htmlFor="include-integrations" className="cursor-pointer">Include integrations</Label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              exportGuidance.handleClick();
              handleExport();
            }}
            onMouseEnter={exportGuidance.handleMouseEnter}
            className="flex items-center"
          >
            <Download size={16} className="mr-1" />
            Export {interfaces.length} {interfaces.length === 1 ? 'interface' : 'interfaces'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportInterfacesDialog;
