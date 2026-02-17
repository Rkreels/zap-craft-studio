import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, RefreshCw, Clock, AlertCircle, CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TaskRun {
  id: string;
  zapName: string;
  status: "success" | "error" | "running" | "skipped";
  startTime: string;
  duration: string;
  trigger: string;
  actions: string[];
  error?: string;
  inputData?: Record<string, any>;
  outputData?: Record<string, any>;
}

const mockTasks: TaskRun[] = [
  { id: "run-1", zapName: "Gmail to Slack Alerts", status: "success", startTime: "2026-02-17T08:30:00Z", duration: "1.2s", trigger: "New Email", actions: ["Send Slack Message"], inputData: { from: "client@acme.com", subject: "Q1 Report" }, outputData: { channel: "#general", messageId: "msg_123" } },
  { id: "run-2", zapName: "Shopify Orders to Sheets", status: "success", startTime: "2026-02-17T08:15:00Z", duration: "2.1s", trigger: "New Order", actions: ["Add Row to Sheets"], inputData: { orderId: "#4521", total: "$129.99" }, outputData: { rowNumber: 342 } },
  { id: "run-3", zapName: "Stripe to QuickBooks", status: "error", startTime: "2026-02-17T08:00:00Z", duration: "3.4s", trigger: "New Payment", actions: ["Create Invoice"], error: "QuickBooks API rate limit exceeded", inputData: { paymentId: "pi_abc123", amount: "$499.00" } },
  { id: "run-4", zapName: "GitHub PR to Slack", status: "success", startTime: "2026-02-17T07:45:00Z", duration: "0.8s", trigger: "New Pull Request", actions: ["Send Channel Message"], inputData: { repo: "frontend-app", pr: "#287" }, outputData: { delivered: true } },
  { id: "run-5", zapName: "Calendly to Google Calendar", status: "success", startTime: "2026-02-17T07:30:00Z", duration: "1.5s", trigger: "New Booking", actions: ["Create Calendar Event"], inputData: { attendee: "jane@corp.com", time: "Feb 18, 2PM" }, outputData: { eventId: "evt_456" } },
  { id: "run-6", zapName: "Typeform to Salesforce", status: "success", startTime: "2026-02-17T07:15:00Z", duration: "2.8s", trigger: "New Response", actions: ["Create Lead"], inputData: { name: "Mark Johnson", email: "mark@startup.io" }, outputData: { leadId: "00Q123" } },
  { id: "run-7", zapName: "Zendesk Tickets to Slack", status: "error", startTime: "2026-02-17T07:00:00Z", duration: "1.1s", trigger: "New Ticket", actions: ["Send Message"], error: "Slack channel not found", inputData: { ticketId: "ZD-8901", subject: "Login issue" } },
  { id: "run-8", zapName: "Intercom to Asana Tasks", status: "success", startTime: "2026-02-17T06:45:00Z", duration: "1.9s", trigger: "New Conversation", actions: ["Create Task"], inputData: { userId: "usr_789", topic: "Billing question" }, outputData: { taskId: "1234567890" } },
  { id: "run-9", zapName: "Dropbox to Google Drive Sync", status: "success", startTime: "2026-02-17T06:30:00Z", duration: "4.2s", trigger: "New File", actions: ["Upload to Drive"], inputData: { file: "proposal_v3.pdf", size: "2.4MB" }, outputData: { driveId: "1BxiMVs0X" } },
  { id: "run-10", zapName: "RSS Feed to Email Digest", status: "success", startTime: "2026-02-17T06:00:00Z", duration: "3.1s", trigger: "New Feed Item", actions: ["Send Email"], inputData: { source: "TechCrunch", articles: 5 }, outputData: { recipients: 142 } },
  { id: "run-11", zapName: "WooCommerce to Mailchimp", status: "success", startTime: "2026-02-17T05:45:00Z", duration: "1.4s", trigger: "New Customer", actions: ["Add Subscriber"], inputData: { customer: "alice@shop.com" }, outputData: { listId: "abc123" } },
  { id: "run-12", zapName: "Google Forms to Trello", status: "skipped", startTime: "2026-02-17T05:30:00Z", duration: "0.3s", trigger: "New Response", actions: ["Create Card"], inputData: { duplicate: true } },
  { id: "run-13", zapName: "Twitter Mentions to Sheets", status: "error", startTime: "2026-02-17T05:15:00Z", duration: "0.9s", trigger: "New Mention", actions: ["Add Row"], error: "Twitter API authentication expired", inputData: { mention: "@brand great product!" } },
  { id: "run-14", zapName: "LinkedIn Lead to HubSpot", status: "success", startTime: "2026-02-17T05:00:00Z", duration: "2.3s", trigger: "New Lead", actions: ["Create Contact"], inputData: { name: "Sarah Chen", company: "TechCorp" }, outputData: { contactId: "ct_567" } },
  { id: "run-15", zapName: "Slack to Notion Meeting Notes", status: "success", startTime: "2026-02-17T04:45:00Z", duration: "1.7s", trigger: "New Message", actions: ["Create Page"], inputData: { channel: "#standup", messages: 12 }, outputData: { pageId: "pg_890" } },
  { id: "run-16", zapName: "Airtable to Slack Summary", status: "success", startTime: "2026-02-17T04:30:00Z", duration: "1.0s", trigger: "New Record", actions: ["Send Message"], inputData: { base: "Product Roadmap", record: "Feature X" }, outputData: { delivered: true } },
  { id: "run-17", zapName: "Notion to Google Docs", status: "running", startTime: "2026-02-17T04:15:00Z", duration: "...", trigger: "Page Updated", actions: ["Create Document"], inputData: { page: "Q1 Planning" } },
  { id: "run-18", zapName: "Trello Card to Jira Issue", status: "success", startTime: "2026-02-17T04:00:00Z", duration: "2.5s", trigger: "New Card", actions: ["Create Issue"], inputData: { card: "Fix login bug", board: "Sprint 24" }, outputData: { issueKey: "PROJ-456" } },
  { id: "run-19", zapName: "Slack Emoji to Google Sheets", status: "success", startTime: "2026-02-17T03:45:00Z", duration: "0.6s", trigger: "New Reaction", actions: ["Add Row"], inputData: { emoji: "👍", message: "Deploy approved" }, outputData: { row: 89 } },
  { id: "run-20", zapName: "HubSpot Lead to Mailchimp", status: "success", startTime: "2026-02-17T03:30:00Z", duration: "1.3s", trigger: "New Contact", actions: ["Add Subscriber"], inputData: { email: "bob@venture.co" }, outputData: { subscribed: true } },
];

