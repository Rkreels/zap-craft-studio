
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, Database, Plus, FileText, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TableCreatorPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Table</h1>
          <p className="text-gray-500">Design a custom table to store and manage your data</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            New
          </Badge>
          <Button variant="outline">Import Structure</Button>
          <Button>Save Table</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Table className="mr-2" size={20} />
              Table Details
            </CardTitle>
            <CardDescription>
              Define your table name and basic properties
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tableName">Table Name</Label>
                <Input id="tableName" placeholder="e.g. customers, orders, products" />
              </div>
              <div>
                <Label htmlFor="tableDescription">Description (Optional)</Label>
                <Input id="tableDescription" placeholder="Describe the purpose of this table" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primaryKey">Primary Key</Label>
                <Input id="primaryKey" defaultValue="id" />
              </div>
              <div>
                <Label htmlFor="keyType">Key Type</Label>
                <select className="w-full border border-gray-300 rounded-md h-10 px-3" id="keyType">
                  <option>Auto-increment Integer</option>
                  <option>UUID</option>
                  <option>Text</option>
                </select>
              </div>
              <div className="flex items-end">
                <div className="flex items-center space-x-2 h-10">
                  <input type="checkbox" id="timestamps" className="rounded border-gray-300" />
                  <Label htmlFor="timestamps">Add timestamps (created_at, updated_at)</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Database className="mr-2" size={20} />
                Define Fields
              </CardTitle>
              <CardDescription>
                Add fields to your table structure
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-1" size={16} />
              Add Field
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Field 1 */}
              <div className="border rounded-md p-3 grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3">
                  <Label htmlFor="field1">Field Name</Label>
                  <Input id="field1" defaultValue="name" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="type1">Type</Label>
                  <select className="w-full border border-gray-300 rounded-md h-10 px-3" id="type1">
                    <option>Text</option>
                    <option>Number</option>
                    <option>Boolean</option>
                    <option>Date</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="default1">Default</Label>
                  <Input id="default1" placeholder="Optional" />
                </div>
                <div className="col-span-4 flex items-center space-x-3 h-10 mt-6">
                  <div className="flex items-center space-x-1">
                    <input type="checkbox" id="required1" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="required1">Required</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input type="checkbox" id="unique1" className="rounded border-gray-300" />
                    <Label htmlFor="unique1">Unique</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input type="checkbox" id="index1" className="rounded border-gray-300" />
                    <Label htmlFor="index1">Index</Label>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <X size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Field 2 */}
              <div className="border rounded-md p-3 grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3">
                  <Label htmlFor="field2">Field Name</Label>
                  <Input id="field2" defaultValue="email" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="type2">Type</Label>
                  <select className="w-full border border-gray-300 rounded-md h-10 px-3" id="type2">
                    <option>Text</option>
                    <option>Number</option>
                    <option>Boolean</option>
                    <option>Date</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="default2">Default</Label>
                  <Input id="default2" placeholder="Optional" />
                </div>
                <div className="col-span-4 flex items-center space-x-3 h-10 mt-6">
                  <div className="flex items-center space-x-1">
                    <input type="checkbox" id="required2" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="required2">Required</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input type="checkbox" id="unique2" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="unique2">Unique</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input type="checkbox" id="index2" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="index2">Index</Label>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <X size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Field 3 */}
              <div className="border rounded-md p-3 grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3">
                  <Label htmlFor="field3">Field Name</Label>
                  <Input id="field3" defaultValue="status" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="type3">Type</Label>
                  <select className="w-full border border-gray-300 rounded-md h-10 px-3" id="type3">
                    <option>Text</option>
                    <option>Number</option>
                    <option>Boolean</option>
                    <option>Date</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="default3">Default</Label>
                  <Input id="default3" placeholder="Optional" defaultValue="active" />
                </div>
                <div className="col-span-4 flex items-center space-x-3 h-10 mt-6">
                  <div className="flex items-center space-x-1">
                    <input type="checkbox" id="required3" className="rounded border-gray-300" defaultChecked />
                    <Label htmlFor="required3">Required</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input type="checkbox" id="unique3" className="rounded border-gray-300" />
                    <Label htmlFor="unique3">Unique</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input type="checkbox" id="index3" className="rounded border-gray-300" />
                    <Label htmlFor="index3">Index</Label>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline">
              <Plus size={16} className="mr-1" />
              Add Another Field
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" size={20} />
              SQL Preview
            </CardTitle>
            <CardDescription>
              Preview of the SQL that will be generated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
              <pre>{`CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_email ON customers(email);`}</pre>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline">Cancel</Button>
          <Button>Create Table</Button>
        </div>
      </div>
    </div>
  );
}
