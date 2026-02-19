import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenTool, Plus, Search, Edit, Trash2, Copy, Share2, Layers, Layout, Users, Download } from 'lucide-react';
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
  status: "active" | "draft";
}

const initialProjects: CanvasProject[] = [
  { id: "1", name: "Customer Onboarding Flow", description: "End-to-end customer onboarding process", type: "flowchart", elements: 12, collaborators: 3, lastModified: "2026-02-17T10:30:00Z", thumbnail: "🔄", status: "active" },
  { id: "2", name: "System Architecture", description: "Complete system architecture diagram", type: "diagram", elements: 24, collaborators: 5, lastModified: "2026-02-16T14:20:00Z", thumbnail: "🏗️", status: "active" },
  { id: "3", name: "Project Planning", description: "Project tasks and dependencies mindmap", type: "mindmap", elements: 18, collaborators: 2, lastModified: "2026-02-15T09:15:00Z", thumbnail: "🧠", status: "active" },
  { id: "4", name: "Sales Pipeline Process", description: "Lead to customer conversion flow", type: "bpmn", elements: 15, collaborators: 4, lastModified: "2026-02-14T11:00:00Z", thumbnail: "💰", status: "active" },
  { id: "5", name: "CI/CD Pipeline", description: "Continuous integration deployment flow", type: "flowchart", elements: 20, collaborators: 6, lastModified: "2026-02-13T16:45:00Z", thumbnail: "🚀", status: "active" },
  { id: "6", name: "User Journey Map", description: "Complete user experience journey", type: "flowchart", elements: 28, collaborators: 3, lastModified: "2026-02-12T08:30:00Z", thumbnail: "🗺️", status: "active" },
  { id: "7", name: "Database Schema", description: "Entity relationship diagram", type: "diagram", elements: 35, collaborators: 2, lastModified: "2026-02-11T13:00:00Z", thumbnail: "🗄️", status: "active" },
  { id: "8", name: "Marketing Funnel", description: "Awareness to conversion funnel", type: "flowchart", elements: 10, collaborators: 3, lastModified: "2026-02-10T15:20:00Z", thumbnail: "📊", status: "active" },
  { id: "9", name: "API Architecture", description: "REST API endpoint structure", type: "diagram", elements: 22, collaborators: 4, lastModified: "2026-02-09T10:00:00Z", thumbnail: "🔗", status: "active" },
  { id: "10", name: "Sprint Retrospective", description: "Team retrospective mindmap", type: "mindmap", elements: 14, collaborators: 8, lastModified: "2026-02-08T14:30:00Z", thumbnail: "💭", status: "active" },
  { id: "11", name: "Incident Response Plan", description: "Emergency response workflow", type: "bpmn", elements: 16, collaborators: 5, lastModified: "2026-02-07T09:00:00Z", thumbnail: "🚨", status: "active" },
  { id: "12", name: "Data Pipeline", description: "ETL data processing flow", type: "flowchart", elements: 19, collaborators: 3, lastModified: "2026-02-06T11:45:00Z", thumbnail: "📦", status: "active" },
  { id: "13", name: "Product Roadmap", description: "Feature planning mindmap", type: "mindmap", elements: 32, collaborators: 6, lastModified: "2026-02-05T16:00:00Z", thumbnail: "🎯", status: "active" },
  { id: "14", name: "Support Escalation", description: "Ticket escalation workflow", type: "bpmn", elements: 11, collaborators: 4, lastModified: "2026-02-04T08:15:00Z", thumbnail: "📞", status: "active" },
  { id: "15", name: "Microservices Map", description: "Service communication diagram", type: "diagram", elements: 27, collaborators: 5, lastModified: "2026-02-03T13:30:00Z", thumbnail: "🔧", status: "active" },
  { id: "16", name: "Employee Onboarding", description: "New hire onboarding checklist flow", type: "flowchart", elements: 13, collaborators: 2, lastModified: "2026-02-02T10:00:00Z", thumbnail: "👋", status: "draft" },
  { id: "17", name: "Content Strategy", description: "Content creation workflow", type: "mindmap", elements: 21, collaborators: 3, lastModified: "2026-02-01T15:45:00Z", thumbnail: "✍️", status: "draft" },
  { id: "18", name: "Invoice Processing", description: "Accounts payable BPMN flow", type: "bpmn", elements: 14, collaborators: 2, lastModified: "2026-01-31T09:30:00Z", thumbnail: "💵", status: "active" },
  { id: "19", name: "Network Topology", description: "Infrastructure network diagram", type: "diagram", elements: 30, collaborators: 4, lastModified: "2026-01-30T14:00:00Z", thumbnail: "🌐", status: "active" },
  { id: "20", name: "Feature Brainstorm", description: "Q2 feature ideation session", type: "mindmap", elements: 25, collaborators: 7, lastModified: "2026-01-29T11:15:00Z", thumbnail: "💡", status: "draft" },
];

