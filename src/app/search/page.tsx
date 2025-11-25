// app/search/page.tsx   ← 你现在新建的这个文件
import Image from 'next/image';
import config from '../../config.json';
import { fetchWithRetry } from '@/lib/api';

export default async function SearchPage({ searchParams }: { searchParams: { wd?: string } }) {
  const wd = searchParams.wd?.trim();

  // 如果没输入关键词，显示搜索框
  if (!wd) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10">搜索影视</h2>
        <form className="w-full max-w-2xl px-4">
          <input
            name="wd"
            type="text"
            placeholder="输入片名 / 演员 / 导演..."
            className="w-full px-6 py-4 rounded-full text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            autoFocus
          />
          <button type="submit" className="hidden">搜索</button>
        </form>
      </div>
    );
  }

  // 有关键词，开始并行搜索所有源
  const results = await Promise.all(
    Object.values(config.api_site).map(async (site: any) => {
      try {
        const data = await fetchWithRetry(`${site.api}?wd=${encodeURIComponent(wd)}`);
        return (data.list || []).map((item: any) => ({ ...item, source: site.name }));
      } catch (e) {
        console.warn(`源 ${site.name} 搜索失败，已自动跳过`);
        return [];
      }
    })
  );

  const list = results.flat();

  return (
    <div className="pt-20 pb-24">
      <div className="text-center mb-8">
        <p className="text-gray-600 dark:text-gray-400">
          搜索关键词： <span className="font-bold text-blue-600 dark:text-blue-400">“{wd}”</span>　共找到 {list.length} 条结果
        </p>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-xl">
          未找到相关内容，试试换个关键词～
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {list.map((item: any) => (
            <a
              key={item.vod_id}
              href={`/detail?id=${item.vod_id}`}
              className="card group relative overflow-hidden rounded-2xl"
            >
              <div className="aspect-[2/3]">
                <Image
                  src={item.vod_pic || '/placeholder.jpg'}
                  alt={item.vod_name}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-medium text-sm line-clamp-2">{item.vod_name}</p>
                    {item.vod_remarks && (
                      <p className="text-xs text-gray-200 mt-1">{item.vod_remarks}</p>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
