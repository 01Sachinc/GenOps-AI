import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCpu, FiUser, FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

export const ChatMessage = ({ message }) => {
  const isAi = message.role === 'ai';
  const [copied, setCopied] = useState(false);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full px-4 py-6 sm:py-8 ${isAi ? 'bg-dark-800/40 border-y border-white/5' : ''}`}>
      <div className="flex gap-3 sm:gap-6 max-w-4xl w-full mx-auto group">
        
        {/* Avatar */}
        <div className={`
          w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg
          ${isAi 
            ? 'bg-gradient-to-tr from-accent-primary to-accent-secondary text-white' 
            : 'bg-dark-600 text-gray-300 border border-white/10'
          }
        `}>
          {isAi ? <FiCpu className="w-5 h-5" /> : <FiUser className="w-5 h-5" />}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold tracking-wider uppercase text-gray-500">
              {isAi ? 'GenOps AI' : 'You'}
            </span>
            <span className="text-[10px] text-gray-600">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="markdown-body text-gray-200 text-sm sm:text-base leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative my-4 rounded-xl overflow-hidden border border-white/10 group/code">
                      <div className="flex items-center justify-between px-4 py-2 bg-dark-900/80 border-b border-white/5">
                        <span className="text-xs font-mono text-gray-500 uppercase">{match[1]}</span>
                        <button 
                          onClick={() => handleCopy(String(children).replace(/\n$/, ''))}
                          className="text-gray-500 hover:text-white transition-colors"
                        >
                          {copied ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <FiCopy className="w-4 h-4" />}
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, background: 'rgba(11, 15, 23, 0.95)', padding: '1.25rem' }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-dark-900/80 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
            
            {/* Blinking Streaming Cursor */}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 animate-pulse align-middle" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
