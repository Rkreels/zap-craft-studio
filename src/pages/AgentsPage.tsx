import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Bot, Play, Pause, Settings, Trash2, Copy, Search, Edit, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "error";
  type: "chatbot" | "workflow" | "monitoring" | "data" | "email";
  triggers: number;
  lastActive: string;
  createdAt: string;
}

const initialAgents: Agent[] = [
  { id: "ag-1", name: "Customer Support Agent", description: "Responds to customer inquiries and routes complex issues to human agents", status: "active", type: "chatbot", triggers: 2470, lastActive: "2026-02-17T08:30:00Z", createdAt: "2025-06-10T08:00:00Z" },
  { id: "ag-2", name: "Lead Qualification Agent", description: "Qualifies incoming leads and updates CRM with contact scores", status: "paused", type: "workflow", triggers: 1560, lastActive: "2026-02-16T14:00:00Z", createdAt: "2025-07-15T10:00:00Z" },
  { id: "ag-3", name: "Social Media Monitor", description: "Monitors brand mentions across social platforms and alerts marketing", status: "active", type: "monitoring", triggers: 890, lastActive: "2026-02-17T08:25:00Z", createdAt: "2025-08-20T09:00:00Z" },
  { id: "ag-4", name: "Invoice Processor", description: "Extracts data from invoices and creates accounting entries", status: "active", type: "data", triggers: 3450, lastActive: "2026-02-17T07:45:00Z", createdAt: "2025-05-05T11:00:00Z" },
  { id: "ag-5", name: "Email Classifier", description: "Classifies incoming emails and routes to appropriate departments", status: "active", type: "email", triggers: 5670, lastActive: "2026-02-17T08:00:00Z", createdAt: "2025-04-12T08:00:00Z" },
  { id: "ag-6", name: "Onboarding Assistant", description: "Guides new users through product onboarding steps", status: "active", type: "chatbot", triggers: 1230, lastActive: "2026-02-17T06:15:00Z", createdAt: "2025-09-01T13:00:00Z" },
  { id: "ag-7", name: "Data Quality Checker", description: "Validates and cleans data across connected databases", status: "error", type: "data", triggers: 780, lastActive: "2026-02-15T09:00:00Z", createdAt: "2025-10-08T10:00:00Z" },
  { id: "ag-8", name: "Meeting Scheduler", description: "Coordinates meeting times across participants' calendars", status: "active", type: "workflow", triggers: 456, lastActive: "2026-02-17T05:30:00Z", createdAt: "2025-11-12T14:00:00Z" },
  { id: "ag-9", name: "Content Moderator", description: "Reviews user-generated content for policy violations", status: "active", type: "monitoring", triggers: 8900, lastActive: "2026-02-17T08:10:00Z", createdAt: "2025-03-20T09:00:00Z" },
  { id: "ag-10", name: "Ticket Escalation Agent", description: "Escalates unresolved support tickets after SLA thresholds", status: "active", type: "workflow", triggers: 2340, lastActive: "2026-02-17T07:00:00Z", createdAt: "2025-06-25T11:00:00Z" },
  { id: "ag-11", name: "Competitive Intel Monitor", description: "Tracks competitor pricing and product changes", status: "paused", type: "monitoring", triggers: 345, lastActive: "2026-01-20T12:00:00Z", createdAt: "2025-08-05T08:00:00Z" },
  { id: "ag-12", name: "Order Fulfillment Agent", description: "Processes orders and coordinates with shipping providers", status: "active", type: "workflow", triggers: 4560, lastActive: "2026-02-17T06:45:00Z", createdAt: "2025-04-30T10:00:00Z" },
  { id: "ag-13", name: "Sentiment Analyzer", description: "Analyzes customer feedback sentiment across channels", status: "active", type: "data", triggers: 1890, lastActive: "2026-02-17T04:20:00Z", createdAt: "2025-07-22T09:00:00Z" },
  { id: "ag-14", name: "Newsletter Curator", description: "Curates and compiles content for weekly newsletters", status: "active", type: "email", triggers: 52, lastActive: "2026-02-17T03:00:00Z", createdAt: "2025-09-15T14:00:00Z" },
  { id: "ag-15", name: "Expense Approver", description: "Auto-approves expenses under threshold and flags exceptions", status: "active", type: "workflow", triggers: 678, lastActive: "2026-02-16T18:30:00Z", createdAt: "2025-10-28T11:00:00Z" },
  { id: "ag-16", name: "Product Recommender", description: "Suggests products to customers based on browsing history", status: "active", type: "chatbot", triggers: 12300, lastActive: "2026-02-17T08:20:00Z", createdAt: "2025-05-18T08:00:00Z" },
  { id: "ag-17", name: "Compliance Checker", description: "Validates documents against regulatory requirements", status: "error", type: "data", triggers: 234, lastActive: "2026-02-14T09:00:00Z", createdAt: "2025-11-05T10:00:00Z" },
  { id: "ag-18", name: "Inventory Alert Agent", description: "Sends alerts when inventory falls below reorder points", status: "active", type: "monitoring", triggers: 567, lastActive: "2026-02-17T02:30:00Z", createdAt: "2025-06-30T09:00:00Z" },
  { id: "ag-19", name: "Follow-up Reminder", description: "Sends automated follow-up reminders for stale deals", status: "paused", type: "email", triggers: 189, lastActive: "2026-01-15T10:00:00Z", createdAt: "2025-12-01T13:00:00Z" },
  { id: "ag-20", name: "Report Generator", description: "Generates weekly performance reports from multiple data sources", status: "active", type: "data", triggers: 104, lastActive: "2026-02-17T01:00:00Z", createdAt: "2025-08-14T08:00:00Z" },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [newAgent, setNewAgent] = useState({ name: "", description: "", type: "chatbot" as Agent["type"] });

  const filtered = agents.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "all" || a.type === typeFilter;
    return matchSearch && matchType;
  });

  const formatDate = (d: string) => new Date(d).toLocaleString();
  const statusColor = (s: string) => s === "active" ? "bg-emerald-100 text-emerald-700" : s === "paused" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";

  const createAgent = () => {
    if (!newAgent.name.trim()) { toast({ title: "Name required", description: "Please enter a name", variant: "destructive" }); return; }
    const agent: Agent = { id: `ag-${Date.now()}`, ...newAgent, status: "paused", triggers: 0, lastActive: new Date().toISOString(), createdAt: new Date().toISOString() };
    setAgents(prev => [agent, ...prev]);
    setNewAgent({ name: "", description: "", type: "chatbot" });
    setIsCreateOpen(false);
    toast({ title: "Agent Created", description: `${agent.name} has been created.` });
  };

  const updateAgent = () => {
    if (!selectedAgent) return;
    setAgents(prev => prev.map(a => a.id === selectedAgent.id ? selectedAgent : a));
    setIsEditOpen(false);
    toast({ title: "Agent Updated", description: `${selectedAgent.name} has been updated.` });
  };

  const deleteAgent = () => {
    if (!selectedAgent) return;
    setAgents(prev => prev.filter(a => a.id !== selectedAgent.id));
    setIsDeleteOpen(false);
    toast({ title: "Agent Deleted", description: "The agent has been removed.", variant: "destructive" });
  };

  const toggleStatus = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active", lastActive: new Date().toISOString() } : a));
    const agent = agents.find(a => a.id === id);
    toast({ title: agent?.status === "active" ? "Agent Paused" : "Agent Started", description: `${agent?.name} is now ${agent?.status === "active" ? "paused" : "active"}.` });
  };

  const duplicateAgent = (agent: Agent) => {
    const dup: Agent = { ...agent, id: `ag-${Date.now()}`, name: `${agent.name} (Copy)`, status: "paused", triggers: 0, createdAt: new Date().toISOString() };
    setAgents(prev => [dup, ...prev]);
    toast({ title: "Agent Duplicated", description: `Copy of ${agent.name} created.` });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Agents</h1>
          <p className="text-muted-foreground">Intelligent agents that work autonomously to automate complex tasks</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus size={16} /> Create Agent
        </Button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Search agents..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="chatbot">Chatbot</SelectItem>
            <SelectItem value="workflow">Workflow</SelectItem>
            <SelectItem value="monitoring">Monitoring</SelectItem>
            <SelectItem value="data">Data</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
        <span>Total: {agents.length}</span>
        <span>Active: {agents.filter(a => a.status === "active").length}</span>
        <span>Paused: {agents.filter(a => a.status === "paused").length}</span>
        <span>Error: {agents.filter(a => a.status === "error").length}</span>
      </div>

      <div className="space-y-3">
        {filtered.map(agent => (
          <Card key={agent.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Bot className="text-primary" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">{agent.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{agent.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{agent.type}</Badge>
                      <span><Activity size={12} className="inline mr-1" />{agent.triggers.toLocaleString()} triggers</span>
                      <span>Last: {formatDate(agent.lastActive)}</span>
                      <Badge className={statusColor(agent.status)}>{agent.status}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => toggleStatus(agent.id)} className="gap-1">
                    {agent.status === "active" ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Start</>}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedAgent(agent); setIsEditOpen(true); }}><Edit size={14} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => duplicateAgent(agent)}><Copy size={14} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedAgent(agent); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No agents found</div>}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Agent</DialogTitle><DialogDescription>Configure a new AI agent.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input placeholder="e.g., Customer Support Agent" value={newAgent.name} onChange={e => setNewAgent({ ...newAgent, name: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea placeholder="What does this agent do?" value={newAgent.description} onChange={e => setNewAgent({ ...newAgent, description: e.target.value })} /></div>
            <div><Label>Type</Label>
              <Select value={newAgent.type} onValueChange={(v: any) => setNewAgent({ ...newAgent, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="chatbot">Chatbot</SelectItem>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="data">Data Processing</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={createAgent}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Agent</DialogTitle></DialogHeader>
          {selectedAgent && (
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={selectedAgent.name} onChange={e => setSelectedAgent({ ...selectedAgent, name: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={selectedAgent.description} onChange={e => setSelectedAgent({ ...selectedAgent, description: e.target.value })} /></div>
              <div><Label>Type</Label>
                <Select value={selectedAgent.type} onValueChange={(v: any) => setSelectedAgent({ ...selectedAgent, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chatbot">Chatbot</SelectItem>
                    <SelectItem value="workflow">Workflow</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="data">Data Processing</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={updateAgent}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Agent</DialogTitle><DialogDescription>Are you sure you want to delete "{selectedAgent?.name}"? This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={deleteAgent}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
