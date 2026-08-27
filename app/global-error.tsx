'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
          <h2 className="text-xl font-bold mb-2">出现未知错误</h2>
          <p className="text-sm text-neutral-500 mb-4">{error.message || '请稍后重试'}</p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
