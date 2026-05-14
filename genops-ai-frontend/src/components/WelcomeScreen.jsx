import React from 'react';
import { FiZap, FiShield, FiCode, FiTrendingUp, FiStar } from 'react-icons/fi';

export const WelcomeScreen = ({ onPromptSelect }) => {
  const suggestionCards = [
    {
      title: "Code Refactoring",
      description: "Optimize this React functional component to reduce unnecessary re-renders.",
      icon: <FiCode className="w-5 h-5 text-indigo-400" />,
      gradient: "from-indigo-500/10 to-indigo-500/5",
    },
    {
      title: "System Architecture",
      description: "Design a fault-tolerant microservices architecture using Spring Boot and Docker.",
      icon: <FiShield className="w-5 h-5 text-purple-400" />,
      gradient: "from-purple-500/10 to-purple-500/5",
    },
    {
      title: "Performance Strategy",
      description: "List highly actionable strategies for achieving maximum Web Vitals scoring.",
      icon: <FiZap className="w-5 h-5 text-amber-400" />,
      gradient: "from-amber-500/10 to-amber-500/5",
    },
    {
      title: "DevOps Telemetry",
      description: "Explain how to set up real-time auto-healing anomaly detection with Prometheus.",
      icon: <FiTrendingUp className="w-5 h-5 text-emerald-400" />,
      gradient: "from-emerald-500/10 to-emerald-500/5",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-12 max-w-4xl mx-auto select-none">
      {/* Premium Hero Title Section */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-dark-700/60 border border-white/5 text-xs text-indigo-300 mb-2">
          <FiStar className="w-3.5 h-3.5 text-accent-primary animate-spin" style={{ animationDuration: '6s' }} />
          <span>Next-Gen Enterprise Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">GenOps AI</span>
        </h1>
        
        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Experience ultra-low latency contextual generative reasoning powered locally by Llama 3. Select a workflow below or enter your custom command.
        </p>
      </div>

      {/* Grid of Suggestion Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {suggestionCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onPromptSelect(card.description)}
            className={`
              p-5 rounded-2xl bg-gradient-to-br ${card.gradient} bg-dark-800/60
              border border-white/5 hover:border-indigo-500/30 transition-all duration-300
              cursor-pointer group transform hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5
            `}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-xl bg-dark-900/80 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-200 group-hover:text-white text-sm transition-colors">
                {card.title}
              </h3>
            </div>
            
            <p className="text-xs text-gray-500 group-hover:text-gray-300 leading-relaxed line-clamp-2 transition-colors pr-2">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Feature Footnote */}
      <div className="mt-12 text-center text-xs text-gray-600 flex items-center space-x-4">
        <span>🔒 Secure Local Runtime</span>
        <span>•</span>
        <span>⚡ Real-time Execution</span>
        <span>•</span>
        <span>📝 Advanced Markdown Render</span>
      </div>
    </div>
  );
};
