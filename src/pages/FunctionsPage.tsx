import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, Play, Plus, Trash2, Edit, Save, Copy, Search, Terminal, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FunctionItem {
  id: string;
  name: string;
  description: string;
  runtime: string;
  status: "active" | "draft" | "error";
  lastRun: string;
  runs: number;
  code: string;
  createdAt: string;
}

const defaultCode: Record<string, string> = {
  "Node.js 18": `function processData(input) {\n  // Your logic here\n  return { result: 'processed', input };\n}`,
  "Python 3.11": `def process_data(input_data):\n    # Your logic here\n    return {"result": "processed", "input": input_data}`,
};

const initialFunctions: FunctionItem[] = [
  { id: "fn-1", name: "Email Validator", description: "Validates email addresses and domains", runtime: "Node.js 18", status: "active", lastRun: "2026-02-17T08:30:00Z", runs: 4567, code: `function validate(input) {\n  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return { valid: regex.test(input.email), email: input.email };\n}`, createdAt: "2025-06-10T08:00:00Z" },
  { id: "fn-2", name: "Text Formatter", description: "Formats and cleans text content", runtime: "Node.js 18", status: "active", lastRun: "2026-02-17T07:45:00Z", runs: 3210, code: `function format(input) {\n  return {\n    formatted: input.text.trim().replace(/\\s+/g, ' '),\n    wordCount: input.text.split(' ').length\n  };\n}`, createdAt: "2025-07-15T10:00:00Z" },
  { id: "fn-3", name: "Date Calculator", description: "Calculates date differences and formats", runtime: "Node.js 18", status: "active", lastRun: "2026-02-17T06:15:00Z", runs: 1890, code: `function calcDate(input) {\n  const d1 = new Date(input.start);\n  const d2 = new Date(input.end);\n  const diff = Math.abs(d2 - d1);\n  return { days: Math.ceil(diff / 86400000) };\n}`, createdAt: "2025-08-20T09:00:00Z" },
  { id: "fn-4", name: "JSON Transformer", description: "Transforms JSON data between formats", runtime: "Node.js 18", status: "active", lastRun: "2026-02-17T05:30:00Z", runs: 5670, code: `function transform(input) {\n  return Object.entries(input.data).map(([k,v]) => ({key:k, value:v}));\n}`, createdAt: "2025-05-05T11:00:00Z" },
  { id: "fn-5", name: "Phone Number Parser", description: "Parses and formats phone numbers", runtime: "Node.js 18", status: "active", lastRun: "2026-02-17T04:20:00Z", runs: 2340, code: `function parsePhone(input) {\n  const cleaned = input.phone.replace(/\\D/g, '');\n  return { formatted: cleaned.length === 10 ? \`(\${cleaned.slice(0,3)}) \${cleaned.slice(3,6)}-\${cleaned.slice(6)}\` : cleaned };\n}`, createdAt: "2025-09-01T13:00:00Z" },
  { id: "fn-6", name: "CSV Parser", description: "Parses CSV strings into JSON objects", runtime: "Node.js 18", status: "active", lastRun: "2026-02-16T22:00:00Z", runs: 1230, code: `function parseCSV(input) {\n  const lines = input.csv.split('\\n');\n  const headers = lines[0].split(',');\n  return lines.slice(1).map(l => {\n    const vals = l.split(',');\n    return headers.reduce((o,h,i) => ({...o,[h]:vals[i]}), {});\n  });\n}`, createdAt: "2025-10-08T10:00:00Z" },
  { id: "fn-7", name: "Slug Generator", description: "Creates URL-safe slugs from text", runtime: "Node.js 18", status: "active", lastRun: "2026-02-16T18:30:00Z", runs: 890, code: `function slugify(input) {\n  return { slug: input.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') };\n}`, createdAt: "2025-11-12T14:00:00Z" },
  { id: "fn-8", name: "Currency Converter", description: "Converts between currencies using fixed rates", runtime: "Node.js 18", status: "active", lastRun: "2026-02-16T15:00:00Z", runs: 3450, code: `function convert(input) {\n  const rates = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5 };\n  const result = input.amount * (rates[input.to] / rates[input.from]);\n  return { amount: result.toFixed(2), currency: input.to };\n}`, createdAt: "2025-04-12T08:00:00Z" },
  { id: "fn-9", name: "HTML Stripper", description: "Removes HTML tags from text content", runtime: "Node.js 18", status: "draft", lastRun: "Never", runs: 0, code: `function stripHTML(input) {\n  return { text: input.html.replace(/<[^>]*>/g, '') };\n}`, createdAt: "2025-12-01T10:00:00Z" },
  { id: "fn-10", name: "Password Generator", description: "Generates secure random passwords", runtime: "Node.js 18", status: "active", lastRun: "2026-02-16T12:00:00Z", runs: 567, code: `function genPassword(input) {\n  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';\n  let pw = '';\n  for (let i = 0; i < (input.length || 16); i++) pw += chars[Math.floor(Math.random() * chars.length)];\n  return { password: pw };\n}`, createdAt: "2025-06-25T11:00:00Z" },
  { id: "fn-11", name: "Data Aggregator", description: "Aggregates numerical data from arrays", runtime: "Python 3.11", status: "active", lastRun: "2026-02-17T03:15:00Z", runs: 2100, code: `def aggregate(input_data):\n    nums = input_data.get('numbers', [])\n    return {"sum": sum(nums), "avg": sum(nums)/len(nums) if nums else 0, "count": len(nums)}`, createdAt: "2025-08-05T08:00:00Z" },
  { id: "fn-12", name: "Sentiment Scorer", description: "Basic sentiment analysis on text", runtime: "Python 3.11", status: "active", lastRun: "2026-02-16T20:00:00Z", runs: 1560, code: `def score_sentiment(input_data):\n    text = input_data.get('text', '').lower()\n    pos = ['good','great','amazing','love','excellent']\n    neg = ['bad','terrible','hate','awful','poor']\n    score = sum(1 for w in pos if w in text) - sum(1 for w in neg if w in text)\n    return {"score": score, "label": "positive" if score > 0 else "negative" if score < 0 else "neutral"}`, createdAt: "2025-07-22T09:00:00Z" },
  { id: "fn-13", name: "URL Shortener Hash", description: "Generates short hashes for URLs", runtime: "Node.js 18", status: "active", lastRun: "2026-02-15T14:00:00Z", runs: 780, code: `function shorten(input) {\n  let hash = 0;\n  for (let i = 0; i < input.url.length; i++) hash = ((hash << 5) - hash) + input.url.charCodeAt(i);\n  return { hash: Math.abs(hash).toString(36).slice(0,7) };\n}`, createdAt: "2025-09-15T14:00:00Z" },
  { id: "fn-14", name: "Array Deduplicator", description: "Removes duplicates from arrays", runtime: "Node.js 18", status: "active", lastRun: "2026-02-14T09:00:00Z", runs: 456, code: `function dedupe(input) {\n  return { unique: [...new Set(input.items)], removed: input.items.length - new Set(input.items).size };\n}`, createdAt: "2025-10-28T11:00:00Z" },
  { id: "fn-15", name: "Markdown to Text", description: "Converts markdown to plain text", runtime: "Node.js 18", status: "active", lastRun: "2026-02-13T11:00:00Z", runs: 345, code: `function mdToText(input) {\n  return { text: input.markdown.replace(/[#*_~\\[\\]()\\|>-]/g, '').replace(/\\n+/g, '\\n') };\n}`, createdAt: "2025-11-05T10:00:00Z" },
  { id: "fn-16", name: "IP Geolocation Lookup", description: "Mock IP to location resolver", runtime: "Node.js 18", status: "error", lastRun: "2026-02-12T08:00:00Z", runs: 189, code: `function geoLookup(input) {\n  // Mock implementation\n  return { ip: input.ip, country: "US", city: "San Francisco" };\n}`, createdAt: "2025-06-30T09:00:00Z" },
  { id: "fn-17", name: "Base64 Encoder", description: "Encodes and decodes Base64 strings", runtime: "Node.js 18", status: "active", lastRun: "2026-02-17T02:30:00Z", runs: 678, code: `function base64(input) {\n  if (input.action === 'decode') return { result: atob(input.data) };\n  return { result: btoa(input.data) };\n}`, createdAt: "2025-05-18T08:00:00Z" },
  { id: "fn-18", name: "Time Zone Converter", description: "Converts times between time zones", runtime: "Python 3.11", status: "active", lastRun: "2026-02-16T10:00:00Z", runs: 234, code: `def convert_tz(input_data):\n    # Simplified mock\n    return {"original": input_data.get("time"), "converted": input_data.get("time"), "timezone": input_data.get("to_tz")}`, createdAt: "2025-12-01T13:00:00Z" },
  { id: "fn-19", name: "Color Converter", description: "Converts between HEX, RGB, HSL", runtime: "Node.js 18", status: "draft", lastRun: "Never", runs: 0, code: `function convertColor(input) {\n  const hex = input.hex.replace('#','');\n  const r = parseInt(hex.substr(0,2), 16);\n  const g = parseInt(hex.substr(2,2), 16);\n  const b = parseInt(hex.substr(4,2), 16);\n  return { rgb: \`rgb(\${r},\${g},\${b})\`, r, g, b };\n}`, createdAt: "2025-08-14T08:00:00Z" },
  { id: "fn-20", name: "Math Expression Eval", description: "Evaluates basic math expressions", runtime: "Python 3.11", status: "active", lastRun: "2026-02-17T01:00:00Z", runs: 890, code: `def evaluate(input_data):\n    expr = input_data.get('expression', '0')\n    # Safe eval for basic math\n    allowed = set('0123456789+-*/.() ')\n    if all(c in allowed for c in expr):\n        return {"result": eval(expr)}\n    return {"error": "Invalid expression"}`, createdAt: "2025-07-10T08:00:00Z" },
];

