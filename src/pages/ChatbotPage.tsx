
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  MessageSquare,
  Settings,
  Edit,
  Trash2,
  Copy,
  Save,
  Send
} from "lucide-react";
import { useVoiceGuidance } from "@/components/voice-assistant/withVoiceGuidance";
import { chatbotScripts } from "@/data/voiceScripts";

// Type definitions for our data
interface ChatbotIntent {
  id: string;
  name: string;
  phrases: string[];
}

interface ChatbotResponse {
  id: string;
  text: string;
  buttons?: { label: string; action: string }[];
}

interface Chatbot {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "draft";
  intents: ChatbotIntent[];
  responses: Record<string, ChatbotResponse>;
}

// Mock data for chatbots
const initialChatbots: Chatbot[] = [
  {
    id: "chatbot-1",
    name: "Customer Support Bot",
    description: "Handles common customer queries and support requests",
    createdAt: "2025-05-01T14:30:00Z",
    updatedAt: "2025-05-14T09:15:00Z",
    status: "active",
    intents: [
      {
        id: "intent-1",
        name: "greeting",
        phrases: ["hello", "hi", "hey", "good morning", "good afternoon"]
      },
      {
        id: "intent-2",
        name: "help",
        phrases: ["help", "I need help", "support", "assist me", "can you help"]
      }
    ],
    responses: {
      "greeting": {
        id: "response-1",
        text: "Hello! How can I help you today?",
        buttons: [
          { label: "Ask a Question", action: "help" },
          { label: "Report an Issue", action: "issue" }
        ]
      },
      "help": {
        id: "response-2",
        text: "I'd be happy to help! Please tell me what you're looking for assistance with."
      }
    }
  },
  {
    id: "chatbot-2",
    name: "Sales Assistant",
    description: "Helps customers with product information and purchasing",
    createdAt: "2025-05-05T10:15:00Z",
    updatedAt: "2025-05-12T16:45:00Z",
    status: "draft",
    intents: [
      {
        id: "intent-3",
        name: "product_info",
        phrases: ["tell me about", "product details", "specifications", "features"]
      }
    ],
    responses: {
      "product_info": {
        id: "response-3",
        text: "Our products are designed with quality and performance in mind. Would you like to know about a specific product?"
      }
    }
  }
];

// Mock chat messages for testing
const initialChatMessages = [
  { sender: "user", text: "Hello there" },
  { sender: "bot", text: "Hi! How can I help you today?" },
  { sender: "user", text: "I need some information about your services" },
  { sender: "bot", text: "I'd be happy to help! We offer a range of services including web development, design, and marketing. Which one are you interested in?" }
];

