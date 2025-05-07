
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, RefreshCw, Clock, AlertCircle, CheckCircle } from "lucide-react";

// Mock data for task history
const mockTasks = [
  {
    id: "task-1",
    zapName: "Gmail to Slack",
    status: "success",
    startTime: "2025-05-07T10:30:00Z",
    duration: "2.5s",
    trigger: "New Email",
    actions: ["Send Slack Message"],
  },
  {
    id: "task-2",
    zapName: "Twitter to Sheets",
    status: "error",
    startTime: "2025-05-07T09:15:00Z",
    duration: "1.8s",
    trigger: "New Tweet",
    actions: ["Add Row to Google Sheets"],
    error: "API rate limit exceeded"
  },
  {
    id: "task-3",
    zapName: "Trello to Gmail",
    status: "success",
    startTime: "2025-05-07T08:45:00Z",
    duration: "3.2s",
    trigger: "New Card",
    actions: ["Send Email"],
  },
  {
    id: "task-4",
    zapName: "Shopify to MailChimp",
    status: "success",
    startTime: "2025-05-06T22:10:00Z",
    duration: "2.1s",
    trigger: "New Order",
    actions: ["Add Subscriber", "Send Campaign"],
  },
  {
    id: "task-5",
    zapName: "Calendly to Notion",
    status: "error",
    startTime: "2025-05-06T20:30:00Z",
    duration: "4.0s",
    trigger: "New Event",
    actions: ["Create Page in Notion"],
    error: "Authentication failed"
  },
];

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter tasks based on search and status filter
  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.zapName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Task History</h1>
        <p className="text-gray-600">View and manage all your Zap executions</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by Zap name"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter size={16} className="mr-2 text-gray-500" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      {/* Tasks table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Zap</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map(task => (
              <TableRow key={task.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>
                  {task.status === "success" ? (
                    <Badge className="bg-green-100 text-green-700 border border-green-200">
                      <CheckCircle size={14} className="mr-1" />
                      Success
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border border-red-200">
                      <AlertCircle size={14} className="mr-1" />
                      Error
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{task.zapName}</p>
                    <p className="text-xs text-gray-500">Trigger: {task.trigger}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1 text-gray-500" />
                    <span>{formatDate(task.startTime)}</span>
                  </div>
                </TableCell>
                <TableCell>{task.duration}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    {task.actions.map((action, index) => (
                      <span key={index} className="text-sm">{action}</span>
                    ))}
                    {task.error && (
                      <span className="text-xs text-red-500 mt-1">{task.error}</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
