'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChatSession,
  ChatMessage,
  createNewSession,
  generateId,
  loadSessionsFromStorage,
  saveSessionsToStorage,
  loadActiveSessionId,
  saveActiveSessionId,
  loadThemePreference,
  saveThemePreference,
} from '@/lib/chat-store';
import { getRandomMemeResponse, getRandomThinkingDelay } from '@/lib/responses';
import { Sidebar } from '@/components/Sidebar';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatMessageItem } from '@/components/ChatMessageItem';
import { ChatInput } from '@/components/ChatInput';
import { EmptyState } from '@/components/EmptyState';
import { useIsMounted } from '@/hooks/use-mounted';

export default function ChatPage() {
  const isMounted = useIsMounted();

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = loadSessionsFromStorage();
      if (stored.length > 0) return stored;
    }
    return [createNewSession('新对话')];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const storedActive = loadActiveSessionId();
      const storedSessions = loadSessionsFromStorage();
      if (storedActive && storedSessions.some((s) => s.id === storedActive)) {
        return storedActive;
      }
      if (storedSessions.length > 0) {
        return storedSessions[0].id;
      }
    }
    return '';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial theme on client mount
  useEffect(() => {
    if (!isMounted) return;
    const initialTheme = loadThemePreference();
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isMounted]);

  // Save sessions to localStorage whenever they change after mount
  useEffect(() => {
    if (!isMounted) return;
    saveSessionsToStorage(sessions);
  }, [sessions, isMounted]);

  // Save active session id
  useEffect(() => {
    if (!isMounted || !activeSessionId) return;
    saveActiveSessionId(activeSessionId);
  }, [activeSessionId, isMounted]);

  const effectiveActiveSessionId = activeSessionId || sessions[0]?.id || '';
  const activeSession =
    sessions.find((s) => s.id === effectiveActiveSessionId) || sessions[0] || null;

  // Auto scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [effectiveActiveSessionId, scrollToBottom]);

  useEffect(() => {
    if (activeSession?.messages.length) {
      scrollToBottom(true);
    }
  }, [activeSession?.messages.length, isThinking, scrollToBottom]);

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    saveThemePreference(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Create New Chat
  const handleNewChat = () => {
    if (isThinking) {
      handleStopThinking();
    }
    const newSession = createNewSession('新对话');
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput('');
  };

  // Switch Active Session
  const handleSelectSession = (id: string) => {
    if (isThinking) {
      handleStopThinking();
    }
    setActiveSessionId(id);
    setInput('');
  };

  // Rename Session
  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  // Delete Session
  const handleDeleteSession = (id: string) => {
    if (isThinking && id === effectiveActiveSessionId) {
      handleStopThinking();
    }
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh = createNewSession('新对话');
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (id === effectiveActiveSessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Clear all sessions
  const handleClearAllSessions = () => {
    if (isThinking) {
      handleStopThinking();
    }
    const fresh = createNewSession('新对话');
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
  };

  // Clear current session messages
  const handleClearCurrentChat = () => {
    if (isThinking) {
      handleStopThinking();
    }
    if (!effectiveActiveSessionId) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === effectiveActiveSessionId
          ? { ...s, messages: [], updatedAt: Date.now() }
          : s
      )
    );
  };

  // Stop thinking / generating
  const handleStopThinking = () => {
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
    setIsThinking(false);
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === effectiveActiveSessionId) {
          return {
            ...s,
            messages: s.messages.filter((m) => !m.isThinking),
          };
        }
        return s;
      })
    );
  };

  // Send message handler
  const handleSendMessage = (textToSend: string) => {
    if (isThinking || !effectiveActiveSessionId) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const thinkingAssistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isThinking: true,
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === effectiveActiveSessionId) {
          const isFirstMessage = s.messages.length === 0;
          const updatedTitle =
            isFirstMessage && s.title === '新对话'
              ? textToSend.slice(0, 20) + (textToSend.length > 20 ? '...' : '')
              : s.title;

          return {
            ...s,
            title: updatedTitle,
            updatedAt: Date.now(),
            messages: [...s.messages, userMessage, thinkingAssistantMessage],
          };
        }
        return s;
      })
    );

    setIsThinking(true);

    const delayMs = getRandomThinkingDelay();
    thinkingTimeoutRef.current = setTimeout(() => {
      const responseContent = getRandomMemeResponse();
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === effectiveActiveSessionId) {
            return {
              ...s,
              updatedAt: Date.now(),
              messages: s.messages.map((m) =>
                m.id === thinkingAssistantMessage.id
                  ? {
                      ...m,
                      content: responseContent,
                      isThinking: false,
                      timestamp: Date.now(),
                    }
                  : m
              ),
            };
          }
          return s;
        })
      );
      setIsThinking(false);
      thinkingTimeoutRef.current = null;
    }, delayMs);
  };

  // Regenerate last assistant response
  const handleRegenerateLast = () => {
    if (isThinking || !activeSession || activeSession.messages.length === 0)
      return;

    const lastMsgIndex = activeSession.messages.length - 1;
    const lastMsg = activeSession.messages[lastMsgIndex];
    if (lastMsg.role !== 'assistant') return;

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === effectiveActiveSessionId) {
          const updatedMessages = [...s.messages];
          updatedMessages[lastMsgIndex] = {
            ...lastMsg,
            isThinking: true,
            content: '',
          };
          return {
            ...s,
            messages: updatedMessages,
            updatedAt: Date.now(),
          };
        }
        return s;
      })
    );

    setIsThinking(true);
    const delayMs = getRandomThinkingDelay();

    thinkingTimeoutRef.current = setTimeout(() => {
      const newResponse = getRandomMemeResponse();
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === effectiveActiveSessionId) {
            const updatedMessages = [...s.messages];
            updatedMessages[lastMsgIndex] = {
              ...lastMsg,
              isThinking: false,
              content: newResponse,
              timestamp: Date.now(),
            };
            return {
              ...s,
              messages: updatedMessages,
              updatedAt: Date.now(),
            };
          }
          return s;
        })
      );
      setIsThinking(false);
      thinkingTimeoutRef.current = null;
    }, delayMs);
  };

  if (!isMounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-neutral-950 text-neutral-400">
        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        sessions={sessions}
        activeSessionId={effectiveActiveSessionId}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onClearAllSessions={handleClearAllSessions}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Chat Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white dark:bg-neutral-950 relative">
        <ChatHeader
          currentSession={activeSession}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={handleNewChat}
          onClearCurrentChat={handleClearCurrentChat}
          onRenameSession={(title) =>
            activeSession && handleRenameSession(activeSession.id, title)
          }
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Messages or Empty State */}
        <div className="flex-1 overflow-y-auto flex flex-col scrollbar-thin">
          {!activeSession || activeSession.messages.length === 0 ? (
            <EmptyState onSelectPrompt={(p) => handleSendMessage(p)} />
          ) : (
            <div className="py-2 flex-1">
              {activeSession.messages.map((msg, index) => {
                const isLastAssistant =
                  index === activeSession.messages.length - 1 &&
                  msg.role === 'assistant';

                return (
                  <ChatMessageItem
                    key={msg.id}
                    message={msg}
                    isLastAssistant={isLastAssistant}
                    onRegenerate={handleRegenerateLast}
                  />
                );
              })}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSendMessage}
          isThinking={isThinking}
          onStop={handleStopThinking}
        />
      </div>
    </div>
  );
}
