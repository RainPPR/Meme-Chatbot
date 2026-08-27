'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowUp, Square } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  onSend: (text: string) => void;
  isGenerating: boolean;
  onStop: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  isGenerating,
  onStop,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isGenerating) return;
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposingRef.current) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 sm:pb-6 pt-2">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm focus-within:border-neutral-400 dark:focus-within:border-neutral-600 transition-all p-2 sm:p-2.5"
      >
        <textarea
          id="chat-input-textarea"
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
          placeholder="向 AI 发送消息..."
          rows={1}
          disabled={isGenerating}
          className="w-full resize-none bg-transparent outline-hidden text-sm sm:text-[15px] text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-1.5 px-2 max-h-[180px] leading-relaxed disabled:opacity-60"
        />

        <div className="flex items-center gap-1.5 shrink-0 mb-0.5">
          {isGenerating ? (
            <button
              id="btn-stop-generating"
              type="button"
              onClick={onStop}
              className="w-8 h-8 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
              title="停止生成"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              id="btn-send-message"
              type="submit"
              disabled={!input.trim()}
              className="w-8 h-8 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              title="发送消息 (Enter)"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </form>

      <p className="text-center text-[11px] text-neutral-400 dark:text-neutral-500 mt-2 select-none">
        AI 内容可能包含误差，请以实际情况为准。
      </p>
    </div>
  );
};
