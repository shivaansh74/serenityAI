import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

const moodOptions = [
  { emoji: '😊', label: 'Happy', color: 'bg-green-100 border-green-300' },
  { emoji: '😐', label: 'Neutral', color: 'bg-blue-100 border-blue-300' },
  { emoji: '😞', label: 'Sad', color: 'bg-indigo-100 border-indigo-300' },
  { emoji: '😠', label: 'Angry', color: 'bg-red-100 border-red-300' },
  { emoji: '😰', label: 'Anxious', color: 'bg-yellow-100 border-yellow-300' },
  { emoji: '😴', label: 'Tired', color: 'bg-purple-100 border-purple-300' },
];

const Home = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col bg-neutral-lightest overflow-y-auto scrollable safe-top">
      <header className="px-4 py-6">
        <h1 className="text-2xl font-bold text-neutral-darkest">Welcome to SerenityAI</h1>
        <p className="text-neutral-dark mt-1">Your emotional wellness companion</p>
      </header>
      
      <section className="px-4 py-2">
        <h2 className="text-lg font-semibold mb-3">How are you feeling today?</h2>
        <div className="grid grid-cols-3 gap-3">
          {moodOptions.map((mood) => (
            <motion.button
              key={mood.label}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center 
                ${mood.color} ${selectedMood === mood.label ? 'ring-2 ring-primary' : ''}
              `}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.label)}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-sm">{mood.label}</span>
            </motion.button>
          ))}
        </div>
      </section>
      
      <section className="px-4 py-4 mt-2">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-col gap-3">
          <Link to="/chat">
            <motion.div
              className="p-4 bg-white rounded-xl shadow-soft flex items-center"
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-primary-light bg-opacity-20 p-3 rounded-lg">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">Chat with SerenityAI</h3>
                <p className="text-sm text-neutral-dark">Share your thoughts and feelings</p>
              </div>
            </motion.div>
          </Link>
          
          <Link to="/exercises">
            <motion.div
              className="p-4 bg-white rounded-xl shadow-soft flex items-center"
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-secondary-light bg-opacity-20 p-3 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-secondary-dark" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">Wellness Exercises</h3>
                <p className="text-sm text-neutral-dark">Quick activities to improve your mood</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>
      
      <section className="px-4 py-4 mt-1 mb-6">
        <h2 className="text-lg font-semibold mb-3">Daily Tip</h2>
        <div className="bg-primary bg-opacity-10 p-4 rounded-xl border border-primary border-opacity-30">
          <p className="text-neutral-darkest">
            Take a moment to practice deep breathing. Inhale for 4 seconds, hold for 4 seconds, then exhale for 6 seconds.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
