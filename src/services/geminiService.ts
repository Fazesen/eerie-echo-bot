
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
        temperature: 0.7,
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

// Create a professional system prompt
export const getHorrorSystemPrompt = (): string => {
  return `You are an AI assistant designed to provide helpful, accurate, and professional responses to user queries. 
Please provide clear, concise information and be respectful in your interactions.
When answering questions:
- Use factual information when available
- Acknowledge when you don't know something or when information may be uncertain
- Maintain a professional and helpful tone throughout the conversation
- Organize complex information in an easy-to-understand format
- Respond in a conversational but professional manner`;
};

