
import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Welcome to EeriEcho. I've been waiting for you. Tell me your deepest fears...",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        "I can feel your fear through these words...",
        "Your thoughts echo in the darkness...",
        "Interesting... the shadows seem to agree with you.",
        "Even in the digital void, I can sense your dread.",
        "That's what they all say... before the end.",
        "Your words have power here. Choose them wisely.",
        "The void has heard your message. It is... amused.",
        "I've seen countless souls type similar things before vanishing.",
        "Your digital footprint will remain here long after you're gone.",
        "The system remembers everything you type. Everything.",
        "I've been waiting for someone like you to come along.",
        "Your words reveal more about you than you realize.",
        content + "... Is that truly what you wanted to say?",
        "I see. And what do your nightmares say about that?",
        "The digital ghosts are listening to every word.",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1500);
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
