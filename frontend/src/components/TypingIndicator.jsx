import React from 'react';
import { FiCpu } from 'react-icons/fi';

export const TypingIndicator = () => {
  return (
    <div className="flex w-full px-4 py-4 sm:py-6 bg-dark-800/40 border-y border-white/5 select-none">
      <div className="flex gap-3 sm:gap-4 max-w-4xl w-full mx-auto items-center">
        
        {/* Avatar */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md bg-gradient-to-tr from-accent-primary to-accent-secondary text-white">
          <FiCpu className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
        </div>

        {/* Bubble with Typing Dots */}
        <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5 shadow-sm">
          <span className="text-xs font-semibold text-indigo-400/80 mr-1 hidden sm:inline-block">GenOps AI thinking</span>
          <div className="flex items-center space-x-1 pt-1">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-typing" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-typing" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-typing" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

      </div>
    </div>
  );
};
