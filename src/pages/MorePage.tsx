import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  HelpCircle,
  FileText,
  Shield,
  Users,
  MessageSquare,
  ExternalLink,
  Download,
  Smartphone,
  Chrome,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const MorePage = () => {
  const moreItems = [
    {
      title: "Account Settings",
      description: "Manage your account preferences and billing",
      icon: Settings,
      href: "/settings",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Help Center",
      description: "Get help and learn how to use Zapier",
      icon: HelpCircle,
      href: "https://help.zapier.com",
      color: "bg-green-100 text-green-600",
      external: true
    },
    {
      title: "Documentation",
      description: "API docs and developer resources",
      icon: FileText,
      href: "https://zapier.com/developer",
      color: "bg-purple-100 text-purple-600",
      external: true
    },
    {
      title: "Security",
      description: "Learn about our security practices",
      icon: Shield,
      href: "https://zapier.com/security",
      color: "bg-red-100 text-red-600",
      external: true
    },
    {
      title: "Community",
      description: "Join the Zapier community",
      icon: Users,
      href: "https://community.zapier.com",
      color: "bg-yellow-100 text-yellow-600",
      external: true
    },
    {
      title: "Contact Support",
      description: "Get in touch with our support team",
      icon: MessageSquare,
      href: "https://zapier.com/contact",
      color: "bg-indigo-100 text-indigo-600",
      external: true
    },
    {
      title: "Mobile App",
      description: "Download the Zapier mobile app",
      icon: Smartphone,
      href: "https://zapier.com/mobile",
      color: "bg-pink-100 text-pink-600",
      external: true
    },
    {
      title: "Browser Extension",
      description: "Install the Zapier browser extension",
      icon: Chrome,
      href: "https://zapier.com/chrome",
      color: "bg-orange-100 text-orange-600",
      external: true
    },
    {
      title: "Website",
      description: "Visit the main Zapier website",
      icon: Globe,
      href: "https://zapier.com",
      color: "bg-cyan-100 text-cyan-600",
      external: true
    }
  ];

  const resources = [
    {
      title: "Zapier Blog",
      description: "Tips, tricks, and automation inspiration",
      href: "https://zapier.com/blog"
    },
    {
      title: "Zapier University",
      description: "Free automation courses and certifications",
      href: "https://zapier.com/university"
    },
    {
      title: "Zapier for Teams",
      description: "Learn about team collaboration features",
      href: "https://zapier.com/teams"
    },
    {
      title: "Status Page",
      description: "Check Zapier service status",
      href: "https://status.zapier.com"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">More</h1>
        <p className="text-muted-foreground">
          Additional resources, settings, and helpful links
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moreItems.map((item) => {
          const IconComponent = item.icon;
          const CardContent = (
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  {item.external && (
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          );

          return item.external ? (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {CardContent}
            </a>
          ) : (
            <Link key={item.title} to={item.href} className="block">
              {CardContent}
            </Link>
          );
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <Card key={resource.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {resource.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <a
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Get the Apps</h3>
            <p className="text-sm text-muted-foreground">
              Take Zapier with you wherever you go
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://apps.apple.com/app/zapier/id1265746047"
              target="_blank"
              rel="noopener noreferrer"
            >
              iOS App
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://play.google.com/store/apps/details?id=com.zapier.android"
              target="_blank"
              rel="noopener noreferrer"
            >
              Android App
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://chrome.google.com/webstore/detail/zapier/ngghlnfmdgnpegcmbpgehkbhkhkbkjpj"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome Extension
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MorePage;