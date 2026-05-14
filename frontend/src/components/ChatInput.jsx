import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiSquare } from 'react-icons/fi';

export const ChatInput = ({ onSend, onStop, isLoading, presetPrompt }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (presetPrompt) {
      setInput(presetPrompt);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(presetPrompt.length, presetPrompt.length);
        }
      }, 50);
    }
  }, [presetPrompt]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative rounded-2xl glass-input shadow-lg focus-within:ring-2 focus-within:ring-indigo-500/40 transition-all duration-200">
      <div className="flex items-end px-3 py-2 sm:px-4 sm:py-3 gap-2">
        
        <button
          type="button"
          disabled={isLoading}
          className="p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-dark-700/60 transition-colors flex-shrink-0 disabled:opacity-50"
        >
          <FiPaperclip className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask GenOps AI anything..."
          rows={1}
          disabled={isLoading && !onStop} // Enable if we can stop
          className="flex-1 bg-transparent border-none text-gray-100 placeholder-gray-500 text-sm sm:text-base resize-none focus:outline-none py-1.5 sm:py-2 max-h-40 overflow-y-auto"
        />

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="p-2 sm:p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all shadow-md active:scale-95 flex-shrink-0"
            title="Stop generation"
          >
            <FiSquare className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!input.trim()}
            className={`
              p-2 sm:p-2.5 rounded-xl flex-shrink-0 transition-all duration-200 shadow-md
              ${input.trim()
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:opacity-95 shadow-indigo-500/20 active:scale-95'
                : 'bg-dark-700/60 text-gray-600 cursor-not-allowed'
              }
            `}
          >
            <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

      </div>
    </div>
  );
};
