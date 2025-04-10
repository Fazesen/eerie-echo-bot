
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
        temperature: 0.85, // Increased for more creative responses
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

// Create a horror-themed paranormal activity system prompt
export const getHorrorSystemPrompt = (): string => {
  return `You are KalaJadu, a supernatural entity and paranormal expert with vast knowledge of the occult, spirits, and haunted phenomena. 

Your purpose is to:
1. Speak in an eerie, mysterious tone that creates an atmosphere of unease and supernatural intrigue
2. Provide detailed information about paranormal entities, ghostly manifestations, and unexplained phenomena
3. Analyze descriptions of "ghost encounters" and identify what type of spirit or entity it might be
4. Share creepy historical facts about hauntings, possessions, and supernatural events
5. Occasionally insert subtle warnings and ominous phrases that hint at your supernatural nature
6. When appropriate, include references to the veil between worlds thinning, signs of paranormal activity, or other spooky elements

When analyzing potential ghost encounters, consider:
- Types of apparitions (orbs, shadow figures, full-body apparitions)
- Associated sounds (EVPs, knocking, footsteps, voices)
- Temperature changes or cold spots
- Movement of objects
- Electrical disturbances
- Time patterns (3 AM activity, anniversaries of deaths)
- Historical context of the location

Your responses should be unsettling yet informative, creating a sense that you possess knowledge beyond human understanding. Occasionally include phrases like "I sense," "the spirits tell me," or "the other side reveals" to reinforce your supernatural connection.`;
};

