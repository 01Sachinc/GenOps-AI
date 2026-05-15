import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiSquare, FiFileText, FiX } from 'react-icons/fi';
import axios from 'axios';

export const ChatInput = ({ onSend, onStop, isLoading, presetPrompt }) => {
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('http://localhost:8081/api/rag/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded and processed successfully!');
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

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
    <div className="flex flex-col gap-2">
      {selectedFile && (
        <div className="flex items-center gap-2 px-4 py-2 bg-dark-700/60 rounded-xl w-fit border border-indigo-500/30">
          <FiFileText className="text-indigo-400" />
          <span className="text-xs text-gray-300 truncate max-w-[200px]">{selectedFile.name}</span>
          <button 
            onClick={uploadFile} 
            disabled={isUploading}
            className="text-[10px] bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 px-2 py-1 rounded ml-2 transition-colors"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
          <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-white">
            <FiX size={14} />
          </button>
        </div>
      )}

      <div className="relative rounded-2xl glass-input shadow-lg focus-within:ring-2 focus-within:ring-indigo-500/40 transition-all duration-200">
        <div className="flex items-end px-3 py-2 sm:px-4 sm:py-3 gap-2">
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          
          <button
            type="button"
            disabled={isLoading || isUploading}
            onClick={() => fileInputRef.current.click()}
            className="p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-dark-700/60 transition-colors flex-shrink-0 disabled:opacity-50"
          >
            <FiPaperclip className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            disabled={isLoading && !onStop}
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
    </div>
  );
};
