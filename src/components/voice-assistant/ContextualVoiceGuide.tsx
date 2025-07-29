import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEnhancedVoiceAssistant } from "@/contexts/EnhancedVoiceAssistantContext";
import { toast } from "@/hooks/use-toast";

// Context-specific command definitions
const contextCommands = {
  dashboard: [
    {
      command: "create workflow",
      description: "Start creating a new automation workflow",
      action: "/zaps/create",
      responseText: "Opening workflow creator.",
      aliases: ["new workflow", "add automation", "create zap"]
    },
    {
      command: "view interfaces",
      description: "Navigate to interface management",
      action: "/interfaces",
      responseText: "Navigating to interfaces page.",
      aliases: ["show interfaces", "open interfaces", "go to interfaces"]
    },
    {
      command: "manage tables",
      description: "Open table management",
      action: "/tables",
      responseText: "Opening table management.",
      aliases: ["view tables", "show tables", "open tables"]
    },
    {
      command: "open chatbot",
      description: "Navigate to chatbot builder",
      action: "/chatbot",
      responseText: "Opening chatbot builder.",
      aliases: ["create chatbot", "chatbot builder"]
    }
  ],
  interfaces: [
    {
      command: "create interface",
      description: "Start creating a new interface",
      action: "create",
      responseText: "Starting interface creation.",
      aliases: ["new interface", "add interface"]
    },
    {
      command: "gallery view",
      description: "Switch to gallery view",
      action: "view:gallery",
      responseText: "Switching to gallery view.",
      aliases: ["show gallery", "grid view"]
    },
    {
      command: "table view",
      description: "Switch to table view",
      action: "view:table",
      responseText: "Switching to table view.",
      aliases: ["show table", "list view"]
    }
  ],
  workflow: [
    {
      command: "add trigger",
      description: "Add a trigger step to workflow",
      action: "add:trigger",
      responseText: "Adding trigger step.",
      aliases: ["create trigger", "new trigger"]
    },
    {
      command: "add action",
      description: "Add an action step to workflow",
      action: "add:action",
      responseText: "Adding action step.",
      aliases: ["create action", "new action"]
    },
    {
      command: "save workflow",
      description: "Save the current workflow",
      action: "save",
      responseText: "Saving workflow.",
      aliases: ["save automation", "save zap"]
    },
    {
      command: "test workflow",
      description: "Test the current workflow",
      action: "test",
      responseText: "Testing workflow.",
      aliases: ["test automation", "run test"]
    }
  ],
  chatbot: [
    {
      command: "add intent",
      description: "Add a new chatbot intent",
      action: "add:intent",
      responseText: "Adding new intent.",
      aliases: ["create intent", "new intent"]
    },
    {
      command: "test chatbot",
      description: "Test the chatbot functionality",
      action: "test",
      responseText: "Starting chatbot test.",
      aliases: ["test bot", "try chatbot"]
    }
  ],
  tables: [
    {
      command: "create table",
      description: "Create a new data table",
      action: "create",
      responseText: "Creating new table.",
      aliases: ["new table", "add table"]
    },
    {
      command: "add record",
      description: "Add a new record to the table",
      action: "add:record",
      responseText: "Adding new record.",
      aliases: ["new record", "create record"]
    }
  ]
};

interface ContextualVoiceGuideProps {
  onActionTrigger?: (action: string) => void;
}

