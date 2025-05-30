
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Bot, Play, Pause, Settings, MessageSquare, Zap } from "lucide-react";

export default function AgentsPage() {
  const [agents, setAgents] = useState([
    {
      id: "1",
      name: "Customer Support Agent",
      description: "Automatically responds to customer inquiries and routes complex issues to human agents",
      status: "active",
      triggers: 247,
      lastActive: "2 minutes ago",
      type: "chatbot"
    },
    {
      id: "2",
      name: "Lead Qualification Agent", 
      description: "Qualifies incoming leads and updates CRM with contact information",
      status: "paused",
      triggers: 156,
      lastActive: "1 hour ago",
      type: "workflow"
    },
    {
      id: "3",
      name: "Social Media Monitor",
      description: "Monitors brand mentions across social platforms and alerts the marketing team",
      status: "active",
      triggers: 89,
      lastActive: "5 minutes ago",
      type: "monitoring"
    }
  ]);

  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === "active" ? "paused" : "active" }
        : agent
    ));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Agents</h1>
          <p className="text-gray-600">Intelligent agents that work autonomously to automate complex tasks</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Create Agent
        </Button>
      </div>

      {/* Agent Templates */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Agent Templates</CardTitle>
          <CardDescription>Get started quickly with pre-built intelligent agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:border-purple-300 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Customer Service</h3>
                  <p className="text-sm text-gray-500">Handle customer inquiries</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Use Template
              </Button>
            </div>

            <div className="border rounded-lg p-4 hover:border-purple-300 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Lead Processing</h3>
                  <p className="text-sm text-gray-500">Qualify and route leads</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Use Template
              </Button>
            </div>

            <div className="border rounded-lg p-4 hover:border-purple-300 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bot className="text-purple-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Data Analysis</h3>
                  <p className="text-sm text-gray-500">Analyze and report on data</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Agents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Agents</h2>
        {agents.map(agent => (
          <Card key={agent.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Bot className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
                    <p className="text-gray-600 mb-2">{agent.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{agent.triggers} triggers</span>
                      <span>Last active: {agent.lastActive}</span>
                      <Badge 
                        variant={agent.status === "active" ? "default" : "secondary"}
                        className={agent.status === "active" ? "bg-green-100 text-green-700" : ""}
                      >
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAgentStatus(agent.id)}
                    className="gap-1"
                  >
                    {agent.status === "active" ? (
                      <>
                        <Pause size={14} />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
