
import React from "react";
import { FileText, Layout, List } from "lucide-react";

// Get icon component based on interface type
export const getTypeIcon = (type: string) => {
  switch(type) {
    case "form": return <FileText size={16} />;
    case "page": return <Layout size={16} />;
    case "dashboard": return <List size={16} />;
    default: return <FileText size={16} />;
  }
};
