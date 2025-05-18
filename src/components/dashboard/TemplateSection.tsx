
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "./TemplateCard";

// Mock template data
const templates = [
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
  }
];

export function TemplateSection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filters = [
    { id: "ai", label: "AI Workflows" },
    { id: "popular", label: "Most popular" },
    { id: "trending", label: "Trending this week" },
  ];
  
  // Filter templates based on activeFilter
  const filteredTemplates = activeFilter === "all" 
    ? templates 
    : templates.filter(template => 
        activeFilter === "ai" 
          ? template.isAIPowered 
          : template.category === activeFilter
      );

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <h2 className="text-2xl font-bold mb-2 md:mb-0">Popular templates</h2>
        
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <Button
              key={filter.id}
              variant="outline"
              className={`rounded-full ${activeFilter === filter.id ? 'bg-gray-100 border-gray-300' : ''}`}
              onClick={() => setActiveFilter(filter.id === activeFilter ? "all" : filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Link to="/templates">
          <Button variant="link" className="text-purple-600">
            Browse all templates
          </Button>
        </Link>
      </div>
    </div>
  );
}
