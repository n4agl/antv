import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import config from '../config.json';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: config.app_name || 'MoonTV',
  description: '免费影视聚合播放器',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-black min-h-screen transition-all duration-500`}>
        {/* 顶部导航 */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MoonTV</h1>
            <div className="hidden md:flex gap-8">
              {config.custom_category.slice(0, 6).map((cat: any) => (
                <a
                  key={cat.name}
                  href={`/?type=${cat.type}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <main className="pt-20 pb-24 md:pb-10 max-w-7xl mx-auto px-4">
          {children}
        </main>

        {/* 手机底部导航 */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-around py-3">
            <a href="/" className="text-center">
              <span className="block text-xs text-gray-600 dark:text-gray-300">首页</span>
            </a>
            <a href="/search" className="text-center">
              <span className="block text-xs text-gray-600 dark:text-gray-300">搜索</span>
            </a>
            <a href="/favorite" className="text-center">
              <span className="block text-xs text-gray-600 dark:text-gray-300">收藏</span>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
