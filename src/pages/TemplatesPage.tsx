
import React, { useState } from 'react';
import { TemplateCard } from "@/components/dashboard/TemplateCard";

// Extended mock template data
const allTemplates = [
  {
    id: 1,
    title: "Save Gmail attachments to Google Drive",
    description: "Automatically save any new Gmail attachments to Google Drive",
    apps: ["gmail", "drive"],
    isAIPowered: true,
    category: "popular"
  },
  {
    id: 2,
    title: "Post Slack messages for new Trello cards",
    description: "Send a message in Slack when new Trello cards are created",
    apps: ["slack", "trello"],
    isAIPowered: false,
    category: "trending"
  },
  {
    id: 3,
    title: "Save Tweets to Google Sheets",
    description: "Track tweets in a spreadsheet automatically",
    apps: ["twitter", "sheets"],
    isAIPowered: false,
    category: "popular"
  },
  {
    id: 4,
    title: "Create AI summaries from meeting transcripts",
    description: "Generate concise summaries from your meeting recordings",
    apps: ["zoom", "notion"],
    isAIPowered: true,
    category: "ai"
  },
  {
    id: 5,
    title: "Send personalized emails with AI",
    description: "Generate and send personalized emails based on customer data",
    apps: ["sheets", "gmail"],
    isAIPowered: true,
    category: "ai"
  },
  {
    id: 6,
    title: "Save new leads to CRM",
    description: "Automatically add new form submissions to your CRM",
    apps: ["forms", "salesforce"],
    isAIPowered: false,
    category: "business"
  },
  {
    id: 7,
    title: "Post Instagram photos to Twitter",
    description: "Share your Instagram posts automatically on Twitter",
    apps: ["instagram", "twitter"],
    isAIPowered: false,
    category: "social"
  },
  {
    id: 8,
    title: "Save Spotify songs to playlist",
    description: "Add liked songs to a dedicated Spotify playlist automatically",
    apps: ["spotify", "spotify"],
    isAIPowered: false,
    category: "personal"
  },
  {
    id: 9,
    title: "Add calendar events from emails",
    description: "Create calendar events automatically from email details",
    apps: ["gmail", "calendar"],
    isAIPowered: true,
    category: "productivity"
  },
  {
    id: 10,
    title: "Backup Dropbox files to Google Drive",
    description: "Automatically create backups of your Dropbox files",
    apps: ["dropbox", "drive"],
    isAIPowered: false,
    category: "backup"
  }
];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "popular", name: "Most Popular" },
    { id: "ai", name: "AI-Powered" },
    { id: "business", name: "Business" },
    { id: "productivity", name: "Productivity" },
    { id: "social", name: "Social Media" }
  ];
  
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || 
                           (categoryFilter === "ai" ? template.isAIPowered : template.category === categoryFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Template Gallery</h1>
        <p className="text-gray-600">
          Browse our collection of ready-made templates to get started quickly.
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <select
            className="px-4 py-2 border rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500">No templates found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
