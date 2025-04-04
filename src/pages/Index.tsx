
import React, { useEffect, useState } from 'react';
import Chat from '../components/Chat';

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 crt">
      <div className="scanline"></div>
      
      <div className={`w-full max-w-2xl transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-3xl font-bold text-horror-blood glitch-text">
            Eeri<span className="text-white">Echo</span>
          </h1>
        </div>
        
        <div className="border border-horror-blood/40 bg-horror-darker/70 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-[70vh]">
          <Chat />
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>&copy; 2025 EeriEcho | <span className="text-horror-blood">WARNING</span>: This AI may cause psychological distress. Proceed at your own risk.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
