
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Plus } from "lucide-react";
import { mockApps } from "@/data/mockApps";
import { AppSelector, AppItem } from "@/components/zap-creator/AppSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ExploreApps() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Mock categories
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "email", name: "Email" },
    { id: "productivity", name: "Productivity" },
    { id: "social", name: "Social Media" },
    { id: "crm", name: "CRM" },
  ];

  // Filter apps based on search query and category
  const filteredApps = mockApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || true; // Mock category filtering
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <div className="flex flex-col space-y-4 mb-6">
        <h1 className="text-2xl font-bold">Explore Apps</h1>
        <p className="text-gray-500">
          Browse our library of 3,000+ apps that you can connect to automate your work.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search for apps..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <div className="flex items-center">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Popular Apps</CardTitle>
          <CardDescription>
            Commonly used apps by Zapier users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mockApps
              .filter(app => app.popular)
              .map(app => (
                <AppCard key={app.id} app={app} />
              ))}
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">All Apps</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredApps.map(app => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

interface AppCardProps {
  app: AppItem;
}

const AppCard = ({ app }: AppCardProps) => {
  const bgColor = app.color || 'bg-gray-100';
  
  return (
    <Card className="border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
      <CardContent className="p-4 flex flex-col items-center">
        <div className={`w-14 h-14 rounded-md ${bgColor} flex items-center justify-center text-white font-bold mb-3`}>
          {app.icon}
        </div>
        <h3 className="font-medium text-center mb-1">{app.name}</h3>
        {app.description && (
          <p className="text-xs text-gray-500 text-center mb-3">{app.description}</p>
        )}
        <Button variant="outline" size="sm" className="w-full mt-auto">
          <Plus size={14} className="mr-1" />
          Add
        </Button>
      </CardContent>
    </Card>
  );
};
