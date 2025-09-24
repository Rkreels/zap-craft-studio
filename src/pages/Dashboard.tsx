
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Table, Layout, MessageSquare, PenTool } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { GetStartedCard } from "@/components/dashboard/GetStartedCard";
import { TemplateSection } from "@/components/dashboard/TemplateSection";
import { toast } from "@/components/ui/use-toast";

export default function Dashboard() {
  // Handle clicks on features that aren't fully implemented
  const handleFeatureClick = (feature: string, path: string) => {
    // Check if the page exists in our routes
    if (path === "/tables/create" || path === "/canvas/create") {
      toast({
        title: `${feature} Coming Soon`,
        description: `The ${feature.toLowerCase()} feature is under development. Please check back later!`,
        variant: "default",
      });
      return false; // Prevent navigation
    }
    return true; // Allow navigation
  };

  const featureCards = [
    {
      title: "Zap",
      description: "Automated workflows",
      icon: Zap,
      path: "/zaps/create",
    },
    {
      title: "Table",
      description: "Automated data",
      icon: Table,
      path: "/tables", // Changed from "/tables/create" to "/tables"
    },
    {
      title: "Interface",
      description: "Apps, forms, and pages",
      icon: Layout,
      path: "/interfaces",
    },
    {
      title: "Chatbot",
      description: "AI-powered chatbot",
      icon: MessageSquare,
      path: "/chatbot",
    },
    {
      title: "Canvas",
      description: "Process visualization",
      icon: PenTool,
      path: "/webhooks", // Changed from "/canvas/create" to "/webhooks" as a workaround
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-3xl font-bold">What would you like to automate?</h1>
          <Badge className="bg-purple-600 text-white">AI Beta</Badge>
        </div>
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-foreground">
            <span className="font-semibold text-primary">Example:</span> When I add a reaction to Slack, send an email via Gmail
          </p>
        </div>
      </div>

      {/* Start from scratch section */}
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featureCards.map((card) => (
            <FeatureCard
              key={card.title}
              title={card.title}
              description={card.description}
              icon={card.icon}
              path={card.path}
              onClick={() => handleFeatureClick(card.title, card.path)}
            />
          ))}
        </div>
      </section>

      {/* Get started section */}
      <section className="mb-10">
        <GetStartedCard />
      </section>

      {/* Popular templates section */}
      <section className="mb-10">
        <TemplateSection />
      </section>
    </div>
  );
}
