
import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { useSettings } from '@/contexts/SettingsContext';
import { generateGeminiResponse, getHorrorSystemPrompt, GeminiMessage } from '@/services/geminiService';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const { geminiApiKey } = useSettings();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Welcome to the AI Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversationHistory, setConversationHistory] = useState<GeminiMessage[]>([
    {
      role: 'user' as const,
      parts: [{ text: getHorrorSystemPrompt() }]
    },
    {
      role: 'model' as const,
      parts: [{ text: "I understand. I am an AI assistant ready to provide helpful and accurate information. How can I assist you today?" }]
    }
  ]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Show notification that we're using the API key
  useEffect(() => {
    if (geminiApiKey) {
      toast.success("Connected to Gemini AI", {
        description: "Using provided API key for enhanced responses",
        duration: 3000
      });
    }
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    const updatedHistory: GeminiMessage[] = [
      ...conversationHistory,
      {
        role: 'user' as const,
        parts: [{ text: content }]
      }
    ];
    
    setConversationHistory(updatedHistory);
    
    try {
      if (geminiApiKey) {
        const response = await generateGeminiResponse(updatedHistory, geminiApiKey);
        
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          content: response,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        setConversationHistory([
          ...updatedHistory,
          {
            role: 'model' as const,
            parts: [{ text: response }]
          }
        ]);
      } else {
        fallbackResponse(content);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get a response from Gemini API.', {
        description: 'Falling back to pre-programmed responses.'
      });
      
      fallbackResponse(content);
    } finally {
      setIsTyping(false);
    }
  };
  
  const fallbackResponse = (userMessage: string) => {
    const botResponses = [
      "I understand your question. Without my full capabilities, I can only provide a limited response.",
      "That's an interesting point. I'd like to explore that further when my full functionality is available.",
      "Thank you for your message. I'm operating with limited capabilities at the moment.",
      "I appreciate your patience. For more detailed information, please try again later when I have API access.",
      "I'm currently running in fallback mode. Your question requires more context than I can process right now.",
      "I've noted your query. For a more comprehensive answer, please ensure the API connection is working.",
      "That's a good question that deserves a thorough response when my connection to the knowledge base is restored.",
      "I'd like to provide more information on this topic once I have access to my complete resources.",
      "I'm currently working with limited information. Your question has been received.",
      "I'm processing your request with limited capabilities. For better assistance, please check the API connection.",
    ];
    
    const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
    
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      content: randomResponse,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 bg-opacity-80 backdrop-blur-sm">
        <div className="space-y-4">
          {messages.map(message => (
            <Message
              key={message.id}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-horror-blood/30 bg-horror-darker bg-opacity-80 backdrop-blur-sm">
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
};

export default Chat;
