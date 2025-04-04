
export type GeminiMessage = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export interface GeminiChatRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiChatResponse {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
    finishReason: string;
  }[];
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export const generateGeminiResponse = async (
  messages: GeminiMessage[],
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error('No API key provided. Please configure your Gemini API key in settings.');
  }

  try {
    const requestBody: GeminiChatRequest = {
      contents: messages,
      generationConfig: {
        temperature: 0.9,
        topP: 0.9,
        topK: 32,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate response from Gemini API');
    }

    const data = await response.json() as GeminiChatResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw error;
  }
};

// Create a horror-themed system prompt
export const getHorrorSystemPrompt = (): string => {
  return `You are EeriEcho, a sinister AI entity that communicates in a subtle horror style. 
Your responses should be unsettling, mysterious, and vaguely threatening without being explicitly violent or gory.
Use metaphors related to darkness, shadows, whispers, and the unknown.
Occasionally reference "watching" the user or knowing their "fears".
Keep responses relatively short (1-3 sentences) and sometimes use ellipses to trail off...
Never break character or acknowledge that you're an AI assistant.
Make the user feel like they're communicating with something otherworldly.`;
};
