
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Ghost, Skull } from 'lucide-react';

interface MessageProps {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Message: React.FC<MessageProps> = ({ content, sender, timestamp }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(sender === 'bot');
  
  useEffect(() => {
    setIsVisible(true);
    
    if (sender === 'bot') {
      let i = 0;
      const typingEffect = setInterval(() => {
        if (i < content.length) {
          setDisplayedContent(content.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingEffect);
          setIsTyping(false);
        }
      }, 30);
      
      return () => clearInterval(typingEffect);
    } else {
      setDisplayedContent(content);
    }
  }, [content, sender]);
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(timestamp);
  
  return (
    <div
      className={cn(
        'flex items-start mb-4 transition-opacity duration-500',
        isVisible ? 'opacity-100' : 'opacity-0',
        sender === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {sender === 'bot' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-horror-charcoal flex items-center justify-center mr-2">
          <Skull className="w-5 h-5 text-horror-blood animate-pulse" />
        </div>
      )}
      
      <div className={cn(
        'max-w-[80%] px-4 py-3 rounded-lg',
        sender === 'user' 
          ? 'bg-horror-charcoal text-gray-200 rounded-tr-none'
          : 'bg-horror-darker text-gray-300 rounded-tl-none border border-horror-blood/30'
      )}>
        <div className="flex items-center mb-1">
          <span className={cn(
            'text-xs',
            sender === 'user' ? 'text-gray-400' : 'text-horror-blood'
          )}>
            {sender === 'user' ? 'You' : 'EeriEcho'}
          </span>
          <span className="text-xs text-gray-500 ml-2">{formattedTime}</span>
        </div>
        
        <p className={cn(
          'text-sm',
          sender === 'bot' && isTyping ? 'border-r-horror-blood' : '',
          sender === 'bot' ? 'glitch-text' : ''
        )}>
          {sender === 'bot' ? displayedContent : content}
          {isTyping && <span className="inline-block w-1 h-4 bg-horror-blood ml-1 animate-cursor-blink"></span>}
        </p>
      </div>
      
      {sender === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center ml-2">
          <Ghost className="w-5 h-5 text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default Message;