const TEMPLATES = [
  { id: "t1", name: "Customer Journey Map", description: "Map the entire customer experience with your product from awareness to advocacy", type: "flowchart", icon: "🗺️", popularity: "Most Popular", uses: 15400 },
  { id: "t2", name: "BPMN Process Flow", description: "Business Process Model and Notation compliant diagram for enterprise workflows", type: "bpmn", icon: "⚙️", popularity: "Trending", uses: 9800 },
  { id: "t3", name: "Software Architecture", description: "Design system components, microservices, and their communication relationships", type: "diagram", icon: "🏗️", popularity: "Popular", uses: 12100 },
  { id: "t4", name: "Workflow Automation Map", description: "Map automated workflows, conditional paths, and decision trees visually", type: "flowchart", icon: "⚡", popularity: "New", uses: 3400 },
  { id: "t5", name: "Data Flow Diagram", description: "Visualize how data moves through your system from ingestion to storage", type: "diagram", icon: "📊", popularity: "Popular", uses: 7600 },
  { id: "t6", name: "Mind Map Brainstorm", description: "Organize ideas, features, and concepts in a radial brainstorming layout", type: "mindmap", icon: "💡", popularity: "Popular", uses: 18900 },
];

const POPULARITY_COLORS: Record<string, string> = {
  "Most Popular": "bg-emerald-100 text-emerald-700",
  "Trending": "bg-sky-100 text-sky-700",
  "Popular": "bg-primary/10 text-primary",
  "New": "bg-purple-100 text-purple-700",
};

