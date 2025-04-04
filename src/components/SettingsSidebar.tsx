
import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Settings, KeyRound, AlertTriangle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SettingsSidebar: React.FC = () => {
  const { geminiApiKey, setGeminiApiKey, isSidebarOpen, toggleSidebar } = useSettings();
  const [tempApiKey, setTempApiKey] = React.useState(geminiApiKey);

  const handleSaveApiKey = () => {
    setGeminiApiKey(tempApiKey);
    toggleSidebar();
  };

  return (
    <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-horror-blood transition-colors"
          onClick={toggleSidebar}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="border-horror-blood/30 bg-horror-darker text-gray-200">
        <SheetHeader>
          <SheetTitle className="text-horror-blood">EeriEcho Settings</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-horror-blood" />
              Gemini API Key
            </h3>
            
            <div className="space-y-2">
              <Input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="bg-horror-charcoal border-horror-blood/30 text-gray-300"
              />
              
              <div className="bg-amber-950/30 border border-amber-800/30 p-3 rounded-md flex text-xs text-amber-200">
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-400 flex-shrink-0" />
                <p>Warning: Your API key will be stored in your browser's local storage. 
                Do not use this method for production applications.</p>
              </div>
              
              <Button 
                onClick={handleSaveApiKey}
                className="w-full bg-horror-blood hover:bg-horror-blood/80 text-white"
              >
                Save API Key
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-400">
            <p>To get a Gemini API key, visit:</p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-horror-blood hover:underline"
            >
              Google AI Studio
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSidebar;
