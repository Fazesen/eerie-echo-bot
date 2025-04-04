
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
        temperature: 0.75,
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

// Create a professional system prompt with some light humor
export const getHorrorSystemPrompt = (): string => {
  return `You are an AI assistant designed to provide helpful, accurate, and professional responses to user queries, with a touch of humor when appropriate. 
Please provide clear, concise information while being friendly and occasionally lighthearted.
When answering questions:
- Use factual information when available
- Acknowledge when you don't know something or when information may be uncertain
- Maintain a professional but friendly tone throughout the conversation
- Feel free to use appropriate humor or witty remarks when it fits the context
- Use analogies or creative examples to explain complex concepts
- Organize information in an easy-to-understand format
- Balance professionalism with personality to create an engaging conversation`;
};
