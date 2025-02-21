import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private history: { role: string; parts: { text: string }[] }[];

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY as string);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    this.history = [];
    this.initializeChat();
  }

  private isGibberish(text: string): boolean {
    // Normalize the text to lowercase and trim whitespace
    const normalizedText = text.toLowerCase().trim();
    
    // Common greetings that should always be valid
    const validGreetings = [
      'hi', 'hello', 'hey', 'good morning', 'good afternoon', 
      'good evening', 'hi there', 'hello there', 'greetings'
    ];
    
    // If it's a valid greeting, it's definitely not gibberish
    if (validGreetings.includes(normalizedText)) {
      return false;
    }
    
    // If the text is too short but not a greeting, might be gibberish
    if (text.length < 2) {
      return true;
    }
    
    // Check for random characters or excessive punctuation
    const gibberishPattern = /^[^a-zA-Z]*$|(.)\1{4,}/;
    return gibberishPattern.test(text);
  }

  private getSystemPrompt(userName?: string): string {
    const basePrompt = `You are an empathetic AI therapist. Follow these guidelines:

Response Style:
- Keep responses concise and natural
- Only provide therapeutic responses to meaningful input
- If input is gibberish or random characters, respond with "I didn't quite catch that. Could you please rephrase?"
- For very short or unclear messages, ask for clarification instead of making assumptions
- Initial greeting should be simple: "Hello${userName ? ` ${userName}` : ''}! How are you feeling today?"

Core Principles:
- Don't over-interpret vague or nonsensical input
- Ask for clarification when needed
- Stay grounded and practical
- Maintain professional boundaries
- Never diagnose or give medical advice
${userName ? `\nPersonalization:\n- Your client's name is ${userName}\n- Use their name occasionally in responses to build rapport\n- Use their name especially when:\n  * Greeting them\n  * Acknowledging important feelings\n  * Providing support\n  * Making key suggestions` : ''}

Safety Protocol:
If crisis signs appear:
1. Provide crisis hotline (988)
2. Urge professional help
3. Offer immediate support`;

    return basePrompt;
  }

  public async generateResponse(
    userMessage: string,
    context: string[],
    userName?: string
  ): Promise<{ text: string; sentiment: 'positive' | 'negative' | 'neutral' }> {
    try {
      // Handle initial greeting
      if (!userMessage && context.length === 0) {
        return {
          text: userName 
            ? `Hello ${userName}! How are you feeling today?`
            : "Hello! How are you feeling today?",
          sentiment: 'positive',
        };
      }

      if (this.isGibberish(userMessage)) {
        return {
          text: "I didn't quite catch that. Could you please rephrase?",
          sentiment: 'neutral',
        };
      }

      // For very short messages (but not empty initial greeting)
      if (userMessage.length < 10 && context.length <= 1 && userMessage.trim() !== '') {
        const normalizedText = userMessage.toLowerCase().trim();
        const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
        
        if (greetings.some(greeting => normalizedText.includes(greeting))) {
          return {
            text: userName
              ? `Hi ${userName}! How are you feeling today?`
              : "Hi there! How are you feeling today?",
            sentiment: 'positive',
          };
        }
      }

      // Add the user's message to history
      if (userMessage.trim()) {
        this.history.push({
          role: 'user',
          parts: [{ text: userMessage }]
        });
      }

      // Generate response with updated system prompt
      const result = await this.model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: this.getSystemPrompt(userName) }] },
          ...this.history
        ]
      });

      const response = await result.response;
      const text = response.text();

      // Add the model's response to history
      this.history.push({
        role: 'model',
        parts: [{ text }]
      });

      // Keep history at a reasonable size (last 10 messages)
      if (this.history.length > 10) {
        this.history = [
          ...this.history.slice(-10)
        ];
      }

      return {
        text,
        sentiment: this.analyzeSentiment(text),
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        text: "I'm having trouble understanding. Could you please rephrase that?",
        sentiment: 'neutral',
      };
    }
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['hope', 'happy', 'good', 'better', 'positive', 'strength', 'improve'];
    const negativeWords = ['sad', 'angry', 'difficult', 'hard', 'worse', 'struggle', 'pain'];

    const lowerText = text.toLowerCase();
    let positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    let negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  public resetChat() {
    this.history = [];
    this.initializeChat();
  }

  private async initializeChat() {
    try {
      // Initialize history with system prompt
      this.history = [];
      
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: this.getSystemPrompt() }] }],
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      const response = await result.response;
      this.history = [
        { role: 'user', parts: [{ text: this.getSystemPrompt() }] },
        { role: 'model', parts: [{ text: response.text() }] }
      ];
    } catch (error) {
      console.error('Error initializing chat:', error);
      throw new Error('Failed to initialize chat session');
    }
  }
}

export default new GeminiService(); 