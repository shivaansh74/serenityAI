import React from 'react';

interface TypingIndicatorProps {
  theme: 'light' | 'dark' | 'high-contrast';
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ theme }) => {
  const getBackgroundColor = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800';
      case 'high-contrast':
        return 'bg-black';
      default:
        return 'bg-[#E9E9EB]';
    }
  };

  const getDotColor = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-400';
      case 'high-contrast':
        return 'bg-white';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`inline-flex items-center ${getBackgroundColor()} px-3 py-2 rounded-2xl rounded-bl-md space-x-1`}>
      <div className={`w-2 h-2 ${getDotColor()} rounded-full typing-dot opacity-60`} />
      <div className={`w-2 h-2 ${getDotColor()} rounded-full typing-dot opacity-60`} />
      <div className={`w-2 h-2 ${getDotColor()} rounded-full typing-dot opacity-60`} />
    </div>
  );
};

export default TypingIndicator; 