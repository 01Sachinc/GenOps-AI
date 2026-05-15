import { useState, useEffect, useRef, useCallback } from 'react';

export const useStreamingChat = () => {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('genops_chats');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = localStorage.getItem('genops_active_chat_id');
    return saved || null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('genops_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem('genops_active_chat_id', activeChatId);
    }
  }, [activeChatId]);

  const activeChat = chats.find(c => c.id === activeChatId);

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const deleteChat = (id) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !activeChatId) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage = {
      id: aiMessageId,
      role: 'ai',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    };

    // Update UI with user message and empty AI bubble
    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          title: chat.messages.length === 0 ? text.slice(0, 30) : chat.title,
          messages: [...chat.messages, userMessage, initialAiMessage]
        };
      }
      return chat;
    }));

    setIsLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`http://localhost:8081/api/chat/${activeChatId}/stream`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: text 
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) throw new Error(`Backend error! status: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // SSE format: data: content
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data:')) continue;
          
          const content = line.replace('data:', '').trim();
          accumulatedContent += content;

          // Update AI message live
          setChats(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
              return {
                ...chat,
                messages: chat.messages.map(msg => 
                  msg.id === aiMessageId ? { ...msg, content: accumulatedContent } : msg
                )
              };
            }
            return chat;
          }));
        }
      }

      // Mark streaming as finished
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg => 
              msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
            )
          };
        }
        return chat;
      }));

    } catch (err) {
      if (err.name === 'AbortError') {
        console.info('Generation aborted by user');
      } else {
        setError(err.message);
        setChats(prev => prev.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: chat.messages.map(msg => 
                msg.id === aiMessageId ? { ...msg, content: 'Error: Connection lost.', isStreaming: false } : msg
              )
            };
          }
          return chat;
        }));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return {
    chats,
    activeChat,
    activeChatId,
    isLoading,
    error,
    createNewChat,
    selectChat: setActiveChatId,
    deleteChat,
    sendMessage,
    stopGeneration
  };
};
