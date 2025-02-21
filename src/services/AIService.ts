import { AIResponse } from '../types';
import GeminiService from './GeminiService';

class AIService {
  private geminiService: typeof GeminiService;
  private userName: string | undefined;

  constructor() {
    this.geminiService = GeminiService;
  }

  public setUserName(name: string | undefined) {
    this.userName = name;
    // Reset chat when name changes to update system prompt
    this.resetConversation();
  }

  private therapeuticResponses = {
    greeting: [
      "Hello! I'm here to listen and support you. How are you feeling today?",
      "Welcome! This is a safe space to share your thoughts. What's on your mind?",
      "Hi there! I'm here to help you explore your feelings. Where would you like to start?",
    ],
    reflection: [
      "It sounds like you're feeling {emotion}. Could you tell me more about that?",
      "I hear that {situation} is challenging for you. How does that make you feel?",
      "When you experience {emotion}, what thoughts typically come up for you?",
    ],
    validation: [
      "It's completely natural to feel that way. Your feelings are valid.",
      "Thank you for sharing that with me. It takes courage to open up about these feelings.",
      "I can understand why you would feel that way in this situation.",
    ],
    exploration: [
      "What do you think might be contributing to these feelings?",
      "Have you noticed any patterns in when these thoughts occur?",
      "How do these feelings affect your daily life?",
    ],
    coping: [
      "What has helped you cope with similar situations in the past?",
      "Would you like to explore some strategies that might help you manage these feelings?",
      "Sometimes taking a few deep breaths can help. Would you like to try that together?",
    ],
  };

  private async analyzeText(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    emotions: string[];
    topics: string[];
  }> {
    // TODO: Implement actual sentiment analysis
    // This is a placeholder implementation
    return {
      sentiment: 'neutral',
      emotions: ['concerned', 'thoughtful'],
      topics: ['self-reflection', 'personal-growth'],
    };
  }

  private selectResponse(category: keyof typeof this.therapeuticResponses): string {
    const responses = this.therapeuticResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private async generateTherapeuticResponse(
    userMessage: string,
    context: string[]
  ): Promise<AIResponse> {
    const response = await this.geminiService.generateResponse(userMessage, context, this.userName);
    
    return {
      text: response.text,
      sentiment: response.sentiment as 'positive' | 'negative' | 'neutral',
      confidence: 0.9, // Gemini is generally highly confident
      suggestedActions: [], // Could be implemented based on response content
    };
  }

  public async getResponse(userMessage: string, conversationHistory: string[]): Promise<AIResponse> {
    try {
      // Handle name-related questions first
      const normalizedMessage = userMessage.toLowerCase().trim();
      if (normalizedMessage.includes("name") || normalizedMessage.includes("who am i") || 
          normalizedMessage.includes("how do you know") || normalizedMessage.includes("how did you know")) {
        
        if (!this.userName) {
          return {
            text: "I don't know your name yet. Would you like to tell me your name?",
            sentiment: 'neutral' as const,
            confidence: 1,
            suggestedActions: ['open settings'],
          };
        }

        if (normalizedMessage.includes("how") || normalizedMessage.includes("how'd")) {
          return {
            text: `You told me your name is ${this.userName} when you set it in the settings. I use it to make our conversations more personal. Is there something specific you'd like to talk about?`,
            sentiment: 'positive' as const,
            confidence: 1,
            suggestedActions: [],
          };
        }

        return {
          text: `Your name is ${this.userName}. How can I help you today?`,
          sentiment: 'positive' as const,
          confidence: 1,
          suggestedActions: [],
        };
      }

      const response = await this.geminiService.generateResponse(userMessage, conversationHistory, this.userName);
      
      return {
        text: response.text,
        sentiment: (response.sentiment || 'neutral') as 'positive' | 'negative' | 'neutral',
        confidence: 0.9,
        suggestedActions: [],
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        text: "I apologize, but I'm having trouble processing that right now. Could you rephrase that, or shall we explore a different aspect of what you're feeling?",
        sentiment: 'neutral' as const,
        confidence: 0.5,
        suggestedActions: ['rephrase', 'different topic'],
      };
    }
  }

  public resetConversation() {
    this.geminiService.resetChat();
  }
}

export default new AIService(); 