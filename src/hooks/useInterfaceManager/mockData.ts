
// Mock placeholder image URLs
export const formPreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Form+Interface";
export const pagePreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Page+Interface";
export const dashboardPreview = "https://placehold.co/600x400/e2e8f0/64748b?text=Dashboard+Interface";

// Initial mock data for interfaces
export const initialInterfaces = [
  {
    id: "interface-1",
    name: "Customer Registration Form",
    type: "form" as const,
    description: "A comprehensive registration form for new customers to fill out their details",
    preview: formPreview,
    createdAt: "2025-05-03T10:20:00Z",
    updatedAt: "2025-05-10T14:30:00Z",
    status: "published" as const,
    fields: [
      { id: "field-1", name: "fullName", type: "text", required: true, label: "Full Name" },
      { id: "field-2", name: "email", type: "email", required: true, label: "Email Address" },
      { id: "field-3", name: "phone", type: "tel", required: false, label: "Phone Number" }
    ],
    integrations: [
      { id: "int-1", name: "Email Notification", type: "email", enabled: true, config: { recipient: "support@example.com" } }
    ],
    viewCount: 237
  },
  {
    id: "interface-2",
    name: "Analytics Dashboard",
    type: "dashboard" as const,
    description: "Interactive dashboard displaying key performance metrics and analytics data",
    preview: dashboardPreview,
    createdAt: "2025-05-05T11:45:00Z",
    updatedAt: "2025-05-12T09:15:00Z",
    status: "published" as const,
    integrations: [
      { id: "int-2", name: "Data Source", type: "api", enabled: true, config: { endpoint: "https://api.example.com/metrics" } }
    ],
    logic: [
      { id: "logic-1", name: "Refresh Data", type: "trigger", config: { interval: 30 } }
    ],
    viewCount: 486
  },
  {
    id: "interface-3",
    name: "Product Catalog",
    type: "page" as const,
    description: "Product listing page with filtering and sorting capabilities",
    preview: pagePreview,
    createdAt: "2025-05-08T16:30:00Z",
    updatedAt: "2025-05-08T16:30:00Z",
    status: "draft" as const,
    integrations: [
      { id: "int-3", name: "Product Database", type: "database", enabled: true, config: { source: "products" } }
    ],
    viewCount: 0
  }
];