export default function HistoryPage() {
  const [tasks] = useState<TaskRun[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<TaskRun | null>(null);

  const filtered = tasks.filter(t => {
    const matchSearch = t.zapName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusIcon = (s: string) => {
    if (s === "success") return <CheckCircle size={14} className="text-emerald-600" />;
    if (s === "error") return <AlertCircle size={14} className="text-red-600" />;
    if (s === "running") return <RefreshCw size={14} className="text-blue-600 animate-spin" />;
    return <XCircle size={14} className="text-muted-foreground" />;
  };

  const statusBadge = (s: string) => {
    const styles: Record<string, string> = {
      success: "bg-emerald-100 text-emerald-700",
      error: "bg-red-100 text-red-700",
      running: "bg-blue-100 text-blue-700",
      skipped: "bg-muted text-muted-foreground",
    };
    return <Badge className={styles[s] || ""}>{statusIcon(s)} <span className="ml-1 capitalize">{s}</span></Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Task History</h1>
        <p className="text-muted-foreground">View all workflow executions and their results</p>
      </div>

      <div className="mb-4 flex gap-4 text-sm text-muted-foreground">
        <span>Total: {tasks.length}</span>
        <span className="text-emerald-600">Success: {tasks.filter(t => t.status === "success").length}</span>
        <span className="text-red-600">Errors: {tasks.filter(t => t.status === "error").length}</span>
        <span className="text-blue-600">Running: {tasks.filter(t => t.status === "running").length}</span>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Search by Zap name" className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter size={16} className="mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="skipped">Skipped</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => toast({ title: "Refreshed", description: "Task history has been refreshed." })}>
          <RefreshCw size={16} />
        </Button>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Workflow</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(task => (
              <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>{statusBadge(task.status)}</TableCell>
                <TableCell>
                  <p className="font-medium">{task.zapName}</p>
                  <p className="text-xs text-muted-foreground">Trigger: {task.trigger}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Clock size={14} className="mr-1 text-muted-foreground" />
                    {new Date(task.startTime).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>{task.duration}</TableCell>
                <TableCell>
                  {task.actions.map((a, i) => <span key={i} className="text-sm block">{a}</span>)}
                  {task.error && <span className="text-xs text-red-500 block mt-1">{task.error}</span>}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedTask(task)}>
                    <Eye size={14} className="mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTask?.zapName}</DialogTitle>
            <DialogDescription>Execution details for run {selectedTask?.id}</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">{statusBadge(selectedTask.status)} <span className="text-sm text-muted-foreground">{selectedTask.duration}</span></div>
              <div>
                <h4 className="text-sm font-medium mb-1">Trigger</h4>
                <p className="text-sm text-muted-foreground">{selectedTask.trigger}</p>
              </div>
              {selectedTask.inputData && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Input Data</h4>
                  <pre className="bg-muted rounded p-3 text-xs overflow-auto max-h-32">{JSON.stringify(selectedTask.inputData, null, 2)}</pre>
                </div>
              )}
              {selectedTask.outputData && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Output Data</h4>
                  <pre className="bg-muted rounded p-3 text-xs overflow-auto max-h-32">{JSON.stringify(selectedTask.outputData, null, 2)}</pre>
                </div>
              )}
              {selectedTask.error && (
                <div>
                  <h4 className="text-sm font-medium mb-1 text-red-600">Error</h4>
                  <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{selectedTask.error}</p>
                </div>
              )}
              <div className="text-xs text-muted-foreground">Started: {new Date(selectedTask.startTime).toLocaleString()}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
