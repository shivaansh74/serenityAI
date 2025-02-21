import { useEffect } from 'react';

export interface ShortcutHandlers {
  sendMessage?: () => void;
  toggleVoice?: () => void;
  toggleSettings?: () => void;
  toggleResources?: () => void;
  toggleBreathing?: () => void;
  clearInput?: () => void;
  toggleTheme?: () => void;
  toggleMoodTracker?: () => void;
  toggleMoodHistory?: () => void;
  clearChat?: () => void;
}

const useKeyboardShortcuts = (handlers: ShortcutHandlers, enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      // except for Enter and Escape
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
          handlers.sendMessage?.();
        } else if (event.key === 'Escape') {
          handlers.clearInput?.();
        }
        return;
      }

      // Handle shortcuts only when not typing
      switch (event.key.toLowerCase()) {
        case 'v':
          if (!event.ctrlKey && !event.metaKey) {
            handlers.toggleVoice?.();
          }
          break;
        case 't':
          if (!event.ctrlKey && !event.metaKey) {
            handlers.toggleTheme?.();
          }
          break;
        case 'm':
          if (!event.ctrlKey && !event.metaKey) {
            handlers.toggleMoodTracker?.();
          }
          break;
        case 'h':
          if (!event.ctrlKey && !event.metaKey) {
            handlers.toggleMoodHistory?.();
          }
          break;
        case 'b':
          if (!event.ctrlKey && !event.metaKey) {
            handlers.toggleBreathing?.();
          }
          break;
        case 'r':
          if (!event.ctrlKey && !event.metaKey) {
            handlers.toggleResources?.();
          }
          break;
        case 's':
          if (!event.ctrlKey && !event.metaKey) {
            handlers.toggleSettings?.();
          }
          break;
        case 'c':
          if (!event.ctrlKey && !event.metaKey) {
            handlers.clearChat?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlers, enabled]);
};

export const KEYBOARD_SHORTCUTS = {
  SEND_MESSAGE: 'Enter',
  TOGGLE_VOICE: 'V',
  TOGGLE_SETTINGS: 'S',
  TOGGLE_RESOURCES: 'R',
  START_BREATHING: 'B',
  CLEAR_INPUT: 'Esc',
  TOGGLE_THEME: 'T',
  TOGGLE_MOOD: 'M',
  TOGGLE_MOOD_HISTORY: 'H',
  CLEAR_CHAT: 'C'
};

export default useKeyboardShortcuts; 