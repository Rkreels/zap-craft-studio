import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Code,
  Play,
  Plus,
  Settings,
  FileText,
  Clock,
  Activity,
  Zap,
  Terminal,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FunctionsPage = () => {
  const { toast } = useToast();
  const [functions, setFunctions] = useState([
    {
      id: "fn-1",
      name: "Data Validator",
      description: "Validates email addresses and phone numbers",
      runtime: "Node.js 18",
      status: "active",
      lastRun: "2 hours ago",
      code: `function validateData(input) {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  const phoneRegex = /^\\+?[1-9]\\d{1,14}$/;
  
  return {
    email: emailRegex.test(input.email),
    phone: phoneRegex.test(input.phone)
  };
}`
    },
    {
      id: "fn-2",
      name: "Text Formatter",
      description: "Formats text for consistent output",
      runtime: "Python 3.9",
      status: "active",
      lastRun: "1 day ago",
      code: `def format_text(input_data):
    text = input_data.get('text', '')
    
    # Clean and format text
    formatted = text.strip().title()
    
    return {
        'formatted_text': formatted,
        'character_count': len(formatted),
        'word_count': len(formatted.split())
    }`
    }
  ]);

  const [selectedFunction, setSelectedFunction] = useState(functions[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [newFunction, setNewFunction] = useState({
    name: "",
    description: "",
    runtime: "Node.js 18",
    code: ""
  });

  const handleRunFunction = (func: any) => {
    toast({
      title: "Function Executed",
      description: `${func.name} has been executed successfully.`,
    });
  };

  const handleSaveFunction = () => {
    if (isEditing) {
      setFunctions(functions.map(f => 
        f.id === selectedFunction.id ? selectedFunction : f
      ));
      setIsEditing(false);
      toast({
        title: "Function Updated",
        description: "Your function has been saved.",
      });
    } else {
      const newFunc = {
        ...newFunction,
        id: `fn-${Date.now()}`,
        status: "active",
        lastRun: "Never"
      };
      setFunctions([...functions, newFunc]);
      setNewFunction({ name: "", description: "", runtime: "Node.js 18", code: "" });
      toast({
        title: "Function Created",
        description: "Your new function has been created.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Functions</h1>
          <p className="text-muted-foreground">
            Create and manage custom code functions for your workflows
          </p>
        </div>
        <Button onClick={() => setIsEditing(false)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Function
        </Button>
      </div>

      <Tabs defaultValue="functions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="functions">My Functions</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="functions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Functions</h2>
              {functions.map((func) => (
                <Card 
                  key={func.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedFunction.id === func.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedFunction(func)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{func.name}</CardTitle>
                        <CardDescription>{func.description}</CardDescription>
                      </div>
                      <Badge variant={func.status === 'active' ? 'default' : 'secondary'}>
                        {func.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{func.runtime}</span>
                      <span>Last run: {func.lastRun}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Function Editor</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRunFunction(selectedFunction)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    {selectedFunction.name}
                  </CardTitle>
                  <CardDescription>{selectedFunction.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing && (
                    <div className="space-y-4">
                      <div>
                        <Label>Function Name</Label>
                        <Input
                          value={selectedFunction.name}
                          onChange={(e) => setSelectedFunction({
                            ...selectedFunction,
                            name: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={selectedFunction.description}
                          onChange={(e) => setSelectedFunction({
                            ...selectedFunction,
                            description: e.target.value
                          })}
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <Label>Code</Label>
                    <Textarea
                      value={selectedFunction.code}
                      onChange={(e) => setSelectedFunction({
                        ...selectedFunction,
                        code: e.target.value
                      })}
                      className="font-mono text-sm min-h-[300px]"
                      readOnly={!isEditing}
                    />
                  </div>
                  {isEditing && (
                    <Button onClick={handleSaveFunction} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Function
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Function</CardTitle>
              <CardDescription>
                Write custom code to process data in your workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Function Name</Label>
                  <Input
                    value={newFunction.name}
                    onChange={(e) => setNewFunction({
                      ...newFunction,
                      name: e.target.value
                    })}
                    placeholder="e.g., Data Processor"
                  />
                </div>
                <div>
                  <Label>Runtime</Label>
                  <select
                    className="w-full px-3 py-2 border border-input rounded-md"
                    value={newFunction.runtime}
                    onChange={(e) => setNewFunction({
                      ...newFunction,
                      runtime: e.target.value
                    })}
                  >
                    <option value="Node.js 18">Node.js 18</option>
                    <option value="Python 3.9">Python 3.9</option>
                    <option value="Python 3.11">Python 3.11</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={newFunction.description}
                  onChange={(e) => setNewFunction({
                    ...newFunction,
                    description: e.target.value
                  })}
                  placeholder="Describe what this function does"
                />
              </div>
              <div>
                <Label>Code</Label>
                <Textarea
                  value={newFunction.code}
                  onChange={(e) => setNewFunction({
                    ...newFunction,
                    code: e.target.value
                  })}
                  className="font-mono text-sm min-h-[300px]"
                  placeholder="// Write your function code here
function processData(input) {
  // Your logic here
  return { result: 'processed' };
}"
                />
              </div>
              <Button onClick={handleSaveFunction} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Create Function
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Email Validator",
                description: "Validate email addresses",
                runtime: "Node.js",
                category: "Data Processing"
              },
              {
                name: "Text Transformer",
                description: "Transform text case and format",
                runtime: "Python",
                category: "Text Processing"
              },
              {
                name: "Date Calculator",
                description: "Calculate dates and time differences",
                runtime: "Node.js",
                category: "Utilities"
              }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <Button size="sm" variant="outline">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FunctionsPage;