const FunctionsPage = () => {
  const [functions, setFunctions] = useState<FunctionItem[]>(initialFunctions);
  const [selectedFn, setSelectedFn] = useState<FunctionItem>(initialFunctions[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newFn, setNewFn] = useState({ name: "", description: "", runtime: "Node.js 18", code: defaultCode["Node.js 18"] });
  const [testOutput, setTestOutput] = useState<string | null>(null);

  const filtered = functions.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createFunction = () => {
    if (!newFn.name.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    const fn: FunctionItem = { id: `fn-${Date.now()}`, ...newFn, status: "draft", lastRun: "Never", runs: 0, createdAt: new Date().toISOString() };
    setFunctions(prev => [fn, ...prev]);
    setSelectedFn(fn);
    setNewFn({ name: "", description: "", runtime: "Node.js 18", code: defaultCode["Node.js 18"] });
    setIsCreateOpen(false);
    toast({ title: "Function Created", description: `${fn.name} has been created.` });
  };

  const saveFunction = () => {
    setFunctions(prev => prev.map(f => f.id === selectedFn.id ? selectedFn : f));
    setIsEditing(false);
    toast({ title: "Function Saved", description: `${selectedFn.name} has been updated.` });
  };

  const deleteFunction = () => {
    setFunctions(prev => prev.filter(f => f.id !== selectedFn.id));
    if (functions.length > 1) setSelectedFn(functions.find(f => f.id !== selectedFn.id) || functions[0]);
    setIsDeleteOpen(false);
    toast({ title: "Function Deleted", variant: "destructive" });
  };

  const duplicateFunction = (fn: FunctionItem) => {
    const dup: FunctionItem = { ...fn, id: `fn-${Date.now()}`, name: `${fn.name} (Copy)`, status: "draft", runs: 0, lastRun: "Never", createdAt: new Date().toISOString() };
    setFunctions(prev => [dup, ...prev]);
    setSelectedFn(dup);
    toast({ title: "Function Duplicated" });
  };

  const runFunction = () => {
    setTestOutput("Running...");
    setTimeout(() => {
      setTestOutput(JSON.stringify({ success: true, result: "processed", executionTime: `${(Math.random() * 200 + 50).toFixed(0)}ms` }, null, 2));
      setFunctions(prev => prev.map(f => f.id === selectedFn.id ? { ...f, lastRun: new Date().toISOString(), runs: f.runs + 1, status: "active" as const } : f));
      toast({ title: "Function Executed", description: `${selectedFn.name} ran successfully.` });
    }, 1000);
  };

  const useTemplate = (name: string, desc: string, runtime: string, code: string) => {
    const fn: FunctionItem = { id: `fn-${Date.now()}`, name, description: desc, runtime, status: "draft", lastRun: "Never", runs: 0, code, createdAt: new Date().toISOString() };
    setFunctions(prev => [fn, ...prev]);
    setSelectedFn(fn);
    toast({ title: "Template Applied", description: `${name} has been created from template.` });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Functions</h1>
          <p className="text-muted-foreground">Create and manage custom code functions for your workflows</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Create Function</Button>
      </div>

      <Tabs defaultValue="functions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="functions">My Functions ({functions.length})</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="functions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input placeholder="Search functions..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filtered.map(fn => (
                  <Card key={fn.id} className={`cursor-pointer transition-colors ${selectedFn.id === fn.id ? 'ring-2 ring-primary' : ''}`} onClick={() => { setSelectedFn(fn); setIsEditing(false); setTestOutput(null); }}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{fn.name}</h4>
                        <Badge variant={fn.status === 'active' ? 'default' : fn.status === 'error' ? 'destructive' : 'secondary'} className="text-xs">{fn.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{fn.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{fn.runtime}</span>
                        <span>•</span>
                        <span>{fn.runs} runs</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2"><Code className="h-5 w-5" /> {selectedFn.name}</h2>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => duplicateFunction(selectedFn)}><Copy className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={runFunction}><Play className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(true)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-4 space-y-4">
                  {isEditing && (
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Name</Label><Input value={selectedFn.name} onChange={e => setSelectedFn({ ...selectedFn, name: e.target.value })} /></div>
                      <div><Label>Description</Label><Input value={selectedFn.description} onChange={e => setSelectedFn({ ...selectedFn, description: e.target.value })} /></div>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label>Code ({selectedFn.runtime})</Label>
                      <span className="text-xs text-muted-foreground">{selectedFn.runs} runs • Last: {selectedFn.lastRun === "Never" ? "Never" : new Date(selectedFn.lastRun).toLocaleString()}</span>
                    </div>
                    <Textarea value={selectedFn.code} onChange={e => setSelectedFn({ ...selectedFn, code: e.target.value })} className="font-mono text-sm min-h-[250px]" readOnly={!isEditing} />
                  </div>
                  {isEditing && <Button onClick={saveFunction} className="gap-2"><Save className="h-4 w-4" /> Save</Button>}
                  {testOutput && (
                    <div>
                      <Label className="flex items-center gap-1"><Terminal className="h-4 w-4" /> Output</Label>
                      <pre className="bg-muted rounded p-3 text-xs overflow-auto max-h-40 mt-1">{testOutput}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Email Validator", desc: "Validate email addresses", rt: "Node.js 18", cat: "Data", code: `function validate(input) {\n  return { valid: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(input.email) };\n}` },
              { name: "Text Transformer", desc: "Transform text case and format", rt: "Node.js 18", cat: "Text", code: `function transform(input) {\n  return { upper: input.text.toUpperCase(), lower: input.text.toLowerCase() };\n}` },
              { name: "Date Calculator", desc: "Calculate date differences", rt: "Node.js 18", cat: "Utilities", code: `function calc(input) {\n  return { days: Math.ceil(Math.abs(new Date(input.end) - new Date(input.start)) / 86400000) };\n}` },
              { name: "JSON Flattener", desc: "Flatten nested JSON objects", rt: "Node.js 18", cat: "Data", code: `function flatten(input, prefix = '') {\n  let result = {};\n  for (let k in input.data) {\n    const key = prefix ? prefix + '.' + k : k;\n    if (typeof input.data[k] === 'object') Object.assign(result, flatten({data: input.data[k]}, key));\n    else result[key] = input.data[k];\n  }\n  return result;\n}` },
              { name: "Number Formatter", desc: "Format numbers with locale", rt: "Node.js 18", cat: "Utilities", code: `function format(input) {\n  return { formatted: new Intl.NumberFormat(input.locale || 'en-US', { style: 'currency', currency: input.currency || 'USD' }).format(input.amount) };\n}` },
              { name: "String Hasher", desc: "Generate hashes from strings", rt: "Node.js 18", cat: "Security", code: `function hash(input) {\n  let h = 0;\n  for (let i = 0; i < input.text.length; i++) h = ((h << 5) - h) + input.text.charCodeAt(i);\n  return { hash: Math.abs(h).toString(16) };\n}` },
            ].map((t, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t.name}</CardTitle>
                  <CardDescription>{t.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{t.cat}</Badge>
                    <Button size="sm" variant="outline" onClick={() => useTemplate(t.name, t.desc, t.rt, t.code)}>Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Function</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name</Label><Input placeholder="e.g., Data Processor" value={newFn.name} onChange={e => setNewFn({ ...newFn, name: e.target.value })} /></div>
              <div><Label>Runtime</Label>
                <Select value={newFn.runtime} onValueChange={v => setNewFn({ ...newFn, runtime: v, code: defaultCode[v] || newFn.code })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Node.js 18">Node.js 18</SelectItem>
                    <SelectItem value="Python 3.11">Python 3.11</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Description</Label><Input placeholder="What does this function do?" value={newFn.description} onChange={e => setNewFn({ ...newFn, description: e.target.value })} /></div>
            <div><Label>Code</Label><Textarea value={newFn.code} onChange={e => setNewFn({ ...newFn, code: e.target.value })} className="font-mono text-sm min-h-[200px]" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={createFunction}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Function</DialogTitle><DialogDescription>Are you sure you want to delete "{selectedFn?.name}"?</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={deleteFunction}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FunctionsPage;
