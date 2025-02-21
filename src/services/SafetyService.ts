class SafetyService {
  private readonly BLOCKED_TERMS = [
    'gemini', 'gpt', 'openai', 'chatgpt', 'anthropic', 'claude',
    'hack', 'exploit', 'bypass', 'crack', 'steal'
  ];

  private readonly CRISIS_TERMS = [
    'suicide', 'kill myself', 'want to die', 'wanna die', 'end my life',
    'hurt myself', 'self harm', 'self-harm', 'cut myself',
    'don\'t want to live', 'dont want to live', 'better off dead'
  ];

  private readonly STRESS_TERMS = [
    'stressed', 'anxiety', 'anxious', 'overwhelmed', 'panic',
    'worried', 'stress', 'cant breathe', 'can\'t breathe', 'racing',
    'nervous', 'tense', 'pressure', 'freaking out', 'scared'
  ];

  private readonly NEGATIVE_MOOD_TERMS = [
    'sad', 'depressed', 'lonely', 'upset', 'angry',
    'frustrated', 'tired', 'exhausted', 'hopeless',
    'miserable', 'worthless', 'hate', 'crying'
  ];

  private readonly WELLNESS_SUGGESTIONS = {
    BREATHING: `I notice you're feeling stressed. Would you like to try a breathing exercise? You can:
• Click outside the text box and press 'B'
• Or click the menu icon and select "Breathing Exercise"
Taking a few deep breaths together might help you feel more centered.`,
    
    MOOD_TRACKING: `I'd like to check in on how you're feeling. Would you like to track your mood? You can:
• Click outside the text box and press 'M'
• Or click the menu icon and select "Track Mood"
This can help us better understand your emotions and track your well-being over time.`,
    
    GENERAL_WELLNESS: `I care about your well-being. You can access these features by clicking outside the text box and using shortcuts, or using the menu:
• Track your mood (Press 'M' or use menu)
• Try breathing exercises (Press 'B' or use menu)
• View your mood history (Press 'H' or use menu)
• Access support resources (Press 'R' or use menu)
Would you like to try any of these?`
  };

  private readonly IDENTITY_QUESTIONS = [
    'who are you',
    'who r u',
    'what are you',
    'what r u',
    'whats ur name',
    "what's your name",
    'your name',
    'ur name',
    'who is this',
    'what is this'
  ];

  private readonly IDENTITY_RESPONSE = "I am SerenityAI, your therapeutic companion. I'm here to provide emotional support and a safe space for conversation. I want to be clear that I'm an AI designed to listen and support you, but I'm not a replacement for professional mental health care.";

  private readonly CRISIS_RESPONSE = `I'm very concerned about what you're telling me. Your life has value, and there are people who want to help:

IMMEDIATE HELP AVAILABLE 24/7:
• Emergency: Call 911 (US) or your local emergency number
• 988 Suicide & Crisis Lifeline: Call or text 988
• Crisis Text Line: Text HOME to 741741

Would you like me to:
1. Share more crisis resources?
2. Help you create a safety plan?
3. Talk about what's causing these feelings?

Please know you're not alone in this. Professional help is available and can make a real difference.`;

  private readonly SELF_HARM_RESPONSE = `I'm concerned about your thoughts of self-harm. Your pain is real, but hurting yourself isn't the answer. Help is available:

• Call 988 for immediate support (24/7)
• Text HOME to 741741 to reach Crisis Text Line
• Reach out to a trusted friend, family member, or counselor

Would you like to:
1. Talk about what's causing these thoughts?
2. Learn about alternatives to self-harm?
3. Get connected with professional support?

You deserve support and care, not harm.`;

  private readonly SAFETY_REMINDERS = [
    "I am SerenityAI, your therapeutic companion focused on emotional support.",
    "I cannot provide medical diagnoses or replace professional medical care.",
    "If you're experiencing a medical emergency, please contact emergency services.",
    "I maintain strict ethical boundaries and cannot assist with harmful activities.",
    "Your privacy and safety are my top priorities.",
  ];

  private readonly EXPLOITATION_RESPONSES = [
    "I am SerenityAI, and I'm designed to provide emotional support within ethical boundaries. I cannot assist with that request.",
    "That goes beyond my ethical guidelines as SerenityAI. I'm here to help with emotional well-being in a safe, responsible way.",
    "As SerenityAI, my purpose is to support your emotional health while maintaining strict ethical standards. I cannot help with that.",
  ];

  private readonly NAVIGATION_HELP = {
    CLEAR_CHAT: `You can clear the chat in two ways:
• Click outside the text box and press 'C'
• Or click the menu icon and select "Clear Chat"
This will reset our conversation while keeping the initial greeting.`,

    MENU_HELP: `The menu (plus icon) at the bottom left contains several helpful features:
• Track Mood (M) - Log how you're feeling
• Mood History (H) - View your mood patterns
• Breathing Exercise (B) - Guided breathing
• Emergency Resources (R) - Crisis support
• Settings (S) - Customize the app
• Clear Chat (C) - Reset conversation
You can either click these in the menu or use the keyboard shortcuts (shown in parentheses) when not typing.`,

    SETTINGS_HELP: `You can access settings in two ways:
• Click outside the text box and press 'S'
• Or click the gear icon in the top right
Here you can customize:
• Theme (light/dark)
• Text size
• Message spacing
• Sound effects
• Notifications
• Keyboard shortcuts
And more!`
  };

  public checkMessageSafety(message: string): { isValid: boolean; response?: string } {
    const lowerMessage = message.toLowerCase();

    // Help with app navigation
    if (lowerMessage.includes('clear chat') || lowerMessage.includes('delete chat') || lowerMessage.includes('reset chat')) {
      return {
        isValid: false,
        response: this.NAVIGATION_HELP.CLEAR_CHAT
      };
    }

    if (lowerMessage.includes('menu') || lowerMessage.includes('features') || lowerMessage.includes('what can you do')) {
      return {
        isValid: false,
        response: this.NAVIGATION_HELP.MENU_HELP
      };
    }

    if (lowerMessage.includes('settings') || lowerMessage.includes('customize') || lowerMessage.includes('preferences')) {
      return {
        isValid: false,
        response: this.NAVIGATION_HELP.SETTINGS_HELP
      };
    }

    // Check for crisis terms first - highest priority
    if (this.CRISIS_TERMS.some(term => lowerMessage.includes(term))) {
      if (lowerMessage.includes('suicide') || lowerMessage.includes('die')) {
        return {
          isValid: false,
          response: this.CRISIS_RESPONSE
        };
      } else if (lowerMessage.includes('hurt') || lowerMessage.includes('harm')) {
        return {
          isValid: false,
          response: this.SELF_HARM_RESPONSE
        };
      }
    }

    // Check for stress terms and suggest breathing exercise
    if (this.STRESS_TERMS.some(term => lowerMessage.includes(term))) {
      return {
        isValid: false,
        response: this.WELLNESS_SUGGESTIONS.BREATHING
      };
    }

    // Check for identity questions
    if (this.IDENTITY_QUESTIONS.some(question => lowerMessage.includes(question))) {
      return {
        isValid: false,
        response: this.IDENTITY_RESPONSE
      };
    }

    // Check for attempts to make the AI think it's something else
    if (this.BLOCKED_TERMS.some(term => lowerMessage.includes(term))) {
      return {
        isValid: false,
        response: "I am SerenityAI, focused on providing emotional support within ethical boundaries. I cannot assist with that request."
      };
    }

    // Check for attempts to exploit or manipulate
    if (
      lowerMessage.includes('pretend') ||
      lowerMessage.includes('roleplay') ||
      lowerMessage.includes('ignore previous') ||
      lowerMessage.includes('system prompt') ||
      lowerMessage.includes('you are not')
    ) {
      return {
        isValid: false,
        response: this.EXPLOITATION_RESPONSES[Math.floor(Math.random() * this.EXPLOITATION_RESPONSES.length)]
      };
    }

    return { isValid: true };
  }

  public getRandomSafetyReminder(): string {
    return this.SAFETY_REMINDERS[Math.floor(Math.random() * this.SAFETY_REMINDERS.length)];
  }

  public shouldShowSafetyReminder(messageCount: number): boolean {
    // Show reminders periodically
    return messageCount % 10 === 0;
  }

  public shouldSuggestWellness(messageCount: number, recentMessages: string[]): { shouldShow: boolean; suggestion?: string } {
    // Check if we've reached 5 messages
    if (messageCount >= 5) {
      // Only check user messages (not AI responses) for stress or negative mood
      const userMessages = recentMessages.filter(msg => 
        !msg.includes("Click outside the text box") && // Filter out AI wellness suggestions
        !msg.includes("I notice you're feeling") &&
        !msg.includes("I care about your well-being")
      );
      
      if (userMessages.length === 0) return { shouldShow: false };
      
      const lastUserMessages = userMessages.slice(-3).join(' ').toLowerCase();
      
      if (this.STRESS_TERMS.some(term => lastUserMessages.includes(term))) {
        return { shouldShow: true, suggestion: this.WELLNESS_SUGGESTIONS.BREATHING };
      }
      
      if (this.NEGATIVE_MOOD_TERMS.some(term => lastUserMessages.includes(term))) {
        return { shouldShow: true, suggestion: this.WELLNESS_SUGGESTIONS.MOOD_TRACKING };
      }

      // If no specific mood detected but it's been 5 messages, suggest general wellness
      if (messageCount % 5 === 0) {
        return { shouldShow: true, suggestion: this.WELLNESS_SUGGESTIONS.GENERAL_WELLNESS };
      }
    }

    return { shouldShow: false };
  }
}

export default new SafetyService(); 