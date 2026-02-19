import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Zap, Users, TrendingUp, Clock, ArrowRight, Sparkles, DollarSign, Code, MessageSquare, BarChart2, ShoppingCart, Mail, Globe, Lock } from "lucide-react";
import { mockApps } from "@/data/mockApps";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ALL_TEMPLATES = [
  { id: "t1", name: "Gmail to Slack Alerts", description: "Send a Slack message whenever you receive a new email in Gmail matching a filter", uses: 24800, rating: 4.9, category: "productivity", apps: ["Gmail", "Slack"], difficulty: "Easy", timeToSetup: "2 min", icon: "📧" },
  { id: "t2", name: "Google Sheets to Slack", description: "Post Slack notifications when new rows are added to a Google Sheets spreadsheet", uses: 19500, rating: 4.8, category: "productivity", apps: ["Google Sheets", "Slack"], difficulty: "Easy", timeToSetup: "3 min", icon: "📊" },
  { id: "t3", name: "Shopify Orders to Google Sheets", description: "Log every new Shopify order into a Google Sheets row for tracking and reporting", uses: 32100, rating: 4.9, category: "ecommerce", apps: ["Shopify", "Google Sheets"], difficulty: "Easy", timeToSetup: "4 min", icon: "🛒" },
  { id: "t4", name: "Stripe Payments to QuickBooks", description: "Automatically create QuickBooks invoices for every successful Stripe payment", uses: 14200, rating: 4.8, category: "finance", apps: ["Stripe", "QuickBooks"], difficulty: "Medium", timeToSetup: "7 min", icon: "💳" },
  { id: "t5", name: "Typeform to Salesforce Leads", description: "Create or update Salesforce leads when a new Typeform response is submitted", uses: 11800, rating: 4.7, category: "sales", apps: ["Typeform", "Salesforce"], difficulty: "Medium", timeToSetup: "6 min", icon: "📋" },
  { id: "t6", name: "Calendly to HubSpot Contacts", description: "Add new Calendly invitees as contacts in HubSpot CRM with meeting details", uses: 9400, rating: 4.7, category: "sales", apps: ["Calendly", "HubSpot"], difficulty: "Easy", timeToSetup: "4 min", icon: "📅" },
  { id: "t7", name: "GitHub PRs to Slack", description: "Notify your team in Slack whenever a new pull request is opened on GitHub", uses: 28600, rating: 4.9, category: "devops", apps: ["GitHub", "Slack"], difficulty: "Easy", timeToSetup: "2 min", icon: "🔧" },
  { id: "t8", name: "Jira Tickets to Notion", description: "Create a Notion page for every new Jira issue to keep your knowledge base in sync", uses: 7200, rating: 4.6, category: "productivity", apps: ["Jira", "Notion"], difficulty: "Medium", timeToSetup: "8 min", icon: "📝" },
  { id: "t9", name: "Mailchimp Subscriber to Airtable", description: "Add every new Mailchimp subscriber to an Airtable base for segmentation", uses: 8900, rating: 4.6, category: "marketing", apps: ["Mailchimp", "Airtable"], difficulty: "Easy", timeToSetup: "3 min", icon: "📬" },
  { id: "t10", name: "Zendesk Ticket to Asana Task", description: "Create an Asana task for every new high-priority Zendesk support ticket", uses: 6700, rating: 4.7, category: "support", apps: ["Zendesk", "Asana"], difficulty: "Medium", timeToSetup: "6 min", icon: "🎫" },
  { id: "t11", name: "Slack to Trello Cards", description: "Turn specific Slack messages into Trello cards with a simple emoji reaction", uses: 21300, rating: 4.8, category: "productivity", apps: ["Slack", "Trello"], difficulty: "Easy", timeToSetup: "3 min", icon: "📌" },
  { id: "t12", name: "WooCommerce to Mailchimp", description: "Sync new WooCommerce customers to a Mailchimp audience list automatically", uses: 16400, rating: 4.8, category: "ecommerce", apps: ["WooCommerce", "Mailchimp"], difficulty: "Easy", timeToSetup: "4 min", icon: "🏪" },
  { id: "t13", name: "Twitter Mentions to Google Sheets", description: "Log all brand mentions from Twitter into a Google Sheets tracker in real time", uses: 10200, rating: 4.5, category: "marketing", apps: ["Twitter", "Google Sheets"], difficulty: "Easy", timeToSetup: "3 min", icon: "🐦" },
  { id: "t14", name: "Stripe Refund to Slack Alert", description: "Get instant Slack alerts whenever a refund is issued in your Stripe account", uses: 5600, rating: 4.7, category: "finance", apps: ["Stripe", "Slack"], difficulty: "Easy", timeToSetup: "2 min", icon: "💰" },
  { id: "t15", name: "LinkedIn Leads to CRM", description: "Capture LinkedIn Lead Gen Form submissions directly into your CRM as new leads", uses: 8100, rating: 4.6, category: "sales", apps: ["LinkedIn", "Salesforce"], difficulty: "Medium", timeToSetup: "5 min", icon: "💼" },
  { id: "t16", name: "GitHub Actions to Datadog", description: "Send GitHub Actions deployment events to Datadog for monitoring and alerting", uses: 4300, rating: 4.8, category: "devops", apps: ["GitHub", "Datadog"], difficulty: "Hard", timeToSetup: "12 min", icon: "📡" },
  { id: "t17", name: "Intercom to Notion Notes", description: "Save key Intercom conversations as Notion pages for your support knowledge base", uses: 3800, rating: 4.6, category: "support", apps: ["Intercom", "Notion"], difficulty: "Medium", timeToSetup: "7 min", icon: "💬" },
  { id: "t18", name: "Google Forms to Asana", description: "Convert Google Form submissions into Asana tasks for your team to action", uses: 13700, rating: 4.7, category: "productivity", apps: ["Google Forms", "Asana"], difficulty: "Easy", timeToSetup: "3 min", icon: "✅" },
  { id: "t19", name: "Shopify Abandoned Cart Email", description: "Send a follow-up email via Mailchimp when a Shopify cart is abandoned", uses: 22900, rating: 4.9, category: "ecommerce", apps: ["Shopify", "Mailchimp"], difficulty: "Medium", timeToSetup: "8 min", icon: "🛍️" },
  { id: "t20", name: "RSS Feed to Twitter", description: "Automatically post new RSS feed items from your blog to your Twitter account", uses: 17600, rating: 4.6, category: "marketing", apps: ["RSS", "Twitter"], difficulty: "Easy", timeToSetup: "2 min", icon: "📡" },
];

