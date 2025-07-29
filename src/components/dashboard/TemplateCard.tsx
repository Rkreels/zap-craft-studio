
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface Template {
  id: number;
  title: string;
  description: string;
  apps: string[];
  isAIPowered: boolean;
  category: string;
}

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  // Helper function to get app icons (in a real app, you would use actual icons)
  const getAppIcon = (app: string) => {
    return (
      <div className="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center text-xs uppercase font-bold">
        {app.substring(0, 1)}
      </div>
    );
  };

  const handleUseTemplate = () => {
    // Navigate to workflow creator with template pre-loaded
    window.location.href = `/zaps/create?template=${template.id}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      {/* App icons */}
      <div className="flex items-center gap-1 mb-3">
        {template.apps.map((app, index) => (
          <div key={index} className="flex-shrink-0">
            {getAppIcon(app)}
          </div>
        ))}
      </div>
      
      {/* Template content */}
      <h3 className="font-semibold mb-1">{template.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
      
      {/* AI badge if applicable */}
      <div className="flex justify-between items-end">
        {template.isAIPowered && (
          <Badge className="bg-purple-100 text-purple-600 border border-purple-200">
            <Sparkles className="w-3 h-3 mr-1" /> AI-powered
          </Badge>
        )}
        <button 
          onClick={handleUseTemplate}
          className="ml-auto bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          Use Template
        </button>
      </div>
    </div>
  );
}
