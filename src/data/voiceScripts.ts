// Dashboard components
export const dashboardScripts = {
  featureCard: {
    hover: "This card represents a key feature of the platform. Click to explore.",
    click: (title: string) => `You've selected the ${title} feature. This tool helps you automate workflows and integrate your applications.`
  },
  getStartedCard: {
    hover: "This section helps you get started with creating your first automation.",
    click: "Getting started with Zapier is easy. This section guides you through creating your first Zap to connect your apps and automate workflows."
  },
  templateSection: {
    hover: "Browse pre-built workflow templates to quickly set up common automations.",
    click: "Templates are pre-configured workflows that you can use as a starting point. They save you time by providing ready-made solutions for common automation needs."
  }
};

// Zap Creator components
export const zapCreatorScripts = {
  zapHeader: {
    hover: "This is the Zap header where you can manage your workflow settings.",
    click: "The Zap header allows you to name your workflow, save changes, test your integration, and toggle activation status."
  },
  appSelector: {
    hover: "Choose an application to connect to your workflow.",
    click: "Select an app to integrate with your workflow. These are the applications that will exchange data in your automation."
  },
  eventSelector: {
    hover: "Select a specific trigger or action event for your chosen app.",
    click: "Choose the specific event that will trigger your workflow or define an action to take. Different apps offer various triggers and actions."
  },
  workflowBuilder: {
    hover: "This is where you build and visualize your automated workflow.",
    click: "The workflow builder helps you design your automation step by step. Connect triggers to actions to create a seamless workflow between your applications."
  }
};

// Tables page components
export const tablesScripts = {
  tableHeader: {
    hover: "This is the table header where you manage your database tables.",
    click: "The table header allows you to create, filter, and manage your data tables. Use it to organize and process your information."
  },
  tableList: {
    hover: "Browse and manage your existing tables.",
    click: "This list shows all your data tables. Click on a table to view or edit its contents, or create a new table to store additional data."
  },
  tableActions: {
    hover: "Actions you can perform on this table.",
    click: "These controls let you edit, delete, duplicate, or share your table. Be careful with delete operations as they cannot be undone."
  },
  recordForm: {
    hover: "Form for creating or editing table records.",
    click: "Fill out this form to add new data or update existing records in your table. Make sure to provide values for all required fields."
  }
};

// Interfaces page components
export const interfacesScripts = {
  interfaceEditor: {
    hover: "Design custom interfaces for your automation.",
    click: "The interface editor lets you create custom forms, landing pages, and dashboards. Drag and drop elements to build your interface without writing code."
  },
  componentPalette: {
    hover: "Browse available interface components.",
    click: "This palette contains all the elements you can add to your interface. Click on a component to add it to your design, then customize its properties."
  },
  previewMode: {
    hover: "Preview how your interface will appear to users.",
    click: "Use preview mode to test your interface before publishing it. You can interact with it just as your users would."
  },
  publishControls: {
    hover: "Controls for publishing your interface.",
    click: "When your interface is ready, use these controls to publish it. You can make it available publicly or restrict access to specific users."
  }
};

// Chatbot page components
export const chatbotScripts = {
  chatbotBuilder: {
    hover: "Create automated conversational interfaces.",
    click: "The chatbot builder lets you design AI-powered conversation flows. Define how your chatbot responds to user inputs and questions."
  },
  intentEditor: {
    hover: "Define what your chatbot should understand.",
    click: "Use the intent editor to teach your chatbot how to recognize user questions and requests. Add example phrases to improve its understanding."
  },
  responseEditor: {
    hover: "Configure how your chatbot responds.",
    click: "Design your chatbot's responses here. You can use text, images, buttons, or even dynamic data from your zaps and tables."
  },
  testConsole: {
    hover: "Test your chatbot's functionality.",
    click: "Use this console to simulate conversations with your chatbot. This helps you identify and fix any issues before deployment."
  }
};

// History page components
export const historyScripts = {
  taskList: {
    hover: "View the execution history of your automations.",
    click: "This list shows all past executions of your Zaps. Use it to monitor performance and troubleshoot issues."
  },
  taskDetails: {
    hover: "See detailed information about a specific task execution.",
    click: "These details show exactly what happened during a task execution, including any data that was processed and any errors that occurred."
  },
  filterControls: {
    hover: "Filter your task history.",
    click: "Use these controls to filter your task history by status, date range, or Zap name. This helps you find specific executions quickly."
  }
};

// General UI components
export const uiComponentScripts = {
  button: {
    hover: "This is an interactive button that performs an action when clicked.",
    click: (label: string) => `You've activated the ${label} function. This will process your request.`
  },
  input: {
    hover: "This is a text field where you can enter information.",
    click: "Type your information in this text field. Make sure to provide accurate details for best results."
  },
  dropdown: {
    hover: "Click to see a list of options you can select from.",
    click: "This dropdown menu contains various options to choose from. Click on an option to select it."
  },
  toggle: {
    hover: "This is a switch that turns a feature on or off.",
    click: (state: string) => `You've turned this feature ${state}. You can change it back at any time.`
  }
};

// Navigation components
export const navigationScripts = {
  sidebar: {
    hover: "This sidebar contains navigation links to different sections of the platform.",
    click: "The sidebar helps you navigate between different features and tools available in the platform."
  },
  menuItem: {
    hover: (name: string) => `This is the ${name} section of the platform.`,
    click: (name: string) => `You're navigating to the ${name} section where you can manage related tasks and settings.`
  }
};

// Voice training scripts
export const voiceTrainingScripts = [
  {
    phrase: "Open the dashboard and show recent activity",
    description: "Navigate to dashboard view"
  },
  {
    phrase: "Create a new workflow automation",
    description: "Start workflow creation process"
  },
  {
    phrase: "Search for email integration templates",
    description: "Search for specific templates"
  },
  {
    phrase: "Show me analytics for the past month",
    description: "Display analytics data"
  },
  {
    phrase: "Connect my Google account",
    description: "Initiate external account connection"
  }
];
