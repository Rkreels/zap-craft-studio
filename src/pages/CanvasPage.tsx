import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PenTool, Plus, Search, Edit, Trash2, Copy, Download, Share2, Layers, Layout } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface CanvasProject {
  id: string;
  name: string;
  description: string;
  type: "flowchart" | "diagram" | "mindmap" | "bpmn";
  elements: number;
  collaborators: number;
  lastModified: string;
  thumbnail: string;
}

export default function CanvasPage() {
  const [projects, setProjects] = useState<CanvasProject[]>([
    { id: "1", name: "Customer Onboarding Flow", description: "End-to-end customer onboarding process", type: "flowchart", elements: 12, collaborators: 3, lastModified: "2026-02-17T10:30:00Z", thumbnail: "🔄" },
    { id: "2", name: "System Architecture", description: "Complete system architecture diagram", type: "diagram", elements: 24, collaborators: 5, lastModified: "2026-02-16T14:20:00Z", thumbnail: "🏗️" },
    { id: "3", name: "Project Planning", description: "Project tasks and dependencies mindmap", type: "mindmap", elements: 18, collaborators: 2, lastModified: "2026-02-15T09:15:00Z", thumbnail: "🧠" },
    { id: "4", name: "Sales Pipeline Process", description: "Lead to customer conversion flow", type: "bpmn", elements: 15, collaborators: 4, lastModified: "2026-02-14T11:00:00Z", thumbnail: "💰" },
    { id: "5", name: "CI/CD Pipeline", description: "Continuous integration deployment flow", type: "flowchart", elements: 20, collaborators: 6, lastModified: "2026-02-13T16:45:00Z", thumbnail: "🚀" },
    { id: "6", name: "User Journey Map", description: "Complete user experience journey", type: "flowchart", elements: 28, collaborators: 3, lastModified: "2026-02-12T08:30:00Z", thumbnail: "🗺️" },
    { id: "7", name: "Database Schema", description: "Entity relationship diagram", type: "diagram", elements: 35, collaborators: 2, lastModified: "2026-02-11T13:00:00Z", thumbnail: "🗄️" },
    { id: "8", name: "Marketing Funnel", description: "Awareness to conversion funnel", type: "flowchart", elements: 10, collaborators: 3, lastModified: "2026-02-10T15:20:00Z", thumbnail: "📊" },
    { id: "9", name: "API Architecture", description: "REST API endpoint structure", type: "diagram", elements: 22, collaborators: 4, lastModified: "2026-02-09T10:00:00Z", thumbnail: "🔗" },
    { id: "10", name: "Sprint Retrospective", description: "Team retrospective mindmap", type: "mindmap", elements: 14, collaborators: 8, lastModified: "2026-02-08T14:30:00Z", thumbnail: "💭" },
    { id: "11", name: "Incident Response Plan", description: "Emergency response workflow", type: "bpmn", elements: 16, collaborators: 5, lastModified: "2026-02-07T09:00:00Z", thumbnail: "🚨" },
    { id: "12", name: "Data Pipeline", description: "ETL data processing flow", type: "flowchart", elements: 19, collaborators: 3, lastModified: "2026-02-06T11:45:00Z", thumbnail: "📦" },
    { id: "13", name: "Product Roadmap", description: "Feature planning mindmap", type: "mindmap", elements: 32, collaborators: 6, lastModified: "2026-02-05T16:00:00Z", thumbnail: "🎯" },
    { id: "14", name: "Support Escalation", description: "Ticket escalation workflow", type: "bpmn", elements: 11, collaborators: 4, lastModified: "2026-02-04T08:15:00Z", thumbnail: "📞" },
    { id: "15", name: "Microservices Map", description: "Service communication diagram", type: "diagram", elements: 27, collaborators: 5, lastModified: "2026-02-03T13:30:00Z", thumbnail: "🔧" },
    { id: "16", name: "Employee Onboarding", description: "New hire onboarding checklist flow", type: "flowchart", elements: 13, collaborators: 2, lastModified: "2026-02-02T10:00:00Z", thumbnail: "👋" },
    { id: "17", name: "Content Strategy", description: "Content creation workflow", type: "mindmap", elements: 21, collaborators: 3, lastModified: "2026-02-01T15:45:00Z", thumbnail: "✍️" },
    { id: "18", name: "Invoice Processing", description: "Accounts payable BPMN flow", type: "bpmn", elements: 14, collaborators: 2, lastModified: "2026-01-31T09:30:00Z", thumbnail: "💵" },
    { id: "19", name: "Network Topology", description: "Infrastructure network diagram", type: "diagram", elements: 30, collaborators: 4, lastModified: "2026-01-30T14:00:00Z", thumbnail: "🌐" },
    { id: "20", name: "Feature Brainstorm", description: "Q2 feature ideation session", type: "mindmap", elements: 25, collaborators: 7, lastModified: "2026-01-29T11:15:00Z", thumbnail: "💡" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    type: "flowchart" as const
  });

  const templates = [
    {
      id: "t1",
      name: "Customer Journey Map",
      description: "Map the entire customer experience with your product",
      type: "flowchart",
      icon: "🗺️",
      popularity: "Most Popular"
    },
    {
      id: "t2",
      name: "BPMN Process Flow",
      description: "Business Process Model and Notation compliant diagrams",
      type: "bpmn",
      icon: "⚙️",
      popularity: "Trending"
    },
    {
      id: "t3",
      name: "Software Architecture",
      description: "Design system components and their relationships",
      type: "diagram",
      icon: "🏗️",
      popularity: "Popular"
    },
    {
      id: "t4",
      name: "Workflow Automation",
      description: "Map automated workflows and decision trees",
      type: "flowchart",
      icon: "⚡",
      popularity: "New"
    },
    {
      id: "t5",
      name: "Data Flow Diagram",
      description: "Visualize data movement through your system",
      type: "diagram",
      icon: "📊",
      popularity: "Popular"
    },
    {
      id: "t6",
      name: "Mind Map",
      description: "Brainstorm and organize ideas visually",
      type: "mindmap",
      icon: "💡",
      popularity: "Popular"
    }
  ];

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const createProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your canvas",
        variant: "destructive"
      });
      return;
    }

    const project: CanvasProject = {
      id: `project-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      type: newProject.type,
      elements: 0,
      collaborators: 1,
      lastModified: new Date().toISOString(),
      thumbnail: "📄"
    };

    setProjects(prev => [...prev, project]);
    setIsCreateDialogOpen(false);
    setNewProject({ name: "", description: "", type: "flowchart" });
    
    toast({
      title: "Canvas created",
      description: `${newProject.name} has been created successfully.`
    });
  };

  const duplicateProject = (project: CanvasProject) => {
    const duplicate: CanvasProject = {
      ...project,
      id: `project-${Date.now()}`,
      name: `${project.name} (Copy)`,
      lastModified: new Date().toISOString()
    };
    
    setProjects(prev => [...prev, duplicate]);
    
    toast({
      title: "Canvas duplicated",
      description: `A copy of ${project.name} has been created.`
    });
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Canvas deleted",
      description: "The canvas has been deleted successfully."
    });
  };

  const useTemplate = (template: typeof templates[0]) => {
    const project: CanvasProject = {
      id: `project-${Date.now()}`,
      name: template.name,
      description: template.description,
      type: template.type as any,
      elements: 0,
      collaborators: 1,
      lastModified: new Date().toISOString(),
      thumbnail: template.icon
    };

    setProjects(prev => [...prev, project]);
    
    toast({
      title: "Template applied",
      description: `${template.name} template has been created.`
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Process Canvas</h1>
        <p className="text-muted-foreground">Visualize and design your workflow processes, diagrams, and flowcharts</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search canvases..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          Create New Canvas
        </Button>
      </div>

      {/* My Canvases */}
      {filteredProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Layers size={20} />
            My Canvases ({filteredProjects.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map(project => (
              <Card key={project.id} className="hover:shadow-lg transition-all group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{project.thumbnail}</div>
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="text-sm line-clamp-1">{project.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>{project.elements} elements</span>
                    <span>{project.collaborators} collaborators</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{project.type}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(project.lastModified)}</span>
                  </div>
                  <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => duplicateProject(project)}>
                      <Copy size={14} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteProject(project.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Templates */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Layout size={20} />
          Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <Card key={template.id} className="hover:shadow-lg transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{template.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-sm">{template.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{template.popularity}</Badge>
                  <Button size="sm" onClick={() => useTemplate(template)}>
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Canvas</DialogTitle>
            <DialogDescription>
              Create a new canvas to visualize your processes and workflows.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Canvas Name</label>
              <Input
                placeholder="e.g., Customer Onboarding Flow"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="What will this canvas visualize?"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={newProject.type}
                onChange={(e) => setNewProject({...newProject, type: e.target.value as any})}
              >
                <option value="flowchart">Flowchart</option>
                <option value="diagram">Diagram</option>
                <option value="mindmap">Mind Map</option>
                <option value="bpmn">BPMN Process</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={createProject}>Create Canvas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
