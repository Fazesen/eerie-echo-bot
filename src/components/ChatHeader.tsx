
import React from 'react';
import { Skull } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-horror-blood/30 bg-horror-darker rounded-t-lg">
      <div className="flex items-center">
        <div className="relative mr-3">
          <Skull className="h-7 w-7 text-horror-blood" />
          <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-200 glitch-text">EeriEcho</h2>
          <p className="text-xs text-gray-400">Online | Waiting for your fears...</p>
        </div>
      </div>
      <div className="text-xs text-horror-blood animate-pulse">
        System Status: <span className="text-green-500">ACTIVE</span>
      </div>
    </div>
  );
};

export default ChatHeader;