const CATEGORIES = [
  { id: "all", name: "All", icon: Sparkles },
  { id: "productivity", name: "Productivity", icon: Zap },
  { id: "marketing", name: "Marketing", icon: TrendingUp },
  { id: "sales", name: "Sales", icon: DollarSign },
  { id: "finance", name: "Finance", icon: BarChart2 },
  { id: "ecommerce", name: "E-Commerce", icon: ShoppingCart },
  { id: "devops", name: "DevOps", icon: Code },
  { id: "support", name: "Support", icon: MessageSquare },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-sky-100 text-sky-700",
  Hard: "bg-purple-100 text-purple-700",
};

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const filteredApps = mockApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "all" || app.category?.toLowerCase() === selectedCategory)
  );

  const filteredTemplates = ALL_TEMPLATES.filter(t =>
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     t.apps.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (selectedCategory === "all" || t.category === selectedCategory)
  );

  const handleUseTemplate = (template: typeof ALL_TEMPLATES[0]) => {
    toast({
      title: "Template Loading",
      description: `Setting up "${template.name}" — redirecting to Zap creator…`,
    });
    navigate("/zaps/create", { state: { template } });
  };

  const handleAppSelect = (app: any) => {
    toast({
      title: `${app.name} selected`,
      description: "Opening workflow builder with this app as trigger…",
    });
    navigate("/zaps/create", { state: { app } });
  };

  const featuredTemplate = ALL_TEMPLATES[0];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Discover</h1>
        <p className="text-muted-foreground">Explore 20+ templates and 1,000+ apps to automate your workflows</p>
      </div>

      {/* Hero Banner */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent border border-primary/20 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <Badge className="mb-2 bg-primary/20 text-primary border-0">⭐ Most Popular</Badge>
          <h2 className="text-xl font-bold mb-1">{featuredTemplate.name}</h2>
          <p className="text-muted-foreground text-sm max-w-md">{featuredTemplate.description}</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users size={14} />{featuredTemplate.uses.toLocaleString()} uses</span>
            <span className="flex items-center gap-1"><Star size={14} className="fill-primary text-primary" />{featuredTemplate.rating}</span>
            <span className="flex items-center gap-1"><Clock size={14} />{featuredTemplate.timeToSetup}</span>
          </div>
        </div>
        <Button size="lg" onClick={() => handleUseTemplate(featuredTemplate)} className="shrink-0">
          <Zap size={16} className="mr-2" /> Use Template
        </Button>
      </div>

      {/* Search */}
      <div className="mb-5 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search templates, apps, workflows…"
          className="pl-10"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {CATEGORIES.map(cat => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
            className="whitespace-nowrap gap-1.5"
          >
            <cat.icon size={14} />
            {cat.name}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">
            <TrendingUp size={15} className="mr-1.5" />
            Templates ({filteredTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="apps">
            <Globe size={15} className="mr-1.5" />
            Apps ({filteredApps.length})
          </TabsTrigger>
        </TabsList>

        {/* TEMPLATES TAB */}
        <TabsContent value="templates" className="mt-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-2">No templates found for "{searchQuery}"</p>
              <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>Clear filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTemplates.map(t => (
                <Card key={t.id} className="hover:shadow-lg transition-all border hover:border-primary/40 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.icon}</span>
                        <div>
                          <CardTitle className="text-base leading-snug">{t.name}</CardTitle>
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1 shrink-0 text-xs">
                        <Star size={10} className="fill-primary text-primary" />
                        {t.rating}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm mt-1 line-clamp-2">{t.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {t.apps.map((app, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{app}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Users size={12} />{t.uses.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{t.timeToSetup}</span>
                      </div>
                      <Badge className={`text-xs border-0 ${DIFFICULTY_COLORS[t.difficulty]}`}>{t.difficulty}</Badge>
                    </div>
                    <Button size="sm" className="w-full gap-1" onClick={() => handleUseTemplate(t)}>
                      <Zap size={13} /> Use Template <ArrowRight size={13} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* APPS TAB */}
        <TabsContent value="apps" className="mt-6">
          {filteredApps.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-2">No apps found for "{searchQuery}"</p>
              <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>Clear filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredApps.map(app => (
                <Card
                  key={app.id}
                  className="hover:shadow-md transition-all cursor-pointer hover:scale-105 hover:border-primary/40 border"
                  onClick={() => handleAppSelect(app)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-xl ${app.color || "bg-muted"} flex items-center justify-center text-white mb-2 shadow-sm`}>
                      {app.icon}
                    </div>
                    <h3 className="font-medium text-sm leading-tight mb-1">{app.name}</h3>
                    {app.popular && (
                      <Badge variant="secondary" className="text-xs px-1.5">
                        <TrendingUp size={9} className="mr-0.5" /> Popular
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
