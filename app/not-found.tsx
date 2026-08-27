import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 px-4">
      <h1 className="text-4xl font-bold mb-3">404</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        页面未找到或已不存在
      </p>
      <Link
        href="/"
        className="px-4 py-2 text-sm font-medium rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
      >
        返回对话
      </Link>
    </div>
  );
}
