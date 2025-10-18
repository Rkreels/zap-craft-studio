import React, { createContext, useContext, useState, ReactNode } from 'react';

// Centralized in-memory state management (no localStorage)
interface AppState {
  workflows: any[];
  templates: any[];
  tables: any[];
  interfaces: any[];
  integrations: any[];
  chatbots: any[];
  sessions: any[];
  canvasProjects: any[];
  sidebarExpanded: boolean;
  settings: any;
}

interface AppStateContextType {
  state: AppState;
  updateWorkflows: (workflows: any[]) => void;
  updateTemplates: (templates: any[]) => void;
  updateTables: (tables: any[]) => void;
  updateInterfaces: (interfaces: any[]) => void;
  updateIntegrations: (integrations: any[]) => void;
  updateChatbots: (chatbots: any[]) => void;
  updateSessions: (sessions: any[]) => void;
  updateCanvasProjects: (projects: any[]) => void;
  updateSidebarExpanded: (expanded: boolean) => void;
  updateSettings: (settings: any) => void;
  resetState: () => void;
}

const initialState: AppState = {
  workflows: [],
  templates: [],
  tables: [],
  interfaces: [],
  integrations: [],
  chatbots: [],
  sessions: [],
  canvasProjects: [],
  sidebarExpanded: true,
  settings: {
    workspace: {
      workspaceName: 'My Workspace',
      timezone: 'UTC',
      language: 'en',
    },
    notifications: {
      emailNotifications: true,
      zapFailures: true,
      weeklyReport: false,
    },
    account: {
      email: 'user@example.com',
      name: 'John Doe',
      plan: 'Free',
    },
  },
};

const AppStateContext = createContext<AppStateContextType | null>(null);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const updateWorkflows = (workflows: any[]) => {
    setState(prev => ({ ...prev, workflows }));
  };

  const updateTemplates = (templates: any[]) => {
    setState(prev => ({ ...prev, templates }));
  };

  const updateTables = (tables: any[]) => {
    setState(prev => ({ ...prev, tables }));
  };

  const updateInterfaces = (interfaces: any[]) => {
    setState(prev => ({ ...prev, interfaces }));
  };

  const updateIntegrations = (integrations: any[]) => {
    setState(prev => ({ ...prev, integrations }));
  };

  const updateChatbots = (chatbots: any[]) => {
    setState(prev => ({ ...prev, chatbots }));
  };

  const updateSessions = (sessions: any[]) => {
    setState(prev => ({ ...prev, sessions }));
  };

  const updateCanvasProjects = (projects: any[]) => {
    setState(prev => ({ ...prev, canvasProjects: projects }));
  };

  const updateSidebarExpanded = (expanded: boolean) => {
    setState(prev => ({ ...prev, sidebarExpanded: expanded }));
  };

  const updateSettings = (settings: any) => {
    setState(prev => ({ ...prev, settings }));
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <AppStateContext.Provider
      value={{
        state,
        updateWorkflows,
        updateTemplates,
        updateTables,
        updateInterfaces,
        updateIntegrations,
        updateChatbots,
        updateSessions,
        updateCanvasProjects,
        updateSidebarExpanded,
        updateSettings,
        resetState,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
