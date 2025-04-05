
import React, { useEffect, useState } from 'react';
import Chat from '../components/Chat';
import SettingsSidebar from '../components/SettingsSidebar';
import { SettingsProvider } from '@/contexts/SettingsContext';

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SettingsProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 crt">
        <div className="scanline"></div>
        
        <div className={`w-full max-w-2xl transition-all duration-1000 relative ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-3xl font-bold text-horror-blood glitch-text">
              Kala<span className="text-white">Jadu</span>
            </h1>
          </div>
          
          <div className="border border-horror-blood/40 bg-horror-darker/70 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-[70vh] relative">
            <SettingsSidebar />
            <Chat />
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>&copy; 2025 KalaJadu | <span className="text-horror-blood">WARNING</span>: This AI may cause psychological distress. Proceed at your own risk.</p>
          </div>
        </div>
      </div>
    </SettingsProvider>
  );
};

export default Index;
