import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';

export const MainLayout = ({ 
  children, 
  chats = [], 
  onNewChat, 
  onSelectChat, 
  onDeleteChat, 
  activeChatId 
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-900 font-sans relative text-gray-200">
      {/* Backdrop for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-dark-800 border-r border-white/5
        transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-2xl lg:shadow-none
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          chats={chats} 
          activeChatId={activeChatId} 
          onSelectChat={(id) => {
            onSelectChat(id);
            setIsMobileSidebarOpen(false);
          }}
          onCreateChat={() => {
            onNewChat();
            setIsMobileSidebarOpen(false);
          }}
          onDeleteChat={onDeleteChat}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Glow Accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Content */}
        <div className="flex-1 flex flex-col h-full relative z-10">
          {React.Children.map(children, child => {
            if (React.isValidElement(child) && child.type.name === 'Navbar') {
              return React.cloneElement(child, { toggleSidebar: toggleMobileSidebar });
            }
            return child;
          })}
        </div>
      </main>
    </div>
  );
};