export default function CanvasPage() {
  const [projects, setProjects] = useState<CanvasProject[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CanvasProject | null>(null);
  const [newProject, setNewProject] = useState({ name: "", description: "", type: "flowchart" as CanvasProject["type"] });
  const [shareEmail, setShareEmail] = useState("");

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filtered = projects.filter(p =>
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (typeFilter === "all" || p.type === typeFilter)
  );

  const createProject = () => {
    if (!newProject.name.trim()) {
      toast({ title: "Name required", description: "Please enter a canvas name.", variant: "destructive" });
      return;
    }
    const project: CanvasProject = { id: `p-${Date.now()}`, ...newProject, elements: 0, collaborators: 1, lastModified: new Date().toISOString(), thumbnail: "📄", status: "draft" };
    setProjects(prev => [project, ...prev]);
    setIsCreateOpen(false);
    setNewProject({ name: "", description: "", type: "flowchart" });
    toast({ title: "Canvas Created", description: `${project.name} has been created.` });
  };

  const updateProject = () => {
    if (!selectedProject) return;
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...selectedProject, lastModified: new Date().toISOString() } : p));
    setIsEditOpen(false);
    toast({ title: "Canvas Updated", description: `${selectedProject.name} has been updated.` });
  };

  const deleteProject = () => {
    if (!selectedProject) return;
    setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
    setIsDeleteOpen(false);
    toast({ title: "Canvas Deleted", description: "The canvas has been deleted.", variant: "destructive" });
  };

  const duplicateProject = (project: CanvasProject) => {
    const dup: CanvasProject = { ...project, id: `p-${Date.now()}`, name: `${project.name} (Copy)`, lastModified: new Date().toISOString(), status: "draft" };
    setProjects(prev => [dup, ...prev]);
    toast({ title: "Canvas Duplicated", description: `Copy of ${project.name} created.` });
  };

  const exportProject = (project: CanvasProject) => {
    toast({ title: "Export Started", description: `Exporting ${project.name} as PNG…` });
  };

  const shareProject = () => {
    if (!shareEmail.trim()) {
      toast({ title: "Email required", description: "Enter an email to share with.", variant: "destructive" });
      return;
    }
    toast({ title: "Canvas Shared", description: `${selectedProject?.name} shared with ${shareEmail}.` });
    setShareEmail("");
    setIsShareOpen(false);
  };

  const useTemplate = (template: typeof TEMPLATES[0]) => {
    const project: CanvasProject = {
      id: `p-${Date.now()}`, name: template.name, description: template.description,
      type: template.type as any, elements: 0, collaborators: 1,
      lastModified: new Date().toISOString(), thumbnail: template.icon, status: "draft"
    };
    setProjects(prev => [project, ...prev]);
    toast({ title: "Template Applied", description: `${template.name} canvas created and added to your workspace.` });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Process Canvas</h1>
          <p className="text-muted-foreground">Visualize and design workflow processes, architecture diagrams, and flowcharts</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus size={16} /> New Canvas
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Canvases", value: projects.length },
          { label: "Active", value: projects.filter(p => p.status === "active").length },
          { label: "Draft", value: projects.filter(p => p.status === "draft").length },
          { label: "Total Elements", value: projects.reduce((s, p) => s + p.elements, 0).toLocaleString() },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Search canvases…" className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="flowchart">Flowchart</SelectItem>
            <SelectItem value="diagram">Diagram</SelectItem>
            <SelectItem value="mindmap">Mind Map</SelectItem>
            <SelectItem value="bpmn">BPMN Process</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* My Canvases */}
      {filtered.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Layers size={18} /> My Canvases ({filtered.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(project => (
              <Card key={project.id} className="hover:shadow-lg transition-all group border hover:border-primary/30">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{project.thumbnail}</span>
                      <div>
                        <CardTitle className="text-sm font-semibold leading-tight">{project.name}</CardTitle>
                        <Badge variant={project.status === "active" ? "default" : "secondary"} className="text-xs mt-0.5">{project.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-xs line-clamp-2 mt-1">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <Badge variant="outline" className="text-xs">{project.type}</Badge>
                    <span>{formatDate(project.lastModified)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span>{project.elements} elements</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Users size={10} />{project.collaborators}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-7"
                      onClick={() => { setSelectedProject(project); setIsEditOpen(true); }}>
                      <Edit size={12} className="mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicateProject(project)}>
                      <Copy size={12} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSelectedProject(project); setIsShareOpen(true); }}>
                      <Share2 size={12} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => exportProject(project)}>
                      <Download size={12} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => { setSelectedProject(project); setIsDeleteOpen(true); }}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground mb-8">
          <PenTool size={40} className="mx-auto mb-3 opacity-30" />
          <p>No canvases match your search</p>
        </div>
      )}

      {/* Templates */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Layout size={18} /> Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(template => (
            <Card key={template.id} className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{template.icon}</span>
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{template.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs border-0 ${POPULARITY_COLORS[template.popularity]}`}>{template.popularity}</Badge>
                    <span className="text-xs text-muted-foreground">{template.uses.toLocaleString()} uses</span>
                  </div>
                  <Button size="sm" onClick={() => useTemplate(template)} className="gap-1">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Canvas</DialogTitle><DialogDescription>Choose a name and type for your new canvas.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Canvas Name *</Label><Input placeholder="e.g., Customer Onboarding Flow" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea placeholder="What does this canvas visualize?" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} /></div>
            <div><Label>Type</Label>
              <Select value={newProject.type} onValueChange={(v: any) => setNewProject({ ...newProject, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="flowchart">Flowchart</SelectItem>
                  <SelectItem value="diagram">Diagram</SelectItem>
                  <SelectItem value="mindmap">Mind Map</SelectItem>
                  <SelectItem value="bpmn">BPMN Process</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={createProject}>Create Canvas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Canvas</DialogTitle></DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div><Label>Canvas Name *</Label><Input value={selectedProject.name} onChange={e => setSelectedProject({ ...selectedProject, name: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={selectedProject.description} onChange={e => setSelectedProject({ ...selectedProject, description: e.target.value })} /></div>
              <div><Label>Type</Label>
                <Select value={selectedProject.type} onValueChange={(v: any) => setSelectedProject({ ...selectedProject, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flowchart">Flowchart</SelectItem>
                    <SelectItem value="diagram">Diagram</SelectItem>
                    <SelectItem value="mindmap">Mind Map</SelectItem>
                    <SelectItem value="bpmn">BPMN Process</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Status</Label>
                <Select value={selectedProject.status} onValueChange={(v: any) => setSelectedProject({ ...selectedProject, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={updateProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Canvas</DialogTitle>
            <DialogDescription>Invite collaborators to "{selectedProject?.name}"</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Email Address</Label><Input type="email" placeholder="colleague@company.com" value={shareEmail} onChange={e => setShareEmail(e.target.value)} /></div>
            <div className="p-3 bg-muted rounded-md text-sm">
              <p className="font-medium mb-1">Share Link</p>
              <code className="text-xs text-muted-foreground break-all">https://app.zapier.com/canvas/{selectedProject?.id}?share=view</code>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareOpen(false)}>Cancel</Button>
            <Button onClick={shareProject} className="gap-1"><Share2 size={14} /> Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Canvas</DialogTitle><DialogDescription>Are you sure you want to delete "{selectedProject?.name}"? This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteProject}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
