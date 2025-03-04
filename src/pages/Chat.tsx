import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MicrophoneIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "Hi there! I'm SerenityAI, your emotional wellness companion. How are you feeling today?", 
      sender: 'ai', 
      timestamp: new Date() 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand how you're feeling. It's completely normal to experience these emotions. Would you like to talk more about it?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-neutral-lightest safe-top">
      <header className="px-4 py-3 bg-white border-b border-neutral-light flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-darkest">Chat with SerenityAI</h1>
      </header>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 scrollable"
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`mb-4 ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{message.text}</p>
            <span className="text-xs opacity-70 mt-1 block">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
        ))}
        
        {isLoading && (
          <div className="chat-bubble-ai animate-pulse flex space-x-2 items-center">
            <div className="w-2 h-2 bg-neutral-dark rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-neutral-dark rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-neutral-dark rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white border-t border-neutral-light">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="w-full px-4 py-3 pr-24 rounded-full border border-neutral-medium focus:border-primary bg-white"
          />
          
          <div className="absolute right-1 flex items-center space-x-1">
            {isListening && (
              <button 
                onClick={() => {
                  resetTranscript();
                  setInputText('');
                  toggleListening();
                }}
                className="p-2 text-red-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            )}
            
            <button
              onClick={toggleListening}
              className={`p-2 rounded-full ${isListening ? 'text-red-500' : 'text-primary'}`}
            >
              <MicrophoneIcon className="w-6 h-6" />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-2 rounded-full bg-primary text-white disabled:opacity-50 disabled:bg-neutral-medium"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
