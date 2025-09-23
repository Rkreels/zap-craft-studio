import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Key,
  Globe,
  Smartphone,
  Mail,
  Save,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    profile: {
      name: "John Doe",
      email: "john.doe@example.com",
      timezone: "America/New_York",
      language: "en"
    },
    notifications: {
      email: true,
      push: false,
      workflows: true,
      marketing: false
    },
    privacy: {
      analytics: true,
      errorReporting: true,
      dataSharing: false
    },
    api: {
      key: "zap_*******************xyz",
      webhookUrl: "https://hooks.zapier.com/hooks/catch/xyz"
    }
  });

  const handleSave = (section: string) => {
    // Save settings to localStorage
    localStorage.setItem('zapier_settings', JSON.stringify(settings));
    
    toast({
      title: "Settings Saved",
      description: `Your ${section} settings have been saved successfully.`,
    });
  };

  const handleResetApiKey = () => {
    const newKey = `zap_${Math.random().toString(36).substr(2, 20)}xyz`;
    setSettings(prev => ({
      ...prev,
      api: { ...prev.api, key: newKey }
    }));
    
    toast({
      title: "API Key Reset",
      description: "A new API key has been generated.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, name: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, email: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="w-full px-3 py-2 border border-input rounded-md"
                    value={settings.profile.timezone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, timezone: e.target.value }
                    }))}
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full px-3 py-2 border border-input rounded-md"
                    value={settings.profile.language}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, language: e.target.value }
                    }))}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
              <Button onClick={() => handleSave('profile')} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: checked }
                  }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive push notifications on your devices
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: checked }
                  }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Workflow Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Get notified when workflows run or fail
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.workflows}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, workflows: checked }
                  }))}
                />
              </div>
              <Button onClick={() => handleSave('notifications')} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Notifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Analytics</Label>
                  <div className="text-sm text-muted-foreground">
                    Help us improve by sharing usage analytics
                  </div>
                </div>
                <Switch
                  checked={settings.privacy.analytics}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, analytics: checked }
                  }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Error Reporting</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically send error reports to help us fix issues
                  </div>
                </div>
                <Switch
                  checked={settings.privacy.errorReporting}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, errorReporting: checked }
                  }))}
                />
              </div>
              <Button onClick={() => handleSave('privacy')} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your subscription and billing details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Pro Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    $20/month • Next billing: Dec 15, 2024
                  </p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">View Invoices</Button>
                <Button variant="outline">Update Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Manage your API keys and webhook settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    value={settings.api.key}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={handleResetApiKey}
                  >
                    Reset
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use this key to authenticate API requests
                </p>
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input
                  value={settings.api.webhookUrl}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    api: { ...prev.api, webhookUrl: e.target.value }
                  }))}
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave('api')} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save API Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;