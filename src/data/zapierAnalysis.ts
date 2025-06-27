
export const zapierMissingFeatures = {
  core: [
    "Multi-step workflows with unlimited steps",
    "Advanced conditional logic with multiple conditions",
    "Data transformation and mapping tools",
    "Error handling and retry mechanisms",
    "Webhook creation and management",
    "Schedule-based triggers",
    "Advanced filtering options",
    "Custom code execution (JavaScript/Python)",
    "Bulk operations and batch processing",
    "Data storage (StoreBot equivalent)",
    "Advanced authentication methods",
    "Team collaboration features",
    "Workflow versioning and rollback",
    "Advanced monitoring and analytics",
    "Custom app integrations",
    "Path branching and conditional routing",
    "Real-time execution monitoring",
    "Advanced data parsing (JSON, XML, CSV)",
    "Email parser functionality",
    "SMS and phone integrations"
  ],
  advanced: [
    "Sub-workflows and nested automations",
    "Advanced scheduling (cron expressions)",
    "Workflow templates marketplace",
    "Advanced team permissions and roles",
    "Audit logs and compliance features",
    "Advanced webhook security and authentication",
    "Multi-region deployment options",
    "API rate limiting and throttling",
    "Advanced error recovery strategies",
    "Workflow performance optimization",
    "Custom field mapping and transformations",
    "Advanced integration testing tools",
    "Workflow analytics and insights",
    "Custom connector development platform",
    "Advanced data validation and cleansing"
  ],
  integrations: [
    "5000+ app integrations",
    "Advanced API connection management",
    "OAuth 2.0 and OAuth 1.0a flow handling",
    "Custom API integration builder",
    "Webhook URL generation and management",
    "Real-time data synchronization",
    "Batch data processing capabilities",
    "Advanced authentication handling (API keys, tokens)",
    "API versioning support",
    "Custom connector development tools",
    "Enterprise SSO integration",
    "Advanced security protocols",
    "Data encryption in transit and at rest",
    "Compliance certifications (SOC 2, GDPR)",
    "Advanced monitoring and alerting"
  ],
  enterprise: [
    "Advanced user management and roles",
    "Single Sign-On (SSO) integration",
    "Advanced security and compliance",
    "Dedicated support and SLA",
    "Custom branding and white-labeling",
    "Advanced analytics and reporting",
    "Priority execution queues",
    "Advanced backup and disaster recovery",
    "Custom deployment options",
    "Advanced API management"
  ]
};

export const implementationPriority = {
  phase1: [
    "Enhanced workflow builder with unlimited steps",
    "Advanced conditional logic and path branching",
    "Comprehensive data transformation tools",
    "Real-time execution monitoring",
    "Advanced error handling and retry mechanisms"
  ],
  phase2: [
    "Custom code execution environment",
    "Advanced webhook management",
    "Schedule-based triggers and cron jobs",
    "Data storage and state management",
    "Team collaboration features"
  ],
  phase3: [
    "Advanced integration marketplace",
    "Custom app connector builder",
    "Enterprise security and compliance",
    "Advanced analytics and insights",
    "Multi-region deployment"
  ],
  phase4: [
    "AI-powered workflow suggestions",
    "Advanced template marketplace",
    "Custom branding and white-labeling",
    "Advanced API management platform",
    "Enterprise-grade monitoring and alerting"
  ]
};

export const zapierFeatureComparison = {
  "Workflow Builder": {
    zapier: "Visual drag-and-drop with unlimited steps",
    current: "Basic multi-step builder",
    status: "partial",
    priority: "high"
  },
  "Conditional Logic": {
    zapier: "Advanced IF/THEN with multiple conditions",
    current: "Basic filtering",
    status: "limited",
    priority: "high"
  },
  "Data Transformation": {
    zapier: "Advanced formatters and transformations",
    current: "Basic field mapping",
    status: "partial",
    priority: "medium"
  },
  "Error Handling": {
    zapier: "Sophisticated retry logic and fallbacks",
    current: "Basic error catching",
    status: "limited",
    priority: "high"
  },
  "Integrations": {
    zapier: "5000+ native integrations",
    current: "Limited app connections",
    status: "minimal",
    priority: "critical"
  },
  "Webhooks": {
    zapier: "Advanced webhook creation and management",
    current: "Basic webhook support",
    status: "partial",
    priority: "medium"
  },
  "Scheduling": {
    zapier: "Flexible scheduling with cron support",
    current: "Basic time triggers",
    status: "limited",
    priority: "medium"
  },
  "Team Features": {
    zapier: "Advanced collaboration and permissions",
    current: "Single user focused",
    status: "missing",
    priority: "medium"
  },
  "Analytics": {
    zapier: "Comprehensive usage analytics",
    current: "Basic execution logs",
    status: "limited",
    priority: "low"
  },
  "Custom Code": {
    zapier: "JavaScript and Python execution",
    current: "No custom code support",
    status: "missing",
    priority: "high"
  }
};
