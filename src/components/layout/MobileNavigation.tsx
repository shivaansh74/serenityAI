import { NavLink } from 'react-router-dom';
import { HomeIcon, ChatBubbleLeftRightIcon, SparklesIcon, UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const MobileNavigation = () => {
  const navItems = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/chat', icon: ChatBubbleLeftRightIcon, label: 'Chat' },
    { to: '/exercises', icon: SparklesIcon, label: 'Exercises' },
    { to: '/profile', icon: UserCircleIcon, label: 'Profile' },
    { to: '/settings', icon: Cog6ToothIcon, label: 'Settings' }
  ];

  return (
    <nav className="bg-white border-t border-neutral-light safe-bottom">
      <div className="flex justify-around items-center">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink 
            key={to} 
            to={to} 
            className={({ isActive }) => `
              flex flex-col items-center py-3 px-2 tap-area w-full transition-colors
              ${isActive ? 'text-primary' : 'text-neutral-dark'}
            `}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
