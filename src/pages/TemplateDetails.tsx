
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Sparkles, Copy, Share } from "lucide-react";

// Mock template data - in a real app this would come from an API
const templateDetails = {
  id: "1",
  title: "Save Gmail attachments to Google Drive",
  description: "Automatically save any new Gmail attachments to Google Drive in seconds. Never lose or misplace important files again. Set up once and let Zapier handle the rest.",
  apps: ["gmail", "drive"],
  isAIPowered: true,
  category: "popular",
  uses: 15284,
  rating: 4.8,
  reviews: 126,
  createdBy: "Zapier",
  steps: [
    {
      type: "trigger",
      app: "Gmail",
      name: "New Attachment",
      description: "Triggers when a new attachment is received in Gmail"
    },
    {
      type: "action",
      app: "Google Drive",
      name: "Upload File",
      description: "Uploads the attachment to your Google Drive account"
    }
  ],
  useCases: [
    "Save important business documents automatically",
    "Archive email receipts to your finance folder",
    "Back up project files from clients",
    "Create a central repository for team attachments"
  ]
};

// Helper function to render app icons
const getAppIcon = (app: string) => {
  return (
    <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-sm uppercase font-bold">
      {app === "gmail" ? "G" : app === "drive" ? "D" : app.substring(0, 1)}
    </div>
  );
};

export default function TemplateDetails() {
  const { id } = useParams<{id: string}>();
  // In a real app, we would fetch the template data based on the ID
  const template = templateDetails;
  
  return (
    <div className="max-w-5xl mx-auto">
      {/* Back button */}
      <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to templates
      </Link>
      
      {/* Template header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {template.apps.map((app, index) => (
                  <div key={app} className={index > 0 ? "-ml-2" : ""}>
                    {getAppIcon(app)}
                  </div>
                ))}
              </div>
              {template.isAIPowered && (
                <Badge className="bg-purple-100 text-purple-600 border border-purple-200">
                  <Sparkles className="w-3 h-3 mr-1" /> AI-powered
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold">{template.title}</h1>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <span className="flex items-center">
                <Star size={16} className="text-primary mr-1 fill-current" />
                {template.rating}
              </span>
              <span className="mx-2">•</span>
              <span>{template.reviews} reviews</span>
              <span className="mx-2">•</span>
              <span>{template.uses.toLocaleString()} users</span>
              <span className="mx-2">•</span>
              <span>By {template.createdBy}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Copy size={16} />
              Clone
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share size={16} />
              Share
            </Button>
            <Link to="/zaps/create">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                Use this Zap
              </Button>
            </Link>
          </div>
        </div>
        
        <p className="text-gray-700">{template.description}</p>
      </div>
      
      {/* Workflow visualization */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">How this Zap works</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {template.steps.map((step, index) => (
            <div key={index} className="flex-1 border border-gray-200 rounded-lg p-4">
              <Badge className={step.type === "trigger" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
                {step.type === "trigger" ? "Trigger" : "Action"}
              </Badge>
              <div className="mt-3 flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getAppIcon(step.app.toLowerCase())}
                </div>
                <div>
                  <p className="font-medium">{step.app}</p>
                  <p className="text-sm text-gray-700">{step.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
              </div>
              
              {index < template.steps.length - 1 && (
                <div className="hidden md:flex items-center absolute right-[-20px] top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-0.5 bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full border-2 border-gray-300"></div>
                  <div className="w-6 h-0.5 bg-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Use cases */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Popular use cases</h2>
        <ul className="space-y-2">
          {template.useCases.map((useCase, index) => (
            <li key={index} className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2">
                <span className="text-sm">✓</span>
              </div>
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-6 text-center">
          <Link to="/zaps/create">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Use this Zap
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
