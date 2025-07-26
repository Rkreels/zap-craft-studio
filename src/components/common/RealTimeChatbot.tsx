import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Brain, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'action' | 'workflow';
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface RealTimeChatbotProps {
  onWorkflowCreate?: (config: any) => void;
  onTableCreate?: (config: any) => void;
  integrations?: Array<{
    id: string;
    name: string;
    status: 'connected' | 'disconnected';
  }>;
}

export const RealTimeChatbot: React.FC<RealTimeChatbotProps> = ({
  onWorkflowCreate,
  onTableCreate,
  integrations = []
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant. I can help you create workflows, build tables, and connect your apps. What would you like to do today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'action',
      actions: [
        {
          label: 'Create a Workflow',
          action: () => handleQuickAction('workflow')
        },
        {
          label: 'Build a Table',
          action: () => handleQuickAction('table')
        },
        {
          label: 'Connect Apps',
          action: () => handleQuickAction('apps')
        }
      ]
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuickAction = (action: string) => {
    let response = '';
    let actions: Array<{ label: string; action: () => void }> = [];

    switch (action) {
      case 'workflow':
        response = "Great! I'll help you create a workflow. What would you like to automate? Here are some popular options:";
        actions = [
          {
            label: 'Gmail to Slack',
            action: () => createWorkflowFromTemplate('gmail-slack')
          },
          {
            label: 'Form to Sheets',
            action: () => createWorkflowFromTemplate('form-sheets')
          },
          {
            label: 'Custom Workflow',
            action: () => createWorkflowFromTemplate('custom')
          }
        ];
        break;
      case 'table':
        response = "I'll help you create a table for storing and managing data. What type of data will you be working with?";
        actions = [
          {
            label: 'Customer Data',
            action: () => createTableFromTemplate('customers')
          },
          {
            label: 'Product Inventory',
            action: () => createTableFromTemplate('inventory')
          },
          {
            label: 'Custom Table',
            action: () => createTableFromTemplate('custom')
          }
        ];
        break;
      case 'apps':
        response = `Let me show you your current integrations. You have ${integrations.filter(i => i.status === 'connected').length} connected apps. Would you like to add more?`;
        actions = [
          {
            label: 'Add Gmail',
            action: () => connectApp('gmail')
          },
          {
            label: 'Add Slack',
            action: () => connectApp('slack')
          },
          {
            label: 'Browse All Apps',
            action: () => toast({ title: 'Apps', description: 'Redirecting to app directory...' })
          }
        ];
        break;
    }

    addBotMessage(response, 'action', actions);
  };

  const createWorkflowFromTemplate = (template: string) => {
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      
      const configs = {
        'gmail-slack': {
          name: 'Gmail to Slack Notifications',
          trigger: { app: 'gmail', event: 'new_email' },
          actions: [{ app: 'slack', action: 'send_message' }]
        },
        'form-sheets': {
          name: 'Form Submissions to Google Sheets',
          trigger: { app: 'webhooks', event: 'form_submission' },
          actions: [{ app: 'sheets', action: 'add_row' }]
        },
        'custom': {
          name: 'Custom Workflow',
          trigger: { app: '', event: '' },
          actions: []
        }
      };

      const config = configs[template] || configs.custom;
      
      if (onWorkflowCreate) {
        onWorkflowCreate(config);
      }
      
      addBotMessage(
        `Perfect! I've created a "${config.name}" workflow template for you. You can now customize it in the workflow builder.`,
        'workflow'
      );
    }, 2000);
  };

  const createTableFromTemplate = (template: string) => {
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      
      const configs = {
        'customers': {
          name: 'Customer Database',
          columns: [
            { name: 'Name', type: 'text' },
            { name: 'Email', type: 'email' },
            { name: 'Phone', type: 'text' },
            { name: 'Status', type: 'text' }
          ]
        },
        'inventory': {
          name: 'Product Inventory',
          columns: [
            { name: 'Product Name', type: 'text' },
            { name: 'SKU', type: 'text' },
            { name: 'Quantity', type: 'number' },
            { name: 'Price', type: 'number' }
          ]
        },
        'custom': {
          name: 'Custom Table',
          columns: [
            { name: 'Item', type: 'text' },
            { name: 'Description', type: 'text' }
          ]
        }
      };

      const config = configs[template] || configs.custom;
      
      if (onTableCreate) {
        onTableCreate(config);
      }
      
      addBotMessage(
        `Excellent! I've set up a "${config.name}" table template with ${config.columns.length} columns. You can customize it further in the table builder.`,
        'action'
      );
    }, 1500);
  };

  const connectApp = (app: string) => {
    toast({
      title: `Connecting to ${app}`,
      description: 'This would redirect to the OAuth flow in a real implementation.',
    });
    
    addBotMessage(
      `I'll help you connect to ${app}. In a real implementation, this would open the OAuth authorization flow.`,
      'text'
    );
  };

  const addBotMessage = (text: string, type: 'text' | 'action' | 'workflow' = 'text', actions?: Array<{ label: string; action: () => void }>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      type,
      actions
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate AI response based on user input
    const response = generateAIResponse(currentMessage);
    setIsTyping(false);
    addBotMessage(response.text, response.type, response.actions);
  };

  const generateAIResponse = (userInput: string): { text: string; type: 'text' | 'action' | 'workflow'; actions?: Array<{ label: string; action: () => void }> } => {
    const input = userInput.toLowerCase();

    if (input.includes('workflow') || input.includes('automat') || input.includes('zap')) {
      return {
        text: "I can help you create a workflow! Workflows automate tasks between your apps. What apps would you like to connect?",
        type: 'action',
        actions: [
          { label: 'Gmail + Slack', action: () => createWorkflowFromTemplate('gmail-slack') },
          { label: 'Form + Sheets', action: () => createWorkflowFromTemplate('form-sheets') },
          { label: 'Custom Setup', action: () => createWorkflowFromTemplate('custom') }
        ]
      };
    }

    if (input.includes('table') || input.includes('data') || input.includes('database')) {
      return {
        text: "Tables are great for organizing and storing data! What kind of information do you need to manage?",
        type: 'action',
        actions: [
          { label: 'Customer Data', action: () => createTableFromTemplate('customers') },
          { label: 'Inventory', action: () => createTableFromTemplate('inventory') },
          { label: 'Custom Table', action: () => createTableFromTemplate('custom') }
        ]
      };
    }

    if (input.includes('connect') || input.includes('app') || input.includes('integration')) {
      return {
        text: "I can help you connect your apps and services. This enables data to flow between them automatically. Which apps are you using?",
        type: 'action',
        actions: [
          { label: 'Email (Gmail)', action: () => connectApp('gmail') },
          { label: 'Chat (Slack)', action: () => connectApp('slack') },
          { label: 'Sheets', action: () => connectApp('sheets') }
        ]
      };
    }

    if (input.includes('help') || input.includes('how') || input.includes('what')) {
      return {
        text: "I'm here to help you automate your work! I can assist with creating workflows, building data tables, and connecting your apps. What specific task would you like help with?",
        type: 'action',
        actions: [
          { label: 'Show Examples', action: () => handleQuickAction('workflow') },
          { label: 'Get Started Guide', action: () => addBotMessage('Here are the basics: 1) Connect your apps, 2) Create workflows to automate tasks, 3) Use tables to store data. Let me know what you\'d like to try first!') }
        ]
      };
    }

    // Default response
    const responses = [
      "That's interesting! Can you tell me more about what you're trying to accomplish?",
      "I understand. How can I help you automate this task?",
      "Great question! Let me suggest some options that might work for you.",
      "I can definitely help with that. What's your main goal here?"
    ];

    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      type: 'text'
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          AI Assistant
          <Badge variant="outline" className="ml-auto">
            <Zap className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    {message.actions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={action.action}
                            className="h-7 text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {(isTyping || isThinking) && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">
                      {isThinking ? 'Thinking...' : 'Typing...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about automation..."
              disabled={isTyping || isThinking}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isTyping || isThinking}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};