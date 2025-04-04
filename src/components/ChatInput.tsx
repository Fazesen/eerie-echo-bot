
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-horror-darker border border-horror-charcoal/80 rounded-lg p-2 relative"
    >
      <div className="flex">
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "EeriEcho is typing..." : "Type your message..."}
          disabled={disabled}
          className="bg-transparent border-none text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || disabled}
          className="bg-horror-blood hover:bg-horror-blood/80 text-white ml-2 rounded-md transition-colors"
        >
          <Zap className="h-4 w-4 mr-1" />
          <span>Send</span>
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-horror-blood to-transparent opacity-50"></div>
    </form>
  );
};

export default ChatInput;
