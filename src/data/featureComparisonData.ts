
// Data for feature comparison between this app and Zapier

export interface FeatureStatus {
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  zapierEquivalent?: string;
}

export const interfaceFeatures: FeatureStatus[] = [
  {
    name: "Interface Builder",
    description: "Visual editor for creating forms, pages, and dashboards",
    status: "completed",
    zapierEquivalent: "Zap Editor"
  },
  {
    name: "Templates",
    description: "Pre-built interface templates for common use cases",
    status: "in-progress",
    zapierEquivalent: "Zap Templates"
  },
  {
    name: "Data Transformation",
    description: "Tools for formatting and transforming data",
    status: "completed",
    zapierEquivalent: "Formatters & Transformers"
  },
  {
    name: "Version History",
    description: "Track changes and restore previous versions",
    status: "completed",
    zapierEquivalent: "Version History"
  },
  {
    name: "Workflow Builder",
    description: "Create automated workflows between interfaces",
    status: "in-progress",
    zapierEquivalent: "Zap Workflows"
  },
  {
    name: "API Integrations",
    description: "Connect with third-party APIs",
    status: "in-progress",
    zapierEquivalent: "App Integrations"
  },
  {
    name: "User Permissions",
    description: "Manage access levels for team members",
    status: "planned",
    zapierEquivalent: "Team Permissions"
  },
  {
    name: "Testing Tools",
    description: "Test and debug interfaces",
    status: "planned",
    zapierEquivalent: "Testing & Monitoring"
  },
  {
    name: "Analytics",
    description: "Track interface usage and performance",
    status: "planned",
    zapierEquivalent: "Zapier Analytics"
  },
  {
    name: "Scheduled Triggers",
    description: "Run interfaces on a schedule",
    status: "planned",
    zapierEquivalent: "Schedule Triggers"
  }
];