export default function ChatbotPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>(initialChatbots);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChatbotId, setSelectedChatbotId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("builder");
  const [editingChatbot, setEditingChatbot] = useState<Chatbot | null>(null);
  const [newChatbotData, setNewChatbotData] = useState({
    name: "",
    description: ""
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [chatbotToDelete, setChatbotToDelete] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [userMessage, setUserMessage] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<ChatbotIntent | null>(null);
  const [newPhrase, setNewPhrase] = useState("");
  const [responseText, setResponseText] = useState("");
  
  // Find the currently selected chatbot
  const selectedChatbot = chatbots.find(bot => bot.id === selectedChatbotId);
  
  // Voice guidance
  const builderVoiceProps = {
    elementName: "Chatbot Builder",
    hoverText: chatbotScripts.chatbotBuilder.hover,
    clickText: chatbotScripts.chatbotBuilder.click
  };
  
  const intentEditorProps = {
    elementName: "Intent Editor",
    hoverText: chatbotScripts.intentEditor.hover,
    clickText: chatbotScripts.intentEditor.click
  };
  
  const testConsoleProps = {
    elementName: "Test Console",
    hoverText: chatbotScripts.testConsole.hover,
    clickText: chatbotScripts.testConsole.click
  };
  
  const { handleMouseEnter: builderMouseEnter, handleClick: builderClick } = useVoiceGuidance(builderVoiceProps);
  const { handleMouseEnter: intentMouseEnter, handleClick: intentClick } = useVoiceGuidance(intentEditorProps);
  const { handleMouseEnter: testConsoleMouseEnter, handleClick: testConsoleClick } = useVoiceGuidance(testConsoleProps);

  // Filter chatbots based on search query
  const filteredChatbots = chatbots.filter(chatbot => 
    chatbot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chatbot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // CRUD Operations
  const createChatbot = () => {
    if (!newChatbotData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your new chatbot",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newChatbot: Chatbot = {
        id: `chatbot-${Date.now()}`,
        name: newChatbotData.name,
        description: newChatbotData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "draft",
        intents: [],
        responses: {}
      };
      
      setChatbots(prev => [...prev, newChatbot]);
      setNewChatbotData({
        name: "",
        description: ""
      });
      setIsLoading(false);
      
      toast({
        title: "Chatbot created",
        description: `${newChatbotData.name} has been created successfully.`
      });
      
      // Select the new chatbot
      setSelectedChatbotId(newChatbot.id);
    }, 800);
  };

  const updateChatbot = () => {
    if (!editingChatbot) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setChatbots(prev => prev.map(bot => 
        bot.id === editingChatbot.id 
          ? { ...editingChatbot, updatedAt: new Date().toISOString() } 
          : bot
      ));
      
      setIsLoading(false);
      setEditingChatbot(null);
      
      toast({
        title: "Chatbot updated",
        description: `${editingChatbot.name} has been updated successfully.`
      });
    }, 800);
  };

  const deleteChatbot = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setChatbots(prev => prev.filter(bot => bot.id !== id));
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setChatbotToDelete(null);
      
      // If we deleted the selected chatbot, clear selection
      if (selectedChatbotId === id) {
        setSelectedChatbotId(null);
      }
      
      toast({
        title: "Chatbot deleted",
        description: "The chatbot has been deleted successfully.",
        variant: "destructive"
      });
    }, 800);
  };

  const duplicateChatbot = (chatbot: Chatbot) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const duplicatedChatbot: Chatbot = {
        ...chatbot,
        id: `chatbot-${Date.now()}`,
        name: `${chatbot.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "draft"
      };
      
      setChatbots(prev => [...prev, duplicatedChatbot]);
      setIsLoading(false);
      
      toast({
        title: "Chatbot duplicated",
        description: `A copy of ${chatbot.name} has been created.`
      });
    }, 800);
  };

  const confirmDelete = (id: string) => {
    setChatbotToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Intent and Response Management
  const addIntent = () => {
    if (!selectedChatbot) return;
    
    const newIntent: ChatbotIntent = {
      id: `intent-${Date.now()}`,
      name: `new_intent_${selectedChatbot.intents.length + 1}`,
      phrases: ["example phrase"]
    };
    
    setChatbots(prev => prev.map(bot => 
      bot.id === selectedChatbotId 
        ? { 
            ...bot, 
            intents: [...bot.intents, newIntent],
            responses: { 
              ...bot.responses, 
              [newIntent.name]: { 
                id: `response-${Date.now()}`, 
                text: "Default response" 
              } 
            }
          } 
        : bot
    ));
    
    setSelectedIntent(newIntent);
    
    toast({
      title: "Intent created",
      description: `New intent has been added. Don't forget to customize it.`
    });
  };

  const updateIntent = () => {
    if (!selectedChatbot || !selectedIntent) return;
    
    setChatbots(prev => prev.map(bot => 
      bot.id === selectedChatbotId 
        ? { 
            ...bot, 
            intents: bot.intents.map(intent => 
              intent.id === selectedIntent.id ? selectedIntent : intent
            ) 
          } 
        : bot
    ));
    
    toast({
      title: "Intent updated",
      description: `Intent has been updated successfully.`
    });
  };

  const addPhrase = () => {
    if (!selectedIntent || !newPhrase.trim()) return;
    
    setSelectedIntent({
      ...selectedIntent,
      phrases: [...selectedIntent.phrases, newPhrase]
    });
    
    setNewPhrase("");
  };

  const removePhrase = (phrase: string) => {
    if (!selectedIntent) return;
    
    setSelectedIntent({
      ...selectedIntent,
      phrases: selectedIntent.phrases.filter(p => p !== phrase)
    });
  };

  const updateResponse = () => {
    if (!selectedChatbot || !selectedIntent) return;
    
    setChatbots(prev => prev.map(bot => 
      bot.id === selectedChatbotId 
        ? { 
            ...bot, 
            responses: { 
              ...bot.responses, 
              [selectedIntent.name]: { 
                ...bot.responses[selectedIntent.name],
                text: responseText
              } 
            }
          } 
        : bot
    ));
    
    toast({
      title: "Response updated",
      description: `Response has been updated successfully.`
    });
  };

  // Chat Testing
  const sendMessage = () => {
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    
    // Simulate bot response
    setTimeout(() => {
      let botResponse = "I'm not sure how to respond to that.";
      
      if (selectedChatbot) {
        // Simple intent matching (in a real app, this would use NLP)
        const matchedIntent = selectedChatbot.intents.find(intent => 
          intent.phrases.some(phrase => 
            userMessage.toLowerCase().includes(phrase.toLowerCase())
          )
        );
        
        if (matchedIntent && selectedChatbot.responses[matchedIntent.name]) {
          botResponse = selectedChatbot.responses[matchedIntent.name].text;
        }
      }
      
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
    
    setUserMessage("");
  };

  // Initialize
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (chatbots.length > 0) {
        setSelectedChatbotId(chatbots[0].id);
      }
    }, 1000);
  }, []);

  // Update response text when selected intent changes
  useEffect(() => {
    if (selectedChatbot && selectedIntent && selectedChatbot.responses[selectedIntent.name]) {
      setResponseText(selectedChatbot.responses[selectedIntent.name].text);
    } else {
      setResponseText("");
    }
  }, [selectedChatbot, selectedIntent]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Chatbots</h1>
        <p className="text-gray-600">Create and manage AI-powered conversational interfaces</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Chatbot List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">My Chatbots</h3>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Plus size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Chatbot</DialogTitle>
                      <DialogDescription>
                        Enter details for your new chatbot.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Input
                        placeholder="Chatbot Name"
                        value={newChatbotData.name}
                        onChange={(e) => setNewChatbotData({...newChatbotData, name: e.target.value})}
                        className="mb-4"
                      />
                      <Textarea
                        placeholder="Description (optional)"
                        value={newChatbotData.description}
                        onChange={(e) => setNewChatbotData({...newChatbotData, description: e.target.value})}
                        className="mb-4"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewChatbotData({ name: "", description: "" })}>
                        Cancel
                      </Button>
                      <Button onClick={createChatbot} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Chatbot"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search chatbots"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-700"></div>
                  <span className="ml-2 text-sm">Loading...</span>
                </div>
              ) : filteredChatbots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No chatbots found</p>
                  <Button variant="link" onClick={() => setSearchQuery("")} className="text-sm">
                    Clear search
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredChatbots.map(chatbot => (
                    <div
                      key={chatbot.id}
                      className={`p-3 rounded-md cursor-pointer ${
                        selectedChatbotId === chatbot.id 
                          ? 'bg-purple-100 border-purple-300' 
                          : 'hover:bg-gray-50 border-transparent'
                      } border`}
                      onClick={() => setSelectedChatbotId(chatbot.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{chatbot.name}</h4>
                        <Badge className={chatbot.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {chatbot.status === 'active' ? 'Active' : 'Draft'}
                        </Badge>
                      </div>
                      {chatbot.description && (
                        <p className="text-gray-500 text-xs mt-1 truncate">{chatbot.description}</p>
                      )}
                      <p className="text-gray-400 text-xs mt-2">
                        Updated {formatDate(chatbot.updatedAt)}
                      </p>
                      
                      <div className="flex items-center mt-2 pt-2 border-t border-gray-100 gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingChatbot(chatbot);
                          }}
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateChatbot(chatbot);
                          }}
                        >
                          <Copy size={14} className="mr-1" />
                          Copy
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 text-xs text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(chatbot.id);
                          }}
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {!selectedChatbot ? (
            <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center p-8">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Chatbot Selected</h3>
                <p className="text-gray-500 mb-4">Select a chatbot from the list or create a new one to get started.</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus size={16} className="mr-2" />
                      Create New Chatbot
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Chatbot</DialogTitle>
                      <DialogDescription>
                        Enter details for your new chatbot.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Input
                        placeholder="Chatbot Name"
                        value={newChatbotData.name}
                        onChange={(e) => setNewChatbotData({...newChatbotData, name: e.target.value})}
                        className="mb-4"
                      />
                      <Textarea
                        placeholder="Description (optional)"
                        value={newChatbotData.description}
                        onChange={(e) => setNewChatbotData({...newChatbotData, description: e.target.value})}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewChatbotData({ name: "", description: "" })}>
                        Cancel
                      </Button>
                      <Button onClick={createChatbot} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Chatbot"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Chatbot header */}
              <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selectedChatbot.name}</h2>
                    <Badge className={selectedChatbot.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {selectedChatbot.status === 'active' ? 'Active' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm">{selectedChatbot.description}</p>
                </div>
                
                <div className="flex items-center mt-2 md:mt-0">
                  <Button 
                    variant={selectedChatbot.status === 'active' ? 'default' : 'outline'}
                    size="sm"
                    className="mr-2"
                    onClick={() => {
                      const updatedStatus = selectedChatbot.status === 'active' ? 'draft' : 'active';
                      setChatbots(prev => prev.map(bot => 
                        bot.id === selectedChatbotId 
                          ? { ...bot, status: updatedStatus } 
                          : bot
                      ));
                      
                      toast({
                        title: updatedStatus === 'active' ? 'Chatbot Activated' : 'Chatbot Deactivated',
                        description: updatedStatus === 'active' 
                          ? 'Your chatbot is now live and can be integrated into your apps.' 
                          : 'Your chatbot is now in draft mode.'
                      });
                    }}
                  >
                    {selectedChatbot.status === 'active' ? 'Active' : 'Publish'}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
              
              {/* Tabs */}
              <Tabs defaultValue="builder" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 border-b border-gray-200 rounded-none w-full">
                  <TabsTrigger value="builder" className="data-[state=active]:shadow-none">Builder</TabsTrigger>
                  <TabsTrigger value="test" className="data-[state=active]:shadow-none">Test</TabsTrigger>
                </TabsList>
                
                {/* Builder Tab */}
                <TabsContent 
                  value="builder" 
                  className="p-0 border-none"
                  onMouseEnter={builderMouseEnter}
                  onClick={builderClick}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                    {/* Intents Panel */}
                    <div 
                      className="p-4"
                      onMouseEnter={intentMouseEnter}
                      onClick={intentClick}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Intents</h3>
                        <Button variant="outline" size="sm" onClick={addIntent}>
                          <Plus size={14} className="mr-1" />
                          Add Intent
                        </Button>
                      </div>
                      
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {selectedChatbot.intents.length === 0 ? (
                          <div className="text-center py-4 border border-dashed border-gray-200 rounded-md">
                            <p className="text-sm text-gray-500">No intents created yet</p>
                            <p className="text-xs text-gray-400 mt-1">Intents help your chatbot understand user inputs</p>
                          </div>
                        ) : (
                          selectedChatbot.intents.map(intent => (
                            <div
                              key={intent.id}
                              className={`p-2 rounded-md border cursor-pointer ${
                                selectedIntent?.id === intent.id 
                                  ? 'bg-purple-50 border-purple-200' 
                                  : 'hover:bg-gray-50 border-gray-200'
                              }`}
                              onClick={() => setSelectedIntent(intent)}
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{intent.name}</h4>
                                <Badge className="text-xs">{intent.phrases.length} phrases</Badge>
                              </div>
                              {intent.phrases.length > 0 && (
                                <p className="text-gray-500 text-xs mt-1 truncate">{intent.phrases[0]}</p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Intent Editor */}
                    <div className="p-4">
                      {selectedIntent ? (
                        <>
                          <div className="mb-4">
                            <label className="text-sm font-medium block mb-1">Intent Name</label>
                            <Input
                              value={selectedIntent.name}
                              onChange={(e) => setSelectedIntent({...selectedIntent, name: e.target.value})}
                              className="mb-2"
                            />
                            <div className="flex justify-end">
                              <Button size="sm" variant="outline" onClick={updateIntent}>
                                <Save size={14} className="mr-1" />
                                Save Intent
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="text-sm font-medium block mb-2">Training Phrases</label>
                            <div className="flex mb-2">
                              <Input
                                placeholder="Add a new phrase"
                                value={newPhrase}
                                onChange={(e) => setNewPhrase(e.target.value)}
                                className="mr-2"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addPhrase();
                                  }
                                }}
                              />
                              <Button variant="outline" onClick={addPhrase}>
                                <Plus size={16} />
                              </Button>
                            </div>
                            
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                              {selectedIntent.phrases.map((phrase, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                                  <span className="text-sm">{phrase}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6" 
                                    onClick={() => removePhrase(phrase)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <p className="text-gray-500">Select or create an intent to edit</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Response Editor */}
                    <div className="p-4">
                      {selectedIntent ? (
                        <>
                          <div className="mb-4">
                            <label className="text-sm font-medium block mb-1">Response for "{selectedIntent.name}"</label>
                            <Textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              className="min-h-[150px] mb-2"
                              placeholder="Enter the response your chatbot should give for this intent..."
                            />
                            <div className="flex justify-end">
                              <Button size="sm" onClick={updateResponse}>
                                <Save size={14} className="mr-1" />
                                Save Response
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="text-sm font-medium mb-2">Response Preview</h4>
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-start mb-4">
                                  <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1">
                                    <MessageSquare size={16} className="text-gray-700" />
                                  </div>
                                  <div className="bg-purple-100 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm">{responseText || "No response configured yet."}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <p className="text-gray-500">Select an intent to edit its response</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Test Tab */}
                <TabsContent 
                  value="test" 
                  className="p-4 border-none"
                  onMouseEnter={testConsoleMouseEnter}
                  onClick={testConsoleClick}
                >
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                      <h3 className="font-medium">Test Conversation</h3>
                      <p className="text-xs text-gray-500">Try out your chatbot with sample messages</p>
                    </div>
                    
                    <div className="p-4 max-h-[400px] overflow-y-auto">
                      {chatMessages.map((msg, index) => (
                        <div 
                          key={index} 
                          className={`flex items-start mb-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                        >
                          {msg.sender === 'bot' && (
                            <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1">
                              <MessageSquare size={16} className="text-gray-700" />
                            </div>
                          )}
                          <div 
                            className={`rounded-lg p-3 max-w-[80%] ${
                              msg.sender === 'user' 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-gray-100'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          {msg.sender === 'user' && (
                            <div className="bg-purple-200 rounded-full w-8 h-8 flex items-center justify-center ml-3 mt-1">
                              <div className="text-sm font-medium">You</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-3 border-t border-gray-200">
                      <div className="flex">
                        <Input
                          placeholder="Type a message..."
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          className="mr-2"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              sendMessage();
                            }
                          }}
                        />
                        <Button onClick={sendMessage}>
                          <Send size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit chatbot dialog */}
      <Dialog open={!!editingChatbot} onOpenChange={(open) => !open && setEditingChatbot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chatbot</DialogTitle>
            <DialogDescription>
              Update the details of your chatbot.
            </DialogDescription>
          </DialogHeader>
          {editingChatbot && (
            <div className="py-4">
              <Input
                placeholder="Chatbot Name"
                value={editingChatbot.name}
                onChange={(e) => setEditingChatbot({...editingChatbot, name: e.target.value})}
                className="mb-4"
              />
              <Textarea
                placeholder="Description (optional)"
                value={editingChatbot.description}
                onChange={(e) => setEditingChatbot({...editingChatbot, description: e.target.value})}
                className="mb-4"
              />
              <div className="flex items-center mb-4">
                <span className="mr-2">Status:</span>
                <Button 
                  variant={editingChatbot.status === 'active' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setEditingChatbot({...editingChatbot, status: 'active'})}
                  className="mr-2"
                >
                  Active
                </Button>
                <Button 
                  variant={editingChatbot.status === 'draft' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setEditingChatbot({...editingChatbot, status: 'draft'})}
                >
                  Draft
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingChatbot(null)}>Cancel</Button>
            <Button onClick={updateChatbot} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chatbot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chatbot? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => chatbotToDelete && deleteChatbot(chatbotToDelete)}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Chatbot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
