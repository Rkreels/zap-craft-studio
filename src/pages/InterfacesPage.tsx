
import React from "react";
import { InterfacesContent } from "@/components/interfaces/InterfacesContent";
import { InterfaceHeader } from "@/components/interfaces/InterfaceHeader";
import { InterfaceVoiceCommands } from "@/components/interfaces/InterfaceVoiceCommands";

const InterfacesPage = () => {
  return (
    <>
      <InterfaceVoiceCommands />
      <div className="container mx-auto py-6 space-y-6">
        <InterfaceHeader />
        <InterfacesContent />
      </div>
    </>
  );
};

export default InterfacesPage;
