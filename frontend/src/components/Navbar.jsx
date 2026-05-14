import React from 'react';
import { FiMenu, FiCpu, FiCheckCircle } from 'react-icons/fi';

export const Navbar = ({ title = "Active Conversation", toggleSidebar }) => {
  return (
    <nav className="h-16 px-4 lg:px-6 flex items-center justify-between bg-dark-900/60 backdrop-blur-md border-b border-white/5 select-none">
      {/* Left side: Mobile menu trigger + Dynamic Title */}
      <div className="flex items-center space-x-3 overflow-hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-700/50 focus:outline-none lg:hidden transition-all"
          title="Toggle sidebar"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse hidden sm:inline-block" />
          <h2 className="font-semibold text-gray-200 text-sm sm:text-base tracking-tight truncate">
            {title}
          </h2>
        </div>
      </div>

      {/* Right side: AI Model Badge */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 shadow-inner">
          <FiCpu className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-bold bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent uppercase tracking-wider font-mono">
            Llama 3
          </span>
          <FiCheckCircle className="w-3 h-3 text-emerald-400 ml-0.5 hidden sm:inline-block" />
        </div>
      </div>
    </nav>
  );
};
