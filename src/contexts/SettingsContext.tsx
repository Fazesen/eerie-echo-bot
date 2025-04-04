
import React, { createContext, useContext, useState, useEffect } from 'react';

type SettingsContextType = {
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

// Default API key provided by user
const DEFAULT_API_KEY = 'AIzaSyCkAEglP1sSJTuJICAgEQwZIkva4BRKhw8';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [geminiApiKey, setGeminiApiKey] = useState<string>(DEFAULT_API_KEY);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Load API key from localStorage on initial load, falling back to default key
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when updated
  useEffect(() => {
    if (geminiApiKey) {
      localStorage.setItem('geminiApiKey', geminiApiKey);
    }
  }, [geminiApiKey]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <SettingsContext.Provider value={{ 
      geminiApiKey, 
      setGeminiApiKey,
      isSidebarOpen,
      toggleSidebar
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
