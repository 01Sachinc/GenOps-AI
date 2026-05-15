import React from 'react';
import { FiPlus, FiMessageSquare, FiTrash2, FiSettings, FiSliders, FiCpu } from 'react-icons/fi';

export const Sidebar = ({ chats, activeChatId, onSelectChat, onCreateChat, onDeleteChat }) => {
  return (
    <div className="flex flex-col h-full bg-dark-800 text-gray-300 select-none">
      {/* Brand Header */}
      <div className="p-4 flex items-center space-x-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center shadow-lg shadow-accent-primary/20">
          <FiCpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-wide text-lg">GenOps AI</h1>
          <p className="text-xs text-indigo-400 font-medium">Local Chat Engine</p>
        </div>
      </div>

      {/* Action Area: New Chat Button */}
      <div className="p-4">
        <button
          onClick={onCreateChat}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-accent-primary via-indigo-600 to-accent-secondary text-white font-medium hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-500/20 group"
        >
          <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Navigation Subheader */}
      <div className="px-4 py-2 flex items-center justify-between text-xs font-semibold text-gray-500 tracking-wider uppercase">
        <span>Recent Conversations</span>
        <span className="bg-dark-900/80 px-2 py-0.5 rounded-full text-gray-400">{chats.length}</span>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 my-1">
        {chats.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-600">
            No history found. Start a new chat above!
          </div>
        ) : (
          chats.map((chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`
                  group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
                  ${isActive 
                    ? 'bg-dark-700/80 text-white font-medium shadow-sm border border-white/5' 
                    : 'hover:bg-dark-700/40 text-gray-400 hover:text-gray-200'
                  }
                `}
              >
                <div className="flex items-center space-x-3 overflow-hidden pr-2">
                  <FiMessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
                  <span className="truncate text-sm tracking-tight">{chat.title}</span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  title="Delete conversation"
                  className={`
                    p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-dark-600/60 hover:text-rose-400
                    ${isActive ? 'text-gray-400' : 'text-gray-600'}
                  `}
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Settings Footer Section */}
      <div className="p-4 border-t border-white/5 bg-dark-900/30 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>Ollama Status</span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400/90 font-mono">Active</span>
          </span>
        </div>

        <button 
          onClick={() => alert("Connected to local Ollama on port 11434.")}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-dark-700/50 text-gray-400 hover:text-gray-200 transition-colors text-sm cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <FiSettings className="w-4 h-4 text-gray-500" />
            <span>Settings</span>
          </div>
          <FiSliders className="w-3.5 h-3.5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};
