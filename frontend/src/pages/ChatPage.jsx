import React, { useEffect, useRef, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Navbar } from '../components/Navbar';
import { ChatInput } from '../components/ChatInput';
import { ChatMessage } from '../components/ChatMessage';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { useStreamingChat } from '../hooks/useStreamingChat';

export const ChatPage = () => {
  const { 
    chats, 
    activeChat, 
    isLoading, 
    createNewChat, 
    selectChat, 
    deleteChat,
    sendMessage,
    stopGeneration
  } = useStreamingChat();

  const [presetPrompt, setPresetPrompt] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Auto-scroll when messages update
  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  // Initial scroll or when switching chats
  useEffect(() => {
    if (activeChat) {
      scrollToBottom('auto');
    }
  }, [activeChat?.id]);

  const handleSend = (text) => {
    sendMessage(text);
    setPresetPrompt('');
  };

  const handlePromptSelect = (prompt) => {
    setPresetPrompt(prompt);
  };

  return (
    <MainLayout 
      chats={chats} 
      onNewChat={createNewChat} 
      onSelectChat={selectChat} 
      onDeleteChat={deleteChat}
      activeChatId={activeChat?.id}
    >
      <div className="flex flex-col h-full relative overflow-hidden bg-dark-900">
        <Navbar title={activeChat?.title || 'New Conversation'} />

        {/* Chat Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        >
          {!activeChat || activeChat.messages.length === 0 ? (
            <WelcomeScreen onSelectPrompt={handlePromptSelect} />
          ) : (
            <div className="pb-32">
              {activeChat.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        {activeChat && (
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-dark-900 via-dark-900/95 to-transparent">
            <div className="max-w-3xl mx-auto">
              <ChatInput 
                onSend={handleSend} 
                onStop={stopGeneration}
                isLoading={isLoading} 
                presetPrompt={presetPrompt} 
              />
              <p className="mt-2 text-center text-[10px] sm:text-xs text-gray-600">
                AI Assistant can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
