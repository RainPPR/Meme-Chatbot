'use client';

import React, { useState } from 'react';
import { User, Sparkles, Copy, Check, RotateCw } from 'lucide-react';
import { ChatMessage } from '@/lib/chat-store';

interface ChatMessageItemProps {
  message: ChatMessage;
  isLastAssistant: boolean;
  onRegenerate?: () => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isLastAssistant,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = message.content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedTime = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(message.timestamp));

  return (
    <div
      id={`message-${message.id}`}
      className={`py-5 px-4 sm:px-6 w-full flex justify-center transition-colors ${
        isUser
          ? 'bg-transparent'
          : 'bg-neutral-50/60 dark:bg-neutral-900/50 border-y border-neutral-100 dark:border-neutral-800/60'
      }`}
    >
      <div className="max-w-3xl w-full flex gap-4 sm:gap-5 items-start">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium select-none shadow-xs ${
            isUser
              ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
              : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {isUser ? '您' : 'AI Assistant'}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
              {formattedTime}
            </span>
          </div>

          {message.isThinking ? (
            <div className="flex items-center gap-2.5 py-1 text-neutral-500 dark:text-neutral-400">
              <span className="text-sm font-medium">思考中...</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-pulse [animation-delay:200ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-pulse [animation-delay:400ms]" />
              </div>
            </div>
          ) : (
            <div className="text-sm sm:text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200 break-words whitespace-pre-wrap selection:bg-neutral-200 dark:selection:bg-neutral-700">
              {message.content}
            </div>
          )}

          {/* Action Bar */}
          {!message.isThinking && (
            <div className="flex items-center gap-2 pt-1">
              <button
                id={`btn-copy-${message.id}`}
                onClick={handleCopy}
                title="复制内容"
                className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 p-1.5 rounded-md transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">复制</span>
                  </>
                )}
              </button>

              {!isUser && isLastAssistant && onRegenerate && (
                <button
                  id={`btn-regen-${message.id}`}
                  onClick={onRegenerate}
                  title="重新生成回答"
                  className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 p-1.5 rounded-md transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">重新生成</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