export const ContextualVoiceGuide: React.FC<ContextualVoiceGuideProps> = ({ onActionTrigger }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isEnabled,
    setCurrentContext,
    registerCommand,
    unregisterCommand,
    speakText,
    isTraining,
    lastCommand
  } = useEnhancedVoiceAssistant();

  const [currentPageContext, setCurrentPageContext] = useState<string>("dashboard");
  const [isInitialized, setIsInitialized] = useState(false);

  // Determine context from current route
  const getContextFromPath = useCallback((pathname: string): string => {
    if (pathname.includes("/interfaces")) return "interfaces";
    if (pathname.includes("/zaps") || pathname.includes("/workflow")) return "workflow";
    if (pathname.includes("/chatbot")) return "chatbot";
    if (pathname.includes("/tables")) return "tables";
    if (pathname.includes("/canvas")) return "canvas";
    return "dashboard";
  }, []);

  // Register commands for current context
  const registerContextCommands = useCallback((context: string) => {
    const commands = contextCommands[context as keyof typeof contextCommands] || [];
    
    commands.forEach(cmd => {
      const enhancedCommand = {
        command: cmd.command,
        description: cmd.description,
        aliases: cmd.aliases,
        contextTags: [context],
        priority: 2,
        responseText: cmd.responseText,
        action: () => {
          // Stop any current training when executing commands
          if (isTraining) {
            speakText("Stopping current training to execute command.", true);
          }
          
          if (cmd.action.startsWith("/")) {
            navigate(cmd.action);
          } else {
            onActionTrigger?.(cmd.action);
          }
        }
      };
      
      registerCommand(enhancedCommand);
    });
  }, [registerCommand, navigate, onActionTrigger, isTraining, speakText]);

  // Unregister commands for previous context
  const unregisterContextCommands = useCallback((context: string) => {
    const commands = contextCommands[context as keyof typeof contextCommands] || [];
    commands.forEach(cmd => {
      unregisterCommand(cmd.command);
    });
  }, [unregisterCommand]);

  // Handle context changes
  useEffect(() => {
    const newContext = getContextFromPath(location.pathname);
    
    if (newContext !== currentPageContext) {
      // Unregister old commands
      if (isInitialized) {
        unregisterContextCommands(currentPageContext);
      }
      
      // Register new commands
      registerContextCommands(newContext);
      
      // Update context immediately
      setCurrentPageContext(newContext);
      setCurrentContext(newContext);
      
      // Announce context change if voice assistant is enabled
      if (isEnabled && isInitialized) {
        const contextName = newContext.charAt(0).toUpperCase() + newContext.slice(1);
        setTimeout(() => {
          speakText(`Switched to ${contextName} context. New voice commands are now available.`, true);
        }, 100);
      }
      
      setIsInitialized(true);
    }
  }, [
    location.pathname,
    currentPageContext,
    getContextFromPath,
    registerContextCommands,
    unregisterContextCommands,
    setCurrentContext,
    isEnabled,
    speakText,
    isInitialized
  ]);

  // Auto-register global navigation commands
  useEffect(() => {
    if (!isEnabled) return;

    const globalNavigationCommands = [
      {
        command: "go to dashboard",
        description: "Navigate to the main dashboard",
        aliases: ["home", "main page", "dashboard"],
        action: () => navigate("/"),
        responseText: "Navigating to dashboard.",
        priority: 1
      },
      {
        command: "open help",
        description: "Get help with voice commands",
        aliases: ["help", "voice help", "commands"],
        action: () => {
          const commands = contextCommands[currentPageContext as keyof typeof contextCommands] || [];
          const commandList = commands.map(cmd => cmd.command).join(", ");
          speakText(`Available commands: ${commandList}`);
        },
        responseText: "Here are the available voice commands.",
        priority: 1
      },
      {
        command: "start voice training",
        description: "Begin voice training session",
        aliases: ["train voice", "improve recognition", "voice practice"],
        action: () => navigate("/voice-training-enhanced"),
        responseText: "Starting voice training session.",
        priority: 1
      }
    ];

    globalNavigationCommands.forEach(cmd => {
      registerCommand(cmd);
    });

    return () => {
      globalNavigationCommands.forEach(cmd => {
        unregisterCommand(cmd.command);
      });
    };
  }, [isEnabled, registerCommand, unregisterCommand, navigate, currentPageContext, speakText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentPageContext) {
        unregisterContextCommands(currentPageContext);
      }
    };
  }, [currentPageContext, unregisterContextCommands]);

  // This component doesn't render anything visible
  return null;
};

export default ContextualVoiceGuide;