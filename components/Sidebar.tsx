'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Bot,
  Sun,
  Moon,
} from 'lucide-react';
import { ChatSession } from '@/lib/chat-store';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  isOpen: boolean;
  onCloseMobile: () => void;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAllSessions: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  isOpen,
  onCloseMobile,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onClearAllSessions,
  theme,
  onToggleTheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter((s) => s.title.toLowerCase().includes(q));
  }, [sessions, searchQuery]);

  const handleStartRename = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditTitleValue(s.title);
    setDeleteConfirmId(null);
  };

  const handleSaveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = editTitleValue.trim();
    if (trimmed) {
      onRenameSession(id, trimmed);
    }
    setEditingId(null);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirmId === id) {
      onDeleteSession(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & New Chat */}
        <div className="p-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
                AI Assistant
              </span>
            </div>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            id="btn-sidebar-new-chat"
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-sm font-medium transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>新建对话</span>
          </button>

          {/* Search Box */}
          {sessions.length > 3 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="搜索历史会话..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 outline-hidden focus:border-neutral-400 dark:focus:border-neutral-600"
              />
            </div>
          )}
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          <div className="px-2 py-1 text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            对话记录 ({filteredSessions.length})
          </div>

          {filteredSessions.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
              {searchQuery ? '无匹配对话' : '暂无历史对话'}
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingId === session.id;
              const isConfirmingDelete = deleteConfirmId === session.id;

              return (
                <div
                  key={session.id}
                  id={`session-item-${session.id}`}
                  onClick={() => {
                    if (!isEditing) {
                      onSelectSession(session.id);
                      onCloseMobile();
                    }
                  }}
                  className={`group relative flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium shadow-xs border border-neutral-200/80 dark:border-neutral-800'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive
                          ? 'text-neutral-900 dark:text-neutral-100'
                          : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                    />

                    {isEditing ? (
                      <form
                        onSubmit={(e) => handleSaveRename(session.id, e)}
                        className="flex items-center gap-1 flex-1 min-w-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editTitleValue}
                          onChange={(e) => setEditTitleValue(e.target.value)}
                          onBlur={() => handleSaveRename(session.id)}
                          autoFocus
                          className="w-full bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-xs text-neutral-900 dark:text-neutral-100 outline-hidden border border-neutral-300 dark:border-neutral-600"
                        />
                        <button
                          type="submit"
                          className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </form>
                    ) : (
                      <span className="truncate">{session.title}</span>
                    )}
                  </div>

                  {/* Actions for Session */}
                  {!isEditing && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleStartRename(session, e)}
                        className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800"
                        title="重命名"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>

                      {isConfirmingDelete ? (
                        <div
                          className="flex items-center gap-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleDeleteClick(session.id, e)}
                            className="px-1.5 py-0.5 text-[10px] bg-red-600 text-white rounded font-medium hover:bg-red-700"
                            title="确认删除"
                          >
                            确认
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(null);
                            }}
                            className="p-1 text-neutral-400 hover:text-neutral-600"
                            title="取消"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleDeleteClick(session.id, e)}
                          className="p-1 rounded text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800"
                          title="删除会话"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Area */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
          {sessions.length > 0 && (
            <button
              id="btn-clear-all-sessions"
              onClick={() => setShowClearAllModal(true)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <span>清空所有记录</span>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
              v1.0 • 本地存储已启用
            </span>
            <button
              onClick={onToggleTheme}
              className="p-1 rounded-md text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              title="切换主题"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-neutral-600" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Clear All Confirmation Dialog */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 max-w-sm w-full shadow-xl space-y-4">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              清空所有对话记录？
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              此操作将永久删除浏览器中存储的所有对话历史，且无法恢复。
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onClearAllSessions();
                  setShowClearAllModal(false);
                }}
                className="px-3 py-1.5 text-xs rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors cursor-pointer"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
