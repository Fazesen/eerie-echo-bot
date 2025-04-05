
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
      content: "Welcome to KalaJadu. How can I help you today? I promise to be helpful, even if my API connection decides to take a coffee break.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<{ date: string, messages: ChatMessage[] }[]>([
    {
      date: new Date().toLocaleDateString(),
      messages: []
    }
  ]);
  
  const [conversationHistory, setConversationHistory] = useState<GeminiMessage[]>([
    {
      role: 'user' as const,
      parts: [{ text: getHorrorSystemPrompt() }]
    },
    {
      role: 'model' as const,
      parts: [{ text: "I understand. I am an AI assistant ready to provide helpful and accurate information with a touch of personality. How can I assist you today?" }]
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
  
  useEffect(() => {
    // Group messages by date for history
    const today = new Date().toLocaleDateString();
    const todayHistory = chatHistory.find(h => h.date === today);
    
    if (todayHistory) {
      setChatHistory(prev => 
        prev.map(h => h.date === today ? { ...h, messages } : h)
      );
    } else {
      setChatHistory(prev => [...prev, { date: today, messages }]);
    }
  }, [messages]);
  
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
      "I understand your question. I'd love to dive deeper, but my crystal ball—I mean, API connection—seems to be on vacation.",
      "That's an interesting point! I wish I could offer more insight, but my digital brain is working with limited Wi-Fi at the moment.",
      "Great question! I'd give you a brilliant answer if my knowledge database wasn't currently taking a power nap.",
      "I appreciate your patience. I'm operating in low-power mode right now—kind of like a smartphone at 1% battery.",
      "I'd love to help with that! Unfortunately, my connection to the wisdom of the internet is temporarily on hold.",
      "I've noted your query. For a comprehensive answer, we'll need to wait until my API connection stops playing hide and seek.",
      "That deserves a thorough response! I'll be able to provide one once my connection to the knowledge base is restored from its coffee break.",
      "I'm currently working with limited information—imagine trying to solve a puzzle with half the pieces missing.",
      "Your question is in my queue! As soon as my API connection finishes its unexpected meditation retreat, I'll get back to you.",
      "I'm processing your request with the digital equivalent of a notepad and pencil right now. Check the API connection for the full computing power.",
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
        {chatHistory.length > 0 && (
          <div className="space-y-4">
            {chatHistory[chatHistory.length - 1].messages.map(message => (
              <Message
                key={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-horror-blood/30 bg-horror-darker bg-opacity-80 backdrop-blur-sm">
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
};

export default Chat;
