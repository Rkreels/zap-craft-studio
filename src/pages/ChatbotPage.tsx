
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MessageSquare, Settings, Send, Bot, Save, Plus, ChevronDown, ChevronRight, Zap, Info, Circle, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type ChatbotConfig = {
  name: string;
  description: string;
  isActive: boolean;
  promptTemplate: string;
  maxResponseTokens: number;
  temperature: number;
};

const mockConversations = [
  {
    id: "chat-1",
    name: "Support Chatbot",
    lastMessage: "How can I help you with your order today?",
    lastActivity: new Date("2025-05-13T10:20:00Z"),
    messages: 12,
  },
  {
    id: "chat-2",
    name: "Sales Assistant",
    lastMessage: "Here are some product recommendations based on your preferences.",
    lastActivity: new Date("2025-05-12T08:45:00Z"),
    messages: 24,
  },
  {
    id: "chat-3",
    name: "Data Query Bot",
    lastMessage: "Your data has been successfully queried. Here are the results.",
    lastActivity: new Date("2025-05-10T16:30:00Z"),
    messages: 8,
  },
];

export default function ChatbotPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      content: "Hi there! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedChat, setSelectedChat] = useState(mockConversations[0].id);
  
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig>({
    name: "Customer Support Bot",
    description: "AI assistant for answering customer queries",
    isActive: true,
    promptTemplate: "You are a helpful customer support assistant for our company. Answer questions politely and concisely.",
    maxResponseTokens: 500,
    temperature: 0.7,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I understand your question. Let me find the answer for you.",
        "Thank you for your query. Here's what I found.",
        "Based on the information you provided, here's my recommendation.",
        "I can help you with that. Here's what you need to know.",
        "That's a great question! Here's the information you're looking for."
      ];
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSaveConfig = () => {
    toast({
      title: "Configuration saved",
      description: "Your chatbot settings have been updated",
    });
  };

  const handleConfigChange = (key: keyof ChatbotConfig, value: any) => {
    setChatbotConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const createNewChat = () => {
    const newChat = {
      id: `chat-${Date.now()}`,
      name: "New Conversation",
      lastMessage: "",
      lastActivity: new Date(),
      messages: 0,
    };
    
    setConversations((prev) => [newChat, ...prev]);
    setSelectedChat(newChat.id);
    setMessages([{
      id: "welcome-msg-new",
      content: "Hi there! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    }]);
    
    toast({
      title: "New conversation created",
      description: "You can now start chatting with your AI assistant.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Chatbot</h1>
        <p className="text-gray-600">Build AI-powered chatbots to assist your users</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto mb-6 grid grid-cols-2 md:flex">
          <TabsTrigger value="chat">
            <MessageSquare size={16} className="mr-2" /> Chat
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings size={16} className="mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-0">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Chat sidebar */}
            <div className="w-full lg:w-1/3">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Conversations</CardTitle>
                    <Button variant="ghost" size="icon" onClick={createNewChat}>
                      <Plus size={18} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[500px] overflow-y-auto">
                    {conversations.map((chat) => (
                      <div 
                        key={chat.id}
                        className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          chat.id === selectedChat ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-sm">{chat.name}</h3>
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">
                              {chat.lastMessage || "No messages yet"}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDate(chat.lastActivity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat area */}
            <div className="flex-1">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg flex items-center">
                    <Bot size={18} className="mr-2 text-purple-600" />
                    {conversations.find(chat => chat.id === selectedChat)?.name || "Chat"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <div className="flex-1 overflow-y-auto p-4 h-[500px]">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70 text-right">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex mb-4">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef}></div>
                  </div>

                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t flex gap-2"
                  >
                    <Input
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isTyping}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={isTyping || !input.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send size={16} className="mr-2" />
                      Send
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Chatbot Configuration</CardTitle>
              <CardDescription>
                Customize how your chatbot works and responds to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="chatbot-name">Chatbot Name</Label>
                  <Input
                    id="chatbot-name"
                    value={chatbotConfig.name}
                    onChange={(e) => handleConfigChange("name", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="chatbot-active">Activate Chatbot</Label>
                    <p className="text-sm text-gray-500">
                      Turn your chatbot on or off
                    </p>
                  </div>
                  <Switch
                    id="chatbot-active"
                    checked={chatbotConfig.isActive}
                    onCheckedChange={(checked) => handleConfigChange("isActive", checked)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="chatbot-description">Description</Label>
                <Input
                  id="chatbot-description"
                  value={chatbotConfig.description}
                  onChange={(e) => handleConfigChange("description", e.target.value)}
                  className="mt-1.5"
                />
              </div>
              
              <div>
                <Label htmlFor="chatbot-prompt">System Prompt</Label>
                <p className="text-sm text-gray-500 mb-1.5">
                  This is the instruction that guides how your chatbot responds
                </p>
                <textarea
                  id="chatbot-prompt"
                  value={chatbotConfig.promptTemplate}
                  onChange={(e) => handleConfigChange("promptTemplate", e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <Label htmlFor="max-tokens">Max Response Tokens</Label>
                    <span className="text-sm text-gray-500">{chatbotConfig.maxResponseTokens}</span>
                  </div>
                  <input
                    type="range"
                    id="max-tokens"
                    min="100"
                    max="2000"
                    step="50"
                    value={chatbotConfig.maxResponseTokens}
                    onChange={(e) => handleConfigChange("maxResponseTokens", Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>100</span>
                    <span>2000</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1.5">
                    <Label htmlFor="temperature">Temperature</Label>
                    <span className="text-sm text-gray-500">{chatbotConfig.temperature.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    id="temperature"
                    min="0"
                    max="2"
                    step="0.1"
                    value={chatbotConfig.temperature}
                    onChange={(e) => handleConfigChange("temperature", Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Precise (0)</span>
                    <span>Creative (2)</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end p-6 pt-2 border-t">
              <Button onClick={handleSaveConfig} className="bg-purple-600 hover:bg-purple-700">
                <Save size={16} className="mr-2" />
                Save Configuration
              </Button>
            </div>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Integration</CardTitle>
              <CardDescription>
                Add this chatbot to your website or application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-md font-medium mb-2 flex items-center">
                  <Zap size={16} className="mr-2 text-purple-600" />
                  Integration Methods
                </h3>
                <div className="space-y-4 mt-4">
                  <div className="border rounded-lg">
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <CheckCircle size={20} className="mr-3 text-green-600" />
                        <div>
                          <h4 className="font-medium">Website Widget</h4>
                          <p className="text-sm text-gray-500">
                            Add a chat widget to your website
                          </p>
                        </div>
                      </div>
                      <ChevronDown size={18} className="text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg">
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <Circle size={20} className="mr-3 text-gray-400" />
                        <div>
                          <h4 className="font-medium">API Integration</h4>
                          <p className="text-sm text-gray-500">
                            Connect via API for custom applications
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg">
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <Circle size={20} className="mr-3 text-gray-400" />
                        <div>
                          <h4 className="font-medium">Embed Code</h4>
                          <p className="text-sm text-gray-500">
                            Embed the chatbot directly in your site
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <Info size={18} className="mr-2 text-blue-600 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Need help integrating your chatbot? Check out our 
                    <a href="#" className="text-purple-600 hover:text-purple-800 ml-1">documentation</a> or 
                    <a href="#" className="text-purple-600 hover:text-purple-800 ml-1">contact support</a>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
