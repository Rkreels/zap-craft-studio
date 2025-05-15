
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InterfaceViewSwitcherProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const InterfaceViewSwitcher: React.FC<InterfaceViewSwitcherProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="gallery">Gallery View</TabsTrigger>
        <TabsTrigger value="table">Table View</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default InterfaceViewSwitcher;
