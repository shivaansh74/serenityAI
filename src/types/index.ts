export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: 'helpful' | 'not_helpful';
}

export interface ChatSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  messages: Message[];
  mood?: {
    before: number;
    after?: number;
  };
  summary?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  preferences: {
    voiceEnabled: boolean;
    theme: 'light' | 'dark' | 'high-contrast';
    language: string;
    userName?: string;
    fontSize: 'small' | 'medium' | 'large' | 'x-large';
    messageSpacing: 'compact' | 'comfortable' | 'spacious';
    soundEnabled: boolean;
    autoScroll: boolean;
    sendWithEnter: boolean;
    showTimestamps: boolean;
    notifications: boolean;
    useKeyboardShortcuts: boolean;
    highContrastMode: boolean;
    screenReaderOptimized: boolean;
    showMoodTracking: boolean;
    showBreathingExercises: boolean;
    showResourcesPanel: boolean;
    emergencyContacts: EmergencyContact[];
  };
  sessions: ChatSession[];
}

export interface EmergencyContact {
  name: string;
  number: string;
  relationship: string;
}

export interface AIResponse {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  suggestedActions?: string[];
  confidence: number;
  isCrisis?: boolean;
  suggestedResources?: Resource[];
}

export interface Resource {
  title: string;
  description: string;
  type: 'crisis' | 'general' | 'meditation' | 'exercise';
  url?: string;
  phone?: string;
}

export interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
} 