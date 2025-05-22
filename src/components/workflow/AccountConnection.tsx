
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, Key, Lock, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export interface ConnectedAccount {
  id: string;
  name: string;
  service: string;
  email?: string;
  icon?: string;
  color?: string;
  lastUsed?: Date;
}

interface AccountConnectionProps {
  service: string;
  serviceName: string;
  icon: string;
  color?: string;
  accounts: ConnectedAccount[];
  onConnect: (account: ConnectedAccount) => void;
  onDisconnect: (accountId: string) => void;
}

export const AccountConnection: React.FC<AccountConnectionProps> = ({
  service,
  serviceName,
  icon,
  color = "bg-gray-100",
  accounts,
  onConnect,
  onDisconnect
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [connectionForm, setConnectionForm] = useState({
    email: "",
    apiKey: "",
    accountName: "",
  });
  const { toast } = useToast();
  
  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    
    // Simulate API connection
    setTimeout(() => {
      const newAccount: ConnectedAccount = {
        id: `${service}-${Date.now()}`,
        name: connectionForm.accountName || connectionForm.email,
        service,
        email: connectionForm.email,
        icon,
        color,
        lastUsed: new Date()
      };
      
      onConnect(newAccount);
      setConnectionForm({ email: "", apiKey: "", accountName: "" });
      setIsConnecting(false);
      setIsDialogOpen(false);
      
      toast({
        title: "Account connected",
        description: `Successfully connected ${serviceName} account.`
      });
    }, 1500);
  };
  
  const handleDisconnect = (accountId: string) => {
    if (confirm("Are you sure you want to disconnect this account?")) {
      onDisconnect(accountId);
      
      toast({
        title: "Account disconnected",
        description: `Successfully disconnected ${serviceName} account.`
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white font-bold mr-3 ${color}`}>
              {icon}
            </div>
            <div>
              <CardTitle>{serviceName}</CardTitle>
              <CardDescription>Manage connected accounts</CardDescription>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Connect Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect {serviceName} Account</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleConnect} className="space-y-4 py-2">
                <div>
                  <Label htmlFor="email">Email or Username</Label>
                  <Input
                    id="email"
                    value={connectionForm.email}
                    onChange={(e) => setConnectionForm({...connectionForm, email: e.target.value})}
                    placeholder="your-email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="account-name">Account Name (Optional)</Label>
                  <Input
                    id="account-name"
                    value={connectionForm.accountName}
                    onChange={(e) => setConnectionForm({...connectionForm, accountName: e.target.value})}
                    placeholder="Work Account"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A recognizable name to distinguish between multiple accounts
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={connectionForm.apiKey}
                    onChange={(e) => setConnectionForm({...connectionForm, apiKey: e.target.value})}
                    placeholder="api_key_xxxxx"
                    required
                  />
                  <div className="flex items-center mt-1">
                    <Key className="h-3 w-3 text-gray-500 mr-1" />
                    <span className="text-xs text-gray-500">
                      Find your API key in your {serviceName} account settings
                    </span>
                  </div>
                </div>
                
                <Alert variant="outline" className="bg-blue-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Secure Connection</AlertTitle>
                  <AlertDescription>
                    Your credentials are encrypted and securely stored.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isConnecting}>
                    {isConnecting ? (
                      <>Connecting...</>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-1" />
                        Connect Securely
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <div className="text-center py-6 border border-dashed rounded-md">
            <p className="text-gray-500">No accounts connected yet</p>
            <p className="text-sm text-gray-400">
              Connect an account to use in your workflow
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map(account => (
              <div 
                key={account.id} 
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold mr-2 ${account.color || color}`}>
                    {account.icon || icon}
                  </div>
                  <div>
                    <p className="font-medium">{account.name}</p>
                    {account.email && (
                      <p className="text-xs text-gray-500">{account.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {account.lastUsed && (
                    <span className="text-xs text-gray-500 mr-2">
                      Last used: {account.lastUsed.toLocaleDateString()}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDisconnect(account.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
