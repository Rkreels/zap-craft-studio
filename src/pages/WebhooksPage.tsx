import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, Copy, Plus, Trash2, Edit, Search, CheckCircle, AlertCircle, Clock, Send, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Webhook {
  id: string;
  name: string;
  url: string;
  method: "POST" | "GET" | "PUT";
  status: "active" | "inactive" | "error";
  lastTriggered: string;
  triggers: number;
  createdAt: string;
  events: WebhookEvent[];
}

interface WebhookEvent {
  id: string;
  timestamp: string;
  source: string;
  eventType: string;
  status: "success" | "failed";
  payload?: any;
}

const initialWebhooks: Webhook[] = [
  { id: "wh-1", name: "Order Notifications", url: "https://api.example.com/webhooks/orders", method: "POST", status: "active", lastTriggered: "2026-02-17T08:30:00Z", triggers: 1247, createdAt: "2025-06-10T08:00:00Z", events: [
    { id: "ev-1", timestamp: "2026-02-17T08:30:00Z", source: "shopify.com", eventType: "order.created", status: "success", payload: { orderId: "#4521", total: "$129.99" } },
    { id: "ev-2", timestamp: "2026-02-17T07:15:00Z", source: "shopify.com", eventType: "order.updated", status: "success", payload: { orderId: "#4520", status: "shipped" } },
  ]},
  { id: "wh-2", name: "Payment Processor", url: "https://api.example.com/webhooks/payments", method: "POST", status: "active", lastTriggered: "2026-02-17T07:45:00Z", triggers: 892, createdAt: "2025-07-15T10:00:00Z", events: [
    { id: "ev-3", timestamp: "2026-02-17T07:45:00Z", source: "stripe.com", eventType: "payment.succeeded", status: "success", payload: { amount: "$499.00" } },
  ]},
  { id: "wh-3", name: "User Registration", url: "https://api.example.com/webhooks/users", method: "POST", status: "active", lastTriggered: "2026-02-17T06:15:00Z", triggers: 456, createdAt: "2025-08-20T09:00:00Z", events: [] },
  { id: "wh-4", name: "Support Ticket Alert", url: "https://api.example.com/webhooks/tickets", method: "POST", status: "active", lastTriggered: "2026-02-17T05:30:00Z", triggers: 2103, createdAt: "2025-05-05T11:00:00Z", events: [] },
  { id: "wh-5", name: "Deployment Notifier", url: "https://api.example.com/webhooks/deploys", method: "POST", status: "error", lastTriggered: "2026-02-14T09:00:00Z", triggers: 734, createdAt: "2025-09-01T13:00:00Z", events: [
    { id: "ev-4", timestamp: "2026-02-14T09:00:00Z", source: "github.com", eventType: "deploy.failed", status: "failed", payload: { error: "Timeout" } },
  ]},
  { id: "wh-6", name: "Inventory Sync", url: "https://api.example.com/webhooks/inventory", method: "POST", status: "active", lastTriggered: "2026-02-17T04:20:00Z", triggers: 321, createdAt: "2025-10-08T10:00:00Z", events: [] },
  { id: "wh-7", name: "CRM Contact Sync", url: "https://api.example.com/webhooks/crm", method: "POST", status: "inactive", lastTriggered: "2026-01-20T12:00:00Z", triggers: 189, createdAt: "2025-11-12T14:00:00Z", events: [] },
  { id: "wh-8", name: "Email Campaign Tracker", url: "https://api.example.com/webhooks/email", method: "POST", status: "active", lastTriggered: "2026-02-17T03:15:00Z", triggers: 567, createdAt: "2025-04-12T08:00:00Z", events: [] },
  { id: "wh-9", name: "Form Submission Handler", url: "https://api.example.com/webhooks/forms", method: "POST", status: "active", lastTriggered: "2026-02-16T18:30:00Z", triggers: 245, createdAt: "2025-06-25T11:00:00Z", events: [] },
  { id: "wh-10", name: "Analytics Event Collector", url: "https://api.example.com/webhooks/analytics", method: "POST", status: "active", lastTriggered: "2026-02-17T02:30:00Z", triggers: 8900, createdAt: "2025-03-20T09:00:00Z", events: [] },
  { id: "wh-11", name: "Slack Bot Endpoint", url: "https://api.example.com/webhooks/slack", method: "POST", status: "active", lastTriggered: "2026-02-17T08:10:00Z", triggers: 3450, createdAt: "2025-08-05T08:00:00Z", events: [] },
  { id: "wh-12", name: "Calendar Sync", url: "https://api.example.com/webhooks/calendar", method: "POST", status: "active", lastTriggered: "2026-02-16T15:00:00Z", triggers: 456, createdAt: "2025-07-22T09:00:00Z", events: [] },
  { id: "wh-13", name: "Social Media Monitor", url: "https://api.example.com/webhooks/social", method: "POST", status: "inactive", lastTriggered: "2026-01-15T10:00:00Z", triggers: 78, createdAt: "2025-12-01T10:00:00Z", events: [] },
  { id: "wh-14", name: "Data Export Trigger", url: "https://api.example.com/webhooks/export", method: "GET", status: "active", lastTriggered: "2026-02-15T14:00:00Z", triggers: 234, createdAt: "2025-09-15T14:00:00Z", events: [] },
  { id: "wh-15", name: "Error Logger", url: "https://api.example.com/webhooks/errors", method: "POST", status: "active", lastTriggered: "2026-02-17T01:00:00Z", triggers: 1890, createdAt: "2025-05-18T08:00:00Z", events: [] },
  { id: "wh-16", name: "Billing Event Handler", url: "https://api.example.com/webhooks/billing", method: "POST", status: "active", lastTriggered: "2026-02-16T20:00:00Z", triggers: 678, createdAt: "2025-10-28T11:00:00Z", events: [] },
  { id: "wh-17", name: "Feedback Collector", url: "https://api.example.com/webhooks/feedback", method: "POST", status: "active", lastTriggered: "2026-02-16T12:00:00Z", triggers: 345, createdAt: "2025-06-30T09:00:00Z", events: [] },
  { id: "wh-18", name: "CI/CD Pipeline Hook", url: "https://api.example.com/webhooks/cicd", method: "POST", status: "active", lastTriggered: "2026-02-17T06:45:00Z", triggers: 567, createdAt: "2025-04-30T10:00:00Z", events: [] },
  { id: "wh-19", name: "Health Check Ping", url: "https://api.example.com/webhooks/health", method: "GET", status: "active", lastTriggered: "2026-02-17T08:00:00Z", triggers: 12300, createdAt: "2025-08-14T08:00:00Z", events: [] },
  { id: "wh-20", name: "Notification Relay", url: "https://api.example.com/webhooks/notify", method: "POST", status: "active", lastTriggered: "2026-02-16T22:00:00Z", triggers: 4560, createdAt: "2025-07-10T08:00:00Z", events: [] },
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedWh, setSelectedWh] = useState<Webhook | null>(null);
  const [viewingWh, setViewingWh] = useState<Webhook | null>(null);
  const [newWh, setNewWh] = useState({ name: "", url: "", method: "POST" as const });

  const filtered = webhooks.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.url.toLowerCase().includes(searchQuery.toLowerCase()));

  const statusColor = (s: string) => s === "active" ? "bg-emerald-100 text-emerald-700" : s === "error" ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-700";

  const createWebhook = () => {
    if (!newWh.name.trim() || !newWh.url.trim()) { toast({ title: "Required fields", description: "Name and URL are required", variant: "destructive" }); return; }
    const wh: Webhook = { id: `wh-${Date.now()}`, ...newWh, status: "active", lastTriggered: "Never", triggers: 0, createdAt: new Date().toISOString(), events: [] };
    setWebhooks(prev => [wh, ...prev]);
    setNewWh({ name: "", url: "", method: "POST" });
    setIsCreateOpen(false);
    toast({ title: "Webhook Created", description: `${wh.name} is ready to receive events.` });
  };

  const deleteWebhook = () => {
    if (!selectedWh) return;
    setWebhooks(prev => prev.filter(w => w.id !== selectedWh.id));
    setIsDeleteOpen(false);
    toast({ title: "Webhook Deleted", variant: "destructive" });
  };

  const toggleStatus = (id: string) => {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, status: w.status === "active" ? "inactive" : "active" } : w));
    toast({ title: "Status Updated" });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ description: "Webhook URL copied to clipboard" });
  };

  const testWebhook = (wh: Webhook) => {
    toast({ title: "Test Sent", description: `Test payload sent to ${wh.name}` });
    setWebhooks(prev => prev.map(w => w.id === wh.id ? { ...w, triggers: w.triggers + 1, lastTriggered: new Date().toISOString() } : w));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Webhooks</h1>
          <p className="text-muted-foreground">Manage incoming and outgoing webhook endpoints</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}><Plus size={16} className="mr-2" /> Create Webhook</Button>
      </div>

      <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
        <span>Total: {webhooks.length}</span>
        <span>Active: {webhooks.filter(w => w.status === "active").length}</span>
        <span>Total triggers: {webhooks.reduce((s, w) => s + w.triggers, 0).toLocaleString()}</span>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input placeholder="Search webhooks..." className="pl-10 max-w-md" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map(wh => (
          <Card key={wh.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{wh.name}</h3>
                    <Badge className={statusColor(wh.status)}>{wh.status}</Badge>
                    <Badge variant="outline" className="text-xs">{wh.method}</Badge>
                  </div>
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded block truncate max-w-xl">{wh.url}</code>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{wh.triggers.toLocaleString()} triggers</span>
                    <span>Last: {wh.lastTriggered === "Never" ? "Never" : new Date(wh.lastTriggered).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => copyUrl(wh.url)}><Copy size={14} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => testWebhook(wh)}><Send size={14} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setViewingWh(wh)}><Eye size={14} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleStatus(wh.id)}>{wh.status === "active" ? "Pause" : "Enable"}</Button>
                  <Button variant="ghost" size="sm" onClick={() => { setSelectedWh(wh); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No webhooks found</div>}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Webhook</DialogTitle><DialogDescription>Set up a new webhook endpoint.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input placeholder="e.g., Order Notifications" value={newWh.name} onChange={e => setNewWh({ ...newWh, name: e.target.value })} /></div>
            <div><Label>URL</Label><Input placeholder="https://api.example.com/webhook/..." value={newWh.url} onChange={e => setNewWh({ ...newWh, url: e.target.value })} /></div>
            <div><Label>Method</Label>
              <Select value={newWh.method} onValueChange={(v: any) => setNewWh({ ...newWh, method: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={createWebhook}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Webhook</DialogTitle><DialogDescription>Are you sure you want to delete "{selectedWh?.name}"?</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={deleteWebhook}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingWh} onOpenChange={() => setViewingWh(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{viewingWh?.name}</DialogTitle></DialogHeader>
          {viewingWh && (
            <div className="space-y-4">
              <div><Label>URL</Label><code className="text-sm bg-muted p-2 rounded block">{viewingWh.url}</code></div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-muted-foreground">Method</span><p className="font-medium">{viewingWh.method}</p></div>
                <div><span className="text-muted-foreground">Triggers</span><p className="font-medium">{viewingWh.triggers.toLocaleString()}</p></div>
                <div><span className="text-muted-foreground">Status</span><Badge className={statusColor(viewingWh.status)}>{viewingWh.status}</Badge></div>
              </div>
              {viewingWh.events.length > 0 && (
                <div>
                  <Label>Recent Events</Label>
                  <div className="space-y-2 mt-1">
                    {viewingWh.events.map(ev => (
                      <div key={ev.id} className="border rounded p-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{ev.eventType}</span>
                          <Badge className={ev.status === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>{ev.status}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{ev.source} • {new Date(ev.timestamp).toLocaleString()}</div>
                        {ev.payload && <pre className="bg-muted rounded p-2 text-xs mt-1 overflow-auto max-h-20">{JSON.stringify(ev.payload, null, 2)}</pre>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label>Test with cURL</Label>
                <pre className="bg-foreground text-background p-3 rounded font-mono text-xs overflow-x-auto mt-1">
                  {`curl -X ${viewingWh.method} ${viewingWh.url} \\\n  -H "Content-Type: application/json" \\\n  -d '{"event":"test","data":{"message":"Hello"}}'`}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
