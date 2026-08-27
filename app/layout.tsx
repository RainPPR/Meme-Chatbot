import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AI Chat Assistant',
  description: 'A responsive and intuitive AI Chat application.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
