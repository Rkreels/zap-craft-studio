
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface ChatbotConfig {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  personality: 'professional' | 'friendly' | 'casual' | 'technical';
  responseStyle: 'concise' | 'detailed' | 'balanced';
  features: {
    voiceInput: boolean;
    fileUpload: boolean;
    codeExecution: boolean;
    webSearch: boolean;
  };
  integrations: {
    zapier: boolean;
    googleSheets: boolean;
    slack: boolean;
    email: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const useChatbot = () => {
  const [chatbots, setChatbots] = useState<ChatbotConfig[]>([]);
  const [currentChatbot, setCurrentChatbot] = useState<ChatbotConfig | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const createChatbot = useCallback((config: Omit<ChatbotConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newChatbot: ChatbotConfig = {
      ...config,
      id: `chatbot_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setChatbots(prev => [...prev, newChatbot]);
    setCurrentChatbot(newChatbot);

    toast({
      title: 'Chatbot created',
      description: `Chatbot "${config.name}" has been created.`
    });

    return newChatbot;
  }, []);

  const createSession = useCallback((chatbotId?: string) => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: `Chat ${new Date().toLocaleTimeString()}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true
    };

    setSessions(prev => [...prev.map(s => ({ ...s, active: false })), newSession]);
    setCurrentSession(newSession);

    return newSession;
  }, []);

  const sendMessage = useCallback(async (content: string, sessionId?: string) => {
    const targetSession = sessionId ? sessions.find(s => s.id === sessionId) : currentSession;
    if (!targetSession) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    // Update session with user message
    const updatedSession = {
      ...targetSession,
      messages: [...targetSession.messages, userMessage],
      updatedAt: new Date()
    };

    setSessions(prev => prev.map(s => s.id === targetSession.id ? updatedSession : s));
    setCurrentSession(updatedSession);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your request. Let me help you with that.",
        "That's an interesting question. Based on the context, I would suggest...",
        "I can help you automate this workflow. Here's what I recommend:",
        "Let me break this down for you step by step.",
        "Great question! Here's how we can approach this problem:"
      ];

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)] + 
                 ` For "${content}", I would recommend creating a workflow that connects your apps and automates the process.`,
        timestamp: new Date()
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage],
        updatedAt: new Date()
      };

      setSessions(prev => prev.map(s => s.id === targetSession.id ? finalSession : s));
      setCurrentSession(finalSession);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);

  }, [sessions, currentSession]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  }, [currentSession]);

  const updateChatbot = useCallback((chatbotId: string, updates: Partial<ChatbotConfig>) => {
    setChatbots(prev => prev.map(bot => 
      bot.id === chatbotId 
        ? { ...bot, ...updates, updatedAt: new Date() }
        : bot
    ));

    if (currentChatbot?.id === chatbotId) {
      setCurrentChatbot(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  }, [currentChatbot]);

  return {
    chatbots,
    currentChatbot,
    sessions,
    currentSession,
    isTyping,
    createChatbot,
    createSession,
    sendMessage,
    deleteSession,
    updateChatbot,
    setCurrentChatbot,
    setCurrentSession
  };
};
