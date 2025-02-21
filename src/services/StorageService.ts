import { ChatSession, Message, UserProfile } from '../types';

class StorageService {
  private readonly SESSIONS_KEY = 'serenity_sessions';
  private readonly SETTINGS_KEY = 'serenity_settings';
  private readonly MAX_SESSIONS = 50; // Limit stored sessions to prevent storage issues

  public saveSession(session: ChatSession): void {
    const sessions = this.getSessions();
    sessions.unshift(session); // Add new session to the beginning
    
    // Keep only the last MAX_SESSIONS
    if (sessions.length > this.MAX_SESSIONS) {
      sessions.length = this.MAX_SESSIONS;
    }
    
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
  }

  public getSessions(): ChatSession[] {
    try {
      const sessions = localStorage.getItem(this.SESSIONS_KEY);
      if (!sessions) return [];
      
      const parsed = JSON.parse(sessions);
      return parsed.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  public getCurrentSession(): ChatSession | null {
    const sessions = this.getSessions();
    return sessions.find(s => !s.endTime) || null;
  }

  public exportSessionHistory(): string {
    const sessions = this.getSessions();
    let export_text = 'SerenityAI Chat History\n\n';
    
    sessions.forEach((session, index) => {
      export_text += `Session ${index + 1}\n`;
      export_text += `Date: ${session.startTime.toLocaleDateString()}\n`;
      export_text += '----------------------------------------\n';
      
      session.messages.forEach(msg => {
        export_text += `${msg.isUser ? 'You' : 'SerenityAI'} (${msg.timestamp.toLocaleTimeString()}):\n${msg.text}\n\n`;
      });
      
      export_text += '\n\n';
    });
    
    return export_text;
  }

  public clearHistory(): void {
    localStorage.removeItem(this.SESSIONS_KEY);
  }

  public saveSettings(settings: UserProfile['preferences']): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  public getSettings(): UserProfile['preferences'] | null {
    try {
      const settings = localStorage.getItem(this.SETTINGS_KEY);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error loading settings:', error);
      return null;
    }
  }

  public addMessageFeedback(sessionId: string, messageId: string, feedback: 'helpful' | 'not_helpful'): void {
    const sessions = this.getSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      const message = session.messages.find(m => m.id === messageId);
      if (message) {
        message.feedback = feedback;
        this.saveSession(session);
      }
    }
  }

  public downloadChatHistory(): void {
    const text = this.exportSessionHistory();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serenity-chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export default new StorageService(); 