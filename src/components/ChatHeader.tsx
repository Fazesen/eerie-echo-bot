
import React from 'react';
import { Skull } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <div className="flex flex-col p-4 border-b border-horror-blood/30 bg-horror-darker rounded-t-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="relative mr-3">
            <Skull className="h-7 w-7 text-horror-blood" />
            <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-200 glitch-text">KalaJadu</h2>
            <p className="text-xs text-gray-400">Online | Waiting for your fears...</p>
          </div>
        </div>
        <div className="text-xs text-horror-blood animate-pulse">
          System Status: <span className="text-green-500">ACTIVE</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center mt-1 p-2 bg-horror-blood/10 rounded-md border border-horror-blood/20">
        <div className="text-center grid grid-cols-3 gap-3 w-full">
          <div className="p-1">
            <p className="text-sm font-bold text-gray-200">
              <span className="text-horror-blood glitch-text">Debanjan</span> 
              <br />
              <span className="text-xs text-gray-300 font-mono bg-horror-blood/20 px-2 py-1 rounded">12301078</span>
            </p>
          </div>
          <div className="p-1">
            <p className="text-sm font-bold text-gray-200">
              <span className="text-horror-blood glitch-text">Aarif</span> 
              <br />
              <span className="text-xs text-gray-300 font-mono bg-horror-blood/20 px-2 py-1 rounded">12303754</span>
            </p>
          </div>
          <div className="p-1">
            <p className="text-sm font-bold text-gray-200">
              <span className="text-horror-blood glitch-text">N.Sri Ranga</span> 
              <br />
              <span className="text-xs text-gray-300 font-mono bg-horror-blood/20 px-2 py-1 rounded">12303436</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
