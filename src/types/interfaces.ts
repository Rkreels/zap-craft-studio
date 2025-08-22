
// Type definitions for interfaces data
export interface InterfaceItem {
  id: string;
  name: string;
  type: "form" | "page" | "dashboard";
  description?: string;
  preview: string; 
  createdAt: string;
  updatedAt: string;
  status: "published" | "draft";
  templateJson?: string;
  fields?: InterfaceField[];
  integrations?: InterfaceIntegration[];
  logic?: InterfaceLogic[];
  collaborators?: string[];
  viewCount?: number;
}

export interface InterfaceField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  description?: string;
}

export interface InterfaceIntegration {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface InterfaceLogic {
  id: string;
  name: string;
  type: "action" | "trigger" | "condition" | string; // Added string for backward compatibility
  config: Record<string, any>;
}
