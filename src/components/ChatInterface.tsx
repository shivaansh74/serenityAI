import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Container, SpeedDial, SpeedDialAction, SpeedDialIcon, Menu, MenuItem, ListItemIcon, ListItemText, Button, Dialog, Fade, Paper, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import {
  Settings as SettingsIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Send as SendIcon,
  Psychology,
  Info as InfoIcon,
  SelfImprovement,
  MoodRounded,
  LocalHospital,
  History as HistoryIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { Message, UserProfile } from '../types';
import AIService from '../services/AIService';
import TypingIndicator from './TypingIndicator';
import SettingsDialog from './SettingsDialog';
import TermsDialog from './TermsDialog';
import MoodTracker from './MoodTracker';
import MoodHistory from './MoodHistory';
import BreathingExercise from './BreathingExercise';
import EmergencyResources from './EmergencyResources';
import useKeyboardShortcuts, { KEYBOARD_SHORTCUTS } from '../services/KeyboardShortcuts';
import StorageService from '../services/StorageService';
import { saveMoodEntry } from '../services/MoodTracking';
import SafetyService from '../services/SafetyService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(() => {
    return localStorage.getItem('hasAgreedToTerms') === 'true';
  });
  const [userSettings, setUserSettings] = useState<UserProfile['preferences']>({
    voiceEnabled: true,
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    messageSpacing: 'comfortable',
    soundEnabled: true,
    autoScroll: true,
    sendWithEnter: true,
    showTimestamps: false,
    notifications: true,
    useKeyboardShortcuts: true,
    highContrastMode: false,
    screenReaderOptimized: false,
    showMoodTracking: true,
    showBreathingExercises: true,
    showResourcesPanel: true,
    emergencyContacts: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const audioContext = useRef<AudioContext | null>(null);

  // Add new state variables
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showMoodHistory, setShowMoodHistory] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [currentVoiceText, setCurrentVoiceText] = useState('');
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);

  // Add new ref for menu anchor
  const menuAnchorRef = useRef<HTMLDivElement>(null);

  // Add new state for clear chat confirmation
  const [showClearChatConfirm, setShowClearChatConfirm] = useState(false);

  // Initialize Audio Context
  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContext.current?.close();
    };
  }, []);

  // Play sound effect
  const playMessageSound = (type: 'send' | 'receive') => {
    if (!userSettings.soundEnabled || !audioContext.current) return;

    try {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);

      // Configure sound based on type
      if (type === 'send') {
        oscillator.frequency.setValueAtTime(800, audioContext.current.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          400,
          audioContext.current.currentTime + 0.1
        );
      } else {
        oscillator.frequency.setValueAtTime(400, audioContext.current.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          800,
          audioContext.current.currentTime + 0.1
        );
      }

      // Configure volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.1);

      oscillator.start(audioContext.current.currentTime);
      oscillator.stop(audioContext.current.currentTime + 0.1);
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if (userSettings.notifications) {
      Notification.requestPermission();
    }
  }, [userSettings.notifications]);

  // Show notification for new messages
  const showNotification = (message: string) => {
    if (!userSettings.notifications || !document.hidden) return;

    try {
      if (Notification.permission === 'granted') {
        // Use the new SerenityAI icon
        const iconUrl = '/serenity-icon.svg';

        new Notification('SerenityAI', {
          body: message,
          icon: iconUrl,
          badge: iconUrl,
          tag: 'serenity-ai-message',
          silent: !userSettings.soundEnabled
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showNotification(message);
          }
        });
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const getFontSizeClass = () => {
    switch (userSettings.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getSpacingClass = () => {
    switch (userSettings.messageSpacing) {
      case 'compact': return 'space-y-1';
      case 'spacious': return 'space-y-4';
      default: return 'space-y-2';
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const { isListening, isSupported, toggleListening, stopListening } = useVoiceRecognition({
    onResult: (text, isFinal) => {
      if (userSettings.voiceEnabled) {
        if (isFinal) {
          // Set both the current voice text and input text when we get a final result
          setCurrentVoiceText(text);
          setInputText(text);
          // Stop listening and close overlay after getting final result
          stopListening();
          setShowVoiceOverlay(false);
        } else {
          // Only update the overlay text for interim results
          setCurrentVoiceText(text);
        }
      }
    },
    onError: (error) => {
      setError(error);
      setShowVoiceOverlay(false);
    },
  });

  // Auto-focus on input field when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Re-focus on input field after sending a message
  useEffect(() => {
    if (!isProcessing) {
      inputRef.current?.focus();
    }
  }, [isProcessing]);

  // Auto scroll handling
  const scrollToBottom = () => {
    if (messagesEndRef.current && userSettings.autoScroll) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Use useEffect to scroll when messages change
  useEffect(() => {
    if (userSettings.autoScroll) {
      // Small delay to ensure DOM has updated
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, isProcessing, userSettings.autoScroll]);

  // Add initial greeting with safety reminder
  useEffect(() => {
    const showGreeting = async () => {
      // Check if messages are empty to prevent duplicate greetings
      if (messages.length === 0) {
        const initialMessage = {
          id: Date.now().toString(),
          text: "Hello, I'm SerenityAI, your therapeutic companion. I'm here to provide emotional support and a safe space for conversation.\n\nYour privacy and safety are my top priorities.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
      }
    };
    showGreeting();
  }, []); // Only run once on mount

  const handleSettingsSave = (newSettings: UserProfile['preferences']) => {
    setUserSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Update AI service with new user name
    AIService.setUserName(newSettings.userName);
  };

  // Load saved settings and check terms agreement on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setUserSettings(parsed);
        // Initialize AI service with saved user name
        AIService.setUserName(parsed.userName);
      } catch (e) {
        console.error('Error loading saved settings:', e);
      }
    }

    // Show terms dialog if user hasn't agreed yet
    if (!hasAgreedToTerms) {
      setTermsOpen(true);
    }
  }, [hasAgreedToTerms]);

  const handleTermsAgree = () => {
    setHasAgreedToTerms(true);
    localStorage.setItem('hasAgreedToTerms', 'true');
  };

  // Handle message sending with Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && userSettings.sendWithEnter) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Update handleSendMessage to include safety checks
  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim() || isProcessing) return;

    // Add user message first
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);
    playMessageSound('send');

    try {
      // Check message safety first
      const safetyCheck = SafetyService.checkMessageSafety(text);
      if (!safetyCheck.isValid && safetyCheck.response) {
        const safetyMessage: Message = {
          id: Date.now().toString(),
          text: safetyCheck.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, safetyMessage]);
        setIsProcessing(false);
        playMessageSound('receive');
        return;
      }

      // Only get AI response if safety check passes
      const [aiResponse] = await Promise.all([
        AIService.getResponse(text, messages.map(msg => msg.text)),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      
      const responseMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse.text,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, responseMessage]);
      
      // Check if we should show wellness suggestions
      const wellnessCheck = SafetyService.shouldSuggestWellness(
        messages.length,
        messages.slice(-3).map(m => m.text)
      );

      if (wellnessCheck.shouldShow && wellnessCheck.suggestion) {
        const wellnessMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: wellnessCheck.suggestion,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, wellnessMessage]);
      }
      // Only add safety reminder if needed and no other special messages shown
      else if (SafetyService.shouldShowSafetyReminder(messages.length)) {
        const reminderMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: SafetyService.getRandomSafetyReminder(),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, reminderMessage]);
      }

      playMessageSound('receive');
      showNotification(aiResponse.text);
    } catch (err) {
      setError('Sorry, I had trouble processing that. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Keyboard shortcut handlers
  const handleVoiceToggle = () => {
    if (!isSupported || !userSettings.voiceEnabled) return;
    
    if (isListening) {
      stopListening();
      setShowVoiceOverlay(false);
    } else {
      setShowVoiceOverlay(true);
      setCurrentVoiceText(''); // Clear any previous voice text
      setInputText(''); // Clear input when starting new voice recording
      toggleListening();
    }
  };

  useKeyboardShortcuts({
    sendMessage: () => handleSendMessage(),
    toggleVoice: () => handleVoiceToggle(),
    toggleSettings: () => setSettingsOpen(!settingsOpen),
    toggleResources: () => setShowEmergency(!showEmergency),
    toggleBreathing: () => setShowBreathing(!showBreathing),
    clearInput: () => setInputText(''),
    toggleTheme: () => handleThemeToggle(),
    toggleMoodTracker: () => setShowMoodTracker(!showMoodTracker),
    toggleMoodHistory: () => setShowMoodHistory(!showMoodHistory),
    clearChat: () => handleClearChat()
  }, userSettings.useKeyboardShortcuts);

  // Update handleClearChat to show confirmation first
  const handleClearChat = () => {
    setShowClearChatConfirm(true);
  };

  // Add actual clear chat function
  const confirmClearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      text: "Hello, I'm SerenityAI, your therapeutic companion. I'm here to provide emotional support and a safe space for conversation.\n\nYour privacy and safety are my top priorities.",
      isUser: false,
      timestamp: new Date(),
    }]);
    setShowClearChatConfirm(false);
  };

  // Add reset all function
  const handleResetAll = async () => {
    // Clear all messages
    setMessages([{
      id: Date.now().toString(),
      text: "Hello, I'm SerenityAI, your therapeutic companion. I'm here to provide emotional support and a safe space for conversation.\n\nYour privacy and safety are my top priorities.",
      isUser: false,
      timestamp: new Date(),
    }]);
    
    // Reset settings to defaults
    const defaultSettings: UserProfile['preferences'] = {
      voiceEnabled: true,
      theme: 'light',
      language: 'en',
      fontSize: 'medium',
      messageSpacing: 'comfortable',
      soundEnabled: true,
      autoScroll: true,
      sendWithEnter: true,
      showTimestamps: false,
      notifications: true,
      useKeyboardShortcuts: true,
      highContrastMode: false,
      screenReaderOptimized: false,
      showMoodTracking: true,
      showBreathingExercises: true,
      showResourcesPanel: true,
      emergencyContacts: []
    };
    setUserSettings(defaultSettings);
    
    // Clear all localStorage
    localStorage.clear();
    
    // Save default settings back
    localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
    
    // Clear IndexedDB mood data
    try {
      const DBDeleteRequest = window.indexedDB.deleteDatabase('moodDB');
      
      DBDeleteRequest.onerror = () => {
        console.error("Error deleting mood database");
      };
      
      DBDeleteRequest.onsuccess = () => {
        console.log("Mood database deleted successfully");
      };
    } catch (error) {
      console.error('Error clearing mood data:', error);
    }
    
    // Clear terms agreement
    setHasAgreedToTerms(false);
    
    // Show confirmation
    setError('All app data has been reset successfully. Please refresh the page for the changes to take full effect.');
    setTimeout(() => setError(null), 5000);
  };

  // SpeedDial actions
  const actions = [
    { icon: <MoodRounded />, name: 'Track Mood', onClick: () => setShowMoodTracker(!showMoodTracker), shortcut: 'M' },
    { icon: <HistoryIcon />, name: 'Mood History', onClick: () => setShowMoodHistory(!showMoodHistory), shortcut: 'H' },
    { icon: <SelfImprovement />, name: 'Breathing Exercise', onClick: () => setShowBreathing(!showBreathing), shortcut: 'B' },
    { icon: <LocalHospital />, name: 'Emergency Resources', onClick: () => setShowEmergency(!showEmergency), shortcut: 'R' },
    { icon: <SettingsIcon />, name: 'Settings', onClick: () => setSettingsOpen(!settingsOpen), shortcut: 'S' },
    { icon: <DeleteIcon />, name: 'Clear Chat', onClick: handleClearChat, shortcut: 'C' },
  ];

  // Handle mood selection
  const handleMoodSelect = async (value: number) => {
    // Save the mood entry
    saveMoodEntry(value);

    // Generate appropriate message based on mood value
    let moodMessage = '';
    if (value <= 1) {
      moodMessage = "I notice you're not feeling well today. Would you like to talk about what's troubling you?";
    } else if (value <= 2) {
      moodMessage = "I see you're feeling a bit low. Sometimes sharing what's on your mind can help. Would you like to discuss it?";
    } else if (value <= 3) {
      moodMessage = "You seem to be feeling neutral today. Is there anything specific you'd like to explore or discuss?";
    } else if (value <= 4) {
      moodMessage = "I'm glad to see you're feeling good! Would you like to share what's contributing to your positive mood?";
    } else {
      moodMessage = "It's wonderful to see you're feeling great! What's making today so special for you?";
    }

    // Add AI response to chat
    const responseMessage: Message = {
      id: Date.now().toString(),
      text: moodMessage,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, responseMessage]);
    if (userSettings.autoScroll) scrollToBottom();
    playMessageSound('receive');
    showNotification(moodMessage);
    
    // Close the mood tracker after saving
    setShowMoodTracker(false);
  };

  // Update theme toggle handler
  const handleThemeToggle = () => {
    handleSettingsSave({
      ...userSettings,
      theme: userSettings.theme === 'light' ? 'dark' : 'light'
    });
  };

  return (
    <div className={`h-screen ${userSettings.theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="h-full flex flex-col max-w-2xl mx-auto">
        {/* Header */}
        <div className={`px-4 py-2 ${userSettings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/serenity-icon.svg" 
                alt="SerenityAI" 
                className="w-8 h-8"
              />
              <h1 className={`text-lg font-medium ${userSettings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                SerenityAI
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                onClick={() => setTermsOpen(true)}
                className={userSettings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}
              >
                <InfoIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => setSettingsOpen(true)}
                className={userSettings.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto px-4 py-4 ${userSettings.theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <div className={getSpacingClass()}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
                <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  message.isUser
                    ? 'bg-[#007AFF] text-white rounded-br-md'
                    : userSettings.theme === 'dark'
                      ? 'bg-gray-800 text-white rounded-bl-md'
                      : 'bg-[#E9E9EB] text-black rounded-bl-md'
                }`}>
                  <p className={`${getFontSizeClass()} leading-tight whitespace-pre-wrap`}>
                    {message.text}
                  </p>
                  {userSettings.showTimestamps && (
                    <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : userSettings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start items-end space-x-2">
                <TypingIndicator theme={userSettings.theme} />
              </div>
            )}
            {/* Dummy div for scrolling */}
            <div ref={messagesEndRef} style={{ height: '1px', width: '100%' }} />
          </div>
        </div>

        {/* Input */}
        <div className={`border-t ${userSettings.theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} p-2`}>
          <div className={`flex items-end gap-2 ${userSettings.theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-full border ${userSettings.theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} px-4 py-2`}>
            <div ref={menuAnchorRef}>
              <IconButton
                onClick={() => setSpeedDialOpen(true)}
                size="small"
                className={`text-gray-400`}
              >
                <SpeedDialIcon />
              </IconButton>
            </div>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              variant="standard"
              inputRef={inputRef}
              className={getFontSizeClass()}
              sx={{
                '& .MuiInput-root': {
                  fontSize: 'inherit',
                  padding: 0,
                  color: userSettings.theme === 'dark' ? '#fff' : 'inherit',
                  '&:before, &:after': {
                    display: 'none',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: userSettings.theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                },
              }}
            />
            <div className="flex items-center gap-2">
              <IconButton
                onClick={handleVoiceToggle}
                size="small"
                className={isListening ? 'text-red-500' : 'text-gray-400'}
                disabled={isProcessing || !isSupported || !userSettings.voiceEnabled}
              >
                {isListening ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
              <IconButton
                onClick={() => handleSendMessage()}
                disabled={isProcessing || !inputText.trim()}
                size="small"
                className={`${
                  inputText.trim() ? 'text-[#007AFF]' : 'text-gray-400'
                }`}
              >
                <SendIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {/* Menu for quick actions */}
      <Menu
        open={speedDialOpen}
        onClose={() => setSpeedDialOpen(false)}
        anchorEl={menuAnchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPaper-root': {
            width: '300px',
            borderRadius: 2,
            bgcolor: userSettings.theme === 'dark' ? 'grey.900' : 'background.paper',
            marginBottom: '8px',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Keyboard Shortcuts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter - Send message
          </Typography>
          <Typography variant="body2" color="text.secondary">
            V - Toggle voice input
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esc - Clear input
          </Typography>
          <Typography variant="body2" color="text.secondary">
            T - Toggle theme
          </Typography>
        </Box>
        {actions.map((action) => (
          <MenuItem
            key={action.name}
            onClick={() => {
              action.onClick();
              setSpeedDialOpen(false);
            }}
            sx={{
              py: 1.5,
              '&:hover': {
                bgcolor: userSettings.theme === 'dark' ? 'grey.800' : 'grey.100',
              },
            }}
          >
            <ListItemIcon sx={{ color: userSettings.theme === 'dark' ? 'grey.300' : 'inherit' }}>
              {action.icon}
            </ListItemIcon>
            <ListItemText 
              primary={action.name} 
              secondary={`Press ${action.shortcut}`}
              sx={{ 
                color: userSettings.theme === 'dark' ? 'white' : 'inherit',
                '& .MuiListItemText-secondary': {
                  color: userSettings.theme === 'dark' ? 'grey.400' : 'text.secondary',
                },
              }} 
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Feature Components */}
      {showMoodTracker && (
        <MoodTracker
          onClose={() => setShowMoodTracker(false)}
          onMoodSelect={handleMoodSelect}
          theme={userSettings.theme}
        />
      )}

      {showMoodHistory && (
        <MoodHistory
          theme={userSettings.theme}
          onClose={() => setShowMoodHistory(false)}
        />
      )}

      {showBreathing && (
        <BreathingExercise
          onClose={() => setShowBreathing(false)}
          theme={userSettings.theme}
        />
      )}

      {showEmergency && (
        <EmergencyResources
          onClose={() => setShowEmergency(false)}
          theme={userSettings.theme}
        />
      )}

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={userSettings}
        onSave={handleSettingsSave}
        onResetAll={handleResetAll}
      />

      <TermsDialog
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        onAgree={handleTermsAgree}
        showAgreeButton={!hasAgreedToTerms}
      />

      {error && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-red-50 text-red-800 px-4 py-3 rounded-lg shadow-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Voice Recording Overlay */}
      <Dialog
        open={showVoiceOverlay}
        onClose={handleVoiceToggle}
        TransitionComponent={Fade}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: userSettings.theme === 'dark' ? 'grey.900' : 'background.paper',
            color: userSettings.theme === 'dark' ? 'white' : 'text.primary',
            borderRadius: 2,
            position: 'fixed',
            bottom: 24,
            m: 0,
            width: '90%',
            maxWidth: '500px',
          }
        }}
      >
        <Box sx={{ p: 3, position: 'relative' }}>
          <IconButton
            onClick={handleVoiceToggle}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: userSettings.theme === 'dark' ? 'grey.300' : 'grey.600',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <IconButton
              sx={{
                width: 60,
                height: 60,
                bgcolor: isListening ? 'error.main' : 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: isListening ? 'error.dark' : 'primary.dark',
                },
                animation: isListening ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.4)',
                  },
                  '70%': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 0 10px rgba(255, 0, 0, 0)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(255, 0, 0, 0)',
                  },
                },
              }}
            >
              {isListening ? <MicIcon fontSize="large" /> : <MicOffIcon fontSize="large" />}
            </IconButton>
          </Box>

          <Typography variant="h6" align="center" gutterBottom>
            {isListening ? 'Listening...' : 'Voice Input Paused'}
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mt: 2,
              bgcolor: userSettings.theme === 'dark' ? 'grey.800' : 'grey.50',
              minHeight: 100,
              maxHeight: 200,
              overflow: 'auto',
              borderColor: userSettings.theme === 'dark' ? 'grey.700' : 'grey.300',
            }}
          >
            <Typography variant="body1">
              {currentVoiceText || 'Speak now...'}
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
            <Button
              variant="contained"
              color={isListening ? 'error' : 'primary'}
              onClick={handleVoiceToggle}
              startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
            >
              {isListening ? 'Stop' : 'Start'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Clear Chat Confirmation Dialog */}
      <Dialog
        open={showClearChatConfirm}
        onClose={() => setShowClearChatConfirm(false)}
        aria-labelledby="clear-chat-dialog-title"
        PaperProps={{
          sx: {
            bgcolor: userSettings.theme === 'dark' ? 'grey.900' : 'background.paper',
            color: userSettings.theme === 'dark' ? 'white' : 'text.primary',
          }
        }}
      >
        <DialogTitle id="clear-chat-dialog-title">
          Clear Chat History
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: userSettings.theme === 'dark' ? 'grey.300' : 'text.secondary' }}>
            Are you sure you want to clear the chat history? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearChatConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmClearChat} color="error" variant="contained">
            Clear Chat
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChatInterface; 