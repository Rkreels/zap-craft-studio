
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Mail, 
  MoreHorizontal, 
  PlusCircle, 
  Shield, 
  Trash2, 
  UserPlus, 
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  ClipboardList
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "owner" | "admin" | "editor" | "viewer";
  lastActive?: Date;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: Date;
  details?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: Date;
  reactions?: { emoji: string; count: number }[];
}

interface TeamCollaborationProps {
  currentUserId: string;
  workflowId: string;
  workflowName: string;
}

export const TeamCollaboration: React.FC<TeamCollaborationProps> = ({
  currentUserId,
  workflowId,
  workflowName
}) => {
  const [activeTab, setActiveTab] = useState("members");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  
  // Mock team members data
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "current-user",
      name: "You",
      email: "you@example.com",
      role: "owner",
      lastActive: new Date()
    },
    {
      id: "member-2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: "member-3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "editor",
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ]);
  
  // Mock activity logs
  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: "log-1",
      userId: "current-user",
      userName: "You",
      action: "created",
      target: "workflow",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      details: `Created "${workflowName}" workflow`
    },
    {
      id: "log-2",
      userId: "member-2",
      userName: "Jane Smith",
      action: "modified",
      target: "step",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      details: "Modified Slack notification step"
    },
    {
      id: "log-3",
      userId: "current-user",
      userName: "You",
      action: "activated",
      target: "workflow",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      details: "Activated workflow"
    },
    {
      id: "log-4",
      userId: "member-3",
      userName: "Mike Johnson",
      action: "added",
      target: "step",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      details: "Added error handling step"
    }
  ]);
  
  // Mock comments
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "comment-1",
      userId: "member-2",
      userName: "Jane Smith",
      text: "I've added the Slack notification step. Can someone review it?",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      reactions: [
        { emoji: "👍", count: 2 }
      ]
    },
    {
      id: "comment-2",
      userId: "current-user",
      userName: "You",
      text: "Looks good to me. I've enabled the workflow.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    }
  ]);
  
  const handleInviteUser = () => {
    if (!inviteEmail.trim()) return;
    
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      lastActive: undefined
    };
    
    setMembers([...members, newMember]);
    setInviteDialogOpen(false);
    setInviteEmail("");
    
    toast({
      title: "Invitation sent",
      description: `${inviteEmail} has been invited as a ${inviteRole}.`
    });
  };
  
  const handleRoleChange = (userId: string, newRole: "admin" | "editor" | "viewer") => {
    setMembers(members.map(member => 
      member.id === userId ? { ...member, role: newRole } : member
    ));
    
    toast({
      title: "Role updated",
      description: `User's role has been updated to ${newRole}.`
    });
  };
  
  const handleRemoveMember = (userId: string) => {
    if (userId === currentUserId) {
      toast({
        title: "Cannot remove yourself",
        description: "You cannot remove yourself from the workflow.",
        variant: "destructive"
      });
      return;
    }
    
    const memberToRemove = members.find(m => m.id === userId);
    if (!memberToRemove) return;
    
    if (confirm(`Are you sure you want to remove ${memberToRemove.name} from this workflow?`)) {
      setMembers(members.filter(member => member.id !== userId));
      
      toast({
        title: "Member removed",
        description: `${memberToRemove.name} has been removed from the workflow.`
      });
    }
  };
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUserId,
      userName: "You",
      text: newComment,
      timestamp: new Date()
    };
    
    setComments([...comments, comment]);
    setNewComment("");
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else {
      const days = Math.round(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Manage team members and workflow permissions
              </CardDescription>
            </div>
            <Button onClick={() => setInviteDialogOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="members" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Team Members
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-1">
                <ClipboardList className="h-4 w-4" />
                Activity Log
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Comments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="members" className="mt-0">
              <div className="space-y-3">
                {members.map(member => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        {member.avatarUrl ? (
                          <AvatarImage src={member.avatarUrl} />
                        ) : (
                          <AvatarFallback>
                            {member.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div>
                        <p className="font-medium">
                          {member.name}
                          {member.id === currentUserId && " (you)"}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-3 w-3 mr-1" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {member.lastActive && (
                        <div className="hidden md:flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Active {formatDate(member.lastActive)}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {member.id !== currentUserId ? (
                          <Select
                            value={member.role}
                            onValueChange={(value: "admin" | "editor" | "viewer") => 
                              handleRoleChange(member.id, value)
                            }
                          >
                            <SelectTrigger className="w-[110px] h-8 text-xs">
                              <div className="flex items-center">
                                {member.role === "admin" && <Shield className="h-3 w-3 mr-1 text-purple-500" />}
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="h-8 flex items-center gap-1 bg-gray-50">
                            <Shield className="h-3 w-3 text-purple-500" />
                            Owner
                          </Badge>
                        )}
                        
                        {member.id !== currentUserId && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setInviteDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-0">
              <div className="space-y-3">
                {activityLogs.map(log => (
                  <div 
                    key={log.id} 
                    className="flex p-3 border rounded-md"
                  >
                    <div className="mr-3 mt-1">
                      {log.action === "created" && (
                        <PlusCircle className="h-4 w-4 text-green-500" />
                      )}
                      {log.action === "modified" && (
                        <MoreHorizontal className="h-4 w-4 text-blue-500" />
                      )}
                      {log.action === "activated" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {log.action === "deactivated" && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      {log.action === "added" && (
                        <PlusCircle className="h-4 w-4 text-purple-500" />
                      )}
                      {log.action === "removed" && (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                      {log.action === "error" && (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p>
                          <span className="font-medium">{log.userName}</span>
                          {" "}
                          <span>{log.action} {log.target}</span>
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                      
                      {log.details && (
                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="comments" className="mt-0">
              <div className="space-y-4">
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div 
                      key={comment.id} 
                      className="flex p-3 border rounded-md"
                    >
                      <Avatar className="h-8 w-8 mr-3 mt-0.5">
                        {comment.userAvatar ? (
                          <AvatarImage src={comment.userAvatar} />
                        ) : (
                          <AvatarFallback>
                            {comment.userName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {comment.userName}
                            {comment.userId === currentUserId && " (you)"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        
                        <p className="mt-1">{comment.text}</p>
                        
                        {comment.reactions && comment.reactions.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {comment.reactions.map((reaction, i) => (
                              <Badge 
                                key={i} 
                                variant="outline" 
                                className="px-2 py-0 h-6"
                              >
                                {reaction.emoji} {reaction.count}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <Button onClick={handleAddComment}>
                    Add
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={(v: "admin" | "editor" | "viewer") => setInviteRole(v)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (full access)</SelectItem>
                  <SelectItem value="editor">Editor (can edit)</SelectItem>
                  <SelectItem value="viewer">Viewer (read-only)</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="mt-2 text-xs text-gray-500">
                {inviteRole === "admin" && (
                  <p>Admins can edit, activate/deactivate, and manage team permissions</p>
                )}
                {inviteRole === "editor" && (
                  <p>Editors can modify workflows but cannot manage permissions</p>
                )}
                {inviteRole === "viewer" && (
                  <p>Viewers can only view workflows but cannot make changes</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteUser}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
