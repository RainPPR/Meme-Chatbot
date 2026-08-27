'use client';

import React, { useState } from 'react';
import {
  PanelLeft,
  SquarePen,
  Sun,
  Moon,
  Trash2,
  Download,
  Check,
} from 'lucide-react';
import { ChatSession } from '@/lib/chat-store';

interface ChatHeaderProps {
  currentSession: ChatSession | null;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onClearCurrentChat: () => void;
  onRenameSession: (newTitle: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentSession,
  onToggleSidebar,
  onNewChat,
  onClearCurrentChat,
  onRenameSession,
  theme,
  onToggleTheme,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(currentSession?.title || '');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleTitleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = editedTitle.trim();
    if (trimmed && currentSession) {
      onRenameSession(trimmed);
    }
    setIsEditingTitle(false);
  };

  const handleExport = () => {
    if (!currentSession || currentSession.messages.length === 0) return;
    const content = currentSession.messages
      .map(
        (m) =>
          `### ${m.role === 'user' ? 'User' : 'Assistant'} (${new Date(
            m.timestamp
          ).toLocaleString()})\n\n${m.content}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSession.title.replace(/[\\/:*?"<>|]/g, '_')}_chat.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-10 shrink-0 select-none">
      <div className="flex items-center gap-2 min-w-0">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="切换侧边栏"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex items-center gap-1">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              autoFocus
              className="text-sm font-medium px-2 py-0.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 outline-hidden w-40 sm:w-60"
            />
            <button
              type="submit"
              className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-md"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div
            onClick={() => {
              setEditedTitle(currentSession?.title || '新对话');
              setIsEditingTitle(true);
            }}
            className="flex items-center gap-1.5 cursor-pointer group px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors min-w-0"
            title="点击修改会话标题"
          >
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-[160px] sm:max-w-[280px]">
              {currentSession?.title || '新对话'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          id="btn-header-new-chat"
          onClick={onNewChat}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title="新建对话"
        >
          <SquarePen className="w-4 h-4" />
        </button>

        {currentSession && currentSession.messages.length > 0 && (
          <>
            <button
              id="btn-header-export"
              onClick={handleExport}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="导出对话记录 (Markdown)"
            >
              <Download className="w-4 h-4" />
            </button>

            {showClearConfirm ? (
              <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/40 px-2 py-1 rounded-lg border border-red-200 dark:border-red-800 animate-fade-in">
                <span className="text-xs text-red-600 dark:text-red-400">清空?</span>
                <button
                  onClick={() => {
                    onClearCurrentChat();
                    setShowClearConfirm(false);
                  }}
                  className="text-xs font-medium text-red-700 dark:text-red-300 hover:underline px-1"
                >
                  确定
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="text-xs text-neutral-500 hover:underline px-1"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                id="btn-header-clear"
                onClick={() => setShowClearConfirm(true)}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors cursor-pointer"
                title="清空当前会话消息"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        )}

        <button
          id="btn-toggle-theme"
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          title={theme === 'dark' ? '切换为亮色模式' : '切换为暗色模式'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-600" />
          )}
        </button>
      </div>
    </header>
  );
};
