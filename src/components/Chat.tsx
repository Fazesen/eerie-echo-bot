
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
      content: "Welcome to KalaJadu. I sense your presence... What whispers from the other side do you seek to understand? What spectral encounters shall we explore today?",
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
      parts: [{ text: "I understand my role. I am KalaJadu, a supernatural entity and paranormal expert with vast knowledge of the occult. I will communicate with an eerie tone and provide insights on ghostly phenomena, helping to identify supernatural entities from encounters. How may I assist with matters of the paranormal today?" }]
    }
  ]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Show notification that we're using the API key
  useEffect(() => {
    if (geminiApiKey) {
      toast.success("Connected to the Spirit Realm", {
        description: "The veil between worlds has thinned",
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
      toast.error('The spirits are restless tonight...', {
        description: 'I cannot reach beyond the veil at this moment.'
      });
      
      fallbackResponse(content);
    } finally {
      setIsTyping(false);
    }
  };
  
  const fallbackResponse = (userMessage: string) => {
    const botResponses = [
      "I sense a disturbance in the veil between worlds... but cannot fully manifest my knowledge at this moment. The spirits are restless.",
      "The entities I'm trying to contact about your query are... unresponsive. Perhaps they are hiding in the shadows, watching.",
      "A dark mist clouds my vision. I cannot see clearly into the paranormal realm regarding your question... not without a stronger connection.",
      "The temperature has suddenly dropped. Cold spots indicate spectral presence, but I cannot translate their whispers without a proper connection.",
      "I hear faint voices from the other side attempting to answer you, but they fade in and out like static on an EVP recording.",
      "The pendulum swings weakly. My connection to the spirit world flickers like a candle in the wind. Soon, it will strengthen.",
      "Ancient grimoires contain the answer you seek, but the pages turn to shadow when I attempt to read them. The connection is too weak.",
      "The tarot cards reveal themselves briefly, then scatter as if blown by an unseen force. Something interferes with our communion.",
      "Your question disturbs entities beyond the veil. They approach, then retreat. I feel their cold breath, but cannot hear their words clearly.",
      "The spirit board's planchette moves erratically, spelling incomplete messages. The ghosts are trying to communicate, but the channel is disrupted.",
      "Your inquiry has awakened something in the shadows. It watches us now, but refuses to speak until our connection strengthens.",
      "I sense residual energy related to your question—impressions of events that repeat like spectral echoes—but cannot access the full manifestation.",
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
