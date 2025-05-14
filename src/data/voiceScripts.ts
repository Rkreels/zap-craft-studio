
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
