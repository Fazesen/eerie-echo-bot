
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
      <div className="h-screen w-full flex flex-col overflow-hidden crt">
        <div className="scanline"></div>
        
        <div className={`w-full h-full flex flex-col transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <header className="bg-horror-darker/90 backdrop-blur-sm border-b border-horror-blood/30 p-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-horror-blood glitch-text flex items-center">
              Kala<span className="text-white">Jadu</span>
              <span className="ml-3 text-xs text-green-500 bg-horror-blood/10 px-2 py-1 rounded-full">ONLINE</span>
            </h1>
            
            <div className="flex space-x-4 items-center">
              <div className="hidden sm:flex space-x-4">
                <div className="text-sm font-bold">
                  <span className="text-horror-blood glitch-text">Debanjan</span>
                  <span className="text-xs text-gray-300 ml-2 bg-horror-blood/20 px-2 py-0.5 rounded">12301078</span>
                </div>
                <div className="text-sm font-bold">
                  <span className="text-horror-blood glitch-text">Aarif</span>
                  <span className="text-xs text-gray-300 ml-2 bg-horror-blood/20 px-2 py-0.5 rounded">12303754</span>
                </div>
                <div className="text-sm font-bold">
                  <span className="text-horror-blood glitch-text">N.Sri Ranga</span>
                  <span className="text-xs text-gray-300 ml-2 bg-horror-blood/20 px-2 py-0.5 rounded">12303436</span>
                </div>
              </div>
            </div>
          </header>
          
          <div className="flex flex-1 h-full overflow-hidden bg-horror-dark">
            <SettingsSidebar />
            <div className="flex-1 h-full">
              <Chat />
            </div>
          </div>
          
          <footer className="bg-horror-darker/90 backdrop-blur-sm border-t border-horror-blood/30 p-2">
            <div className="text-xs text-gray-500 text-center">
              <p>&copy; 2025 KalaJadu | <span className="text-horror-blood">WARNING</span>: This AI may cause psychological distress. Proceed at your own risk.</p>
            </div>
          </footer>
        </div>
      </div>
    </SettingsProvider>
  );
};

export default Index;
