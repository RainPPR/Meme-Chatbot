'use client';

import React from 'react';
import { Sparkles, Code2, Compass, PenTool, Lightbulb } from 'lucide-react';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const PROMPT_SUGGESTIONS = [
  {
    icon: Code2,
    title: '编写代码',
    prompt: '用 Python 写一个高效的快速排序算法并提供使用示例。',
  },
  {
    icon: Compass,
    title: '探索概念',
    prompt: '用通俗易懂的语言解释什么是量子纠缠和量子计算机。',
  },
  {
    icon: PenTool,
    title: '文字创作',
    prompt: '帮我润色一份项目周报，突出跨部门协作与交付成果。',
  },
  {
    icon: Lightbulb,
    title: '头脑风暴',
    prompt: '请为一款主打轻量化的待办事项应用提供 5 个创新的产品亮点。',
  },
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto w-full animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center shadow-md mb-6">
        <Sparkles className="w-7 h-7" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        今天有什么我可以帮您的？
      </h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 max-w-md">
        您可以输入任何问题或指令，支持代码生成、逻辑分析、日常问答与文本创作。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {PROMPT_SUGGESTIONS.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              id={`empty-suggestion-${index}`}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-all text-left flex flex-col justify-between shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2 text-neutral-800 dark:text-neutral-200 font-medium text-sm">
                <Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
                <span>{item.title}</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
