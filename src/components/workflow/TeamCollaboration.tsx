
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Search, 
  Eye, 
  Edit, 
  Clock, 
  Activity,
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatarUrl?: string;
  initials: string;
  lastActive?: Date;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: string;
  resourceName: string;
  timestamp: Date;
}

interface TeamCollaborationProps {
  currentUserId: string;
  workflowId: string;
  workflowName: string;
}

export const TeamCollaboration: React.FC<TeamCollaborationProps> = ({
  currentUserId,
  workflowId,
  workflowName,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('members');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [permissionDialogMember, setPermissionDialogMember] = useState<TeamMember | null>(null);

  // Sample team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "user-1",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "owner",
      initials: "JS",
      lastActive: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
    },
    {
      id: "user-2",
      name: "Michael Johnson",
      email: "michael@example.com",
      role: "admin",
      initials: "MJ",
      lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    },
    {
      id: "user-3",
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "editor",
      initials: "SW",
      lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: currentUserId,
      name: "You",
      email: "you@example.com",
      role: "admin",
      initials: "YO",
      lastActive: new Date() // Now
    }
  ]);

  // Sample activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: "activity-1",
      userId: "user-2",
      userName: "Michael Johnson",
      action: "modified",
      resourceType: "condition",
      resourceName: "Email notification condition",
      timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      id: "activity-2",
      userId: "user-1",
      userName: "Jane Smith",
      action: "added",
      resourceType: "action",
      resourceName: "Slack notification",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: "activity-3",
      userId: "user-3",
      userName: "Sarah Williams",
      action: "deleted",
      resourceType: "step",
      resourceName: "Data transformation step",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: "activity-4",
      userId: currentUserId,
      userName: "You",
      action: "updated",
      resourceType: "workflow",
      resourceName: "Schedule",
      timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
    },
    {
      id: "activity-5",
      userId: "user-1",
      userName: "Jane Smith",
      action: "published",
      resourceType: "workflow",
      resourceName: workflowName,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ]);

  // Filter team members based on search
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = () => {
    if (!inviteEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send an invitation and add the user once they accept
    const newMember: TeamMember = {
      id: `user-${teamMembers.length + 1}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      initials: inviteEmail[0].toUpperCase() + inviteEmail[1].toUpperCase(),
      lastActive: undefined
    };
    
    setTeamMembers([...teamMembers, newMember]);
    
    // Log this activity
    const newActivity: ActivityLog = {
      id: `activity-${activityLogs.length + 1}`,
      userId: currentUserId,
      userName: "You",
      action: "invited",
      resourceType: "user",
      resourceName: inviteEmail,
      timestamp: new Date()
    };
    
    setActivityLogs([newActivity, ...activityLogs]);
    
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${inviteEmail} with ${inviteRole} permissions`,
    });
    
    setInviteEmail('');
    setIsInviteDialogOpen(false);
  };

  const updateMemberRole = (memberId: string, newRole: 'owner' | 'admin' | 'editor' | 'viewer') => {
    // Cannot change your own role
    if (memberId === currentUserId) {
      toast({
        title: "Cannot change your own role",
        description: "Contact another admin or owner to change your role",
        variant: "destructive",
      });
      return;
    }

    // At least one owner must remain
    if (teamMembers.find(m => m.id === memberId)?.role === 'owner' && 
        teamMembers.filter(m => m.role === 'owner').length === 1) {
      toast({
        title: "Cannot remove the only owner",
        description: "Transfer ownership to another member first",
        variant: "destructive",
      });
      return;
    }

    const updatedMembers = teamMembers.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    );
    
    setTeamMembers(updatedMembers);
    
    // Log this activity
    const targetMember = teamMembers.find(m => m.id === memberId);
    
    const newActivity: ActivityLog = {
      id: `activity-${activityLogs.length + 1}`,
      userId: currentUserId,
      userName: "You",
      action: "updated",
      resourceType: "permissions",
      resourceName: `${targetMember?.name}'s role to ${newRole}`,
      timestamp: new Date()
    };
    
    setActivityLogs([newActivity, ...activityLogs]);
    
    toast({
      title: "Permissions updated",
      description: `${targetMember?.name}'s role changed to ${newRole}`,
    });
  };

  const removeMember = (memberId: string) => {
    // Cannot remove yourself
    if (memberId === currentUserId) {
      toast({
        title: "Cannot remove yourself",
        description: "Contact another admin or owner to remove you from the team",
        variant: "destructive",
      });
      return;
    }

    // Cannot remove the only owner
    if (teamMembers.find(m => m.id === memberId)?.role === 'owner' && 
        teamMembers.filter(m => m.role === 'owner').length === 1) {
      toast({
        title: "Cannot remove the only owner",
        description: "Transfer ownership to another member first",
        variant: "destructive",
      });
      return;
    }

    const memberToRemove = teamMembers.find(m => m.id === memberId);
    const updatedMembers = teamMembers.filter(member => member.id !== memberId);
    
    setTeamMembers(updatedMembers);
    
    // Log this activity
    const newActivity: ActivityLog = {
      id: `activity-${activityLogs.length + 1}`,
      userId: currentUserId,
      userName: "You",
      action: "removed",
      resourceType: "user",
      resourceName: memberToRemove?.name || "",
      timestamp: new Date()
    };
    
    setActivityLogs([newActivity, ...activityLogs]);
    
    toast({
      title: "Team member removed",
      description: `${memberToRemove?.name} has been removed from the team`,
    });
  };

  // Function to format the time elapsed
  const getTimeElapsed = (date?: Date) => {
    if (!date) return "Never";
    
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <ShieldCheck className="h-4 w-4 text-purple-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'editor':
        return <Edit className="h-4 w-4 text-green-500" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  // Get role label
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return (
          <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
            Owner
          </Badge>
        );
      case 'admin':
        return (
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
            Admin
          </Badge>
        );
      case 'editor':
        return (
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
            Editor
          </Badge>
        );
      case 'viewer':
        return (
          <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
            Viewer
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Collaboration
        </CardTitle>
        <CardDescription>
          Manage team access and track activity for this workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="permissions">Permission Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="members">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Invite Team Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite a Team Member</DialogTitle>
                      <DialogDescription>
                        Add someone to collaborate on this workflow
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div>
                        <Label htmlFor="email">Email address</Label>
                        <div className="flex mt-1.5">
                          <div className="relative flex-1">
                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              id="email"
                              placeholder="colleague@example.com"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="role">Permissions</Label>
                        <Select
                          value={inviteRole}
                          onValueChange={(value: 'editor' | 'viewer') => setInviteRole(value)}
                        >
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Permissions</SelectLabel>
                              <SelectItem value="editor">
                                <div className="flex items-center">
                                  <Edit className="h-4 w-4 mr-2 text-green-500" />
                                  <span>Editor - Can edit workflow</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="viewer">
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 mr-2 text-gray-500" />
                                  <span>Viewer - Can only view</span>
                                </div>
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleInvite}>Send Invitation</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="border rounded-md divide-y">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <div key={member.id} className="p-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {member.name} {member.id === currentUserId && "(You)"}
                          </div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {getTimeElapsed(member.lastActive)}
                          </span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setPermissionDialogMember(member)}
                            >
                              <div className="flex items-center gap-2">
                                {getRoleIcon(member.role)}
                                {getRoleLabel(member.role)}
                              </div>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change Role for {member.name}</DialogTitle>
                              <DialogDescription>
                                Update team member permissions
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                              <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <div className="grid grid-cols-1 gap-2">
                                  <Button
                                    variant={member.role === 'owner' ? 'default' : 'outline'}
                                    className="justify-start"
                                    onClick={() => updateMemberRole(member.id, 'owner')}
                                    disabled={member.id === currentUserId}
                                  >
                                    <ShieldCheck className="h-4 w-4 mr-2 text-purple-500" />
                                    <div className="text-left">
                                      <div>Owner</div>
                                      <div className="text-xs text-gray-500">Full control and administrative access</div>
                                    </div>
                                  </Button>
                                  <Button
                                    variant={member.role === 'admin' ? 'default' : 'outline'}
                                    className="justify-start"
                                    onClick={() => updateMemberRole(member.id, 'admin')}
                                    disabled={member.id === currentUserId}
                                  >
                                    <Shield className="h-4 w-4 mr-2 text-blue-500" />
                                    <div className="text-left">
                                      <div>Admin</div>
                                      <div className="text-xs text-gray-500">Can manage workflows and team access</div>
                                    </div>
                                  </Button>
                                  <Button
                                    variant={member.role === 'editor' ? 'default' : 'outline'}
                                    className="justify-start"
                                    onClick={() => updateMemberRole(member.id, 'editor')}
                                    disabled={member.id === currentUserId}
                                  >
                                    <Edit className="h-4 w-4 mr-2 text-green-500" />
                                    <div className="text-left">
                                      <div>Editor</div>
                                      <div className="text-xs text-gray-500">Can edit workflows but not manage team</div>
                                    </div>
                                  </Button>
                                  <Button
                                    variant={member.role === 'viewer' ? 'default' : 'outline'}
                                    className="justify-start"
                                    onClick={() => updateMemberRole(member.id, 'viewer')}
                                    disabled={member.id === currentUserId}
                                  >
                                    <Eye className="h-4 w-4 mr-2 text-gray-500" />
                                    <div className="text-left">
                                      <div>Viewer</div>
                                      <div className="text-xs text-gray-500">Can only view workflows</div>
                                    </div>
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button 
                                variant="destructive" 
                                className="mr-auto"
                                onClick={() => removeMember(member.id)}
                                disabled={member.id === currentUserId}
                              >
                                Remove from Team
                              </Button>
                              <Button variant="outline">Cancel</Button>
                              <Button>Save</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No team members found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="space-y-4">
              <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                {activityLogs.map((log) => (
                  <div key={log.id} className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">
                          <span>{log.userName} </span>
                          <span className="text-gray-700">{log.action} </span>
                          <span className="text-gray-700">{log.resourceType} </span>
                          <span className="font-medium text-black">"{log.resourceName}"</span>
                        </div>
                        <div className="text-xs text-gray-500">{log.timestamp.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {getTimeElapsed(log.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="permissions">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md border">
                <h3 className="font-medium mb-2">Default Permissions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="editor-permissions" className="font-medium">Editor Permissions</Label>
                      <p className="text-sm text-gray-500">Can editors publish workflows?</p>
                    </div>
                    <Switch id="editor-permissions" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="viewer-run" className="font-medium">Viewer Execution Rights</Label>
                      <p className="text-sm text-gray-500">Can viewers run workflows?</p>
                    </div>
                    <Switch id="viewer-run" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border">
                <h3 className="font-medium mb-2">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="audit-log" className="font-medium">Enable Audit Logs</Label>
                      <p className="text-sm text-gray-500">Track all changes to workflows</p>
                    </div>
                    <Switch id="audit-log" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="require-approval" className="font-medium">Require Approval</Label>
                      <p className="text-sm text-gray-500">Changes need admin approval before publishing</p>
                    </div>
                    <Switch id="require-approval" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border">
                <h3 className="font-medium mb-2">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="edit-notifications" className="font-medium">Edit Notifications</Label>
                      <p className="text-sm text-gray-500">Send notifications when edits are made</p>
                    </div>
                    <Switch id="edit-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="run-notifications" className="font-medium">Execution Notifications</Label>
                      <p className="text-sm text-gray-500">Send notifications when workflow runs</p>
                    </div>
                    <Switch id="run-notifications" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
