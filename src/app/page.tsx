import Image from 'next/image';
import config from '../config.json';
import { fetchWithRetry } from '@/lib/api';

export default async function Home({ searchParams }: any) {
  const type = searchParams.type || '1';
  
  // 并行请求所有源（速度飞快）
  const results = await Promise.all(
    Object.values(config.api_site).map(async (site: any) => {
      try {
        const data = await fetchWithRetry(`${site.api}?type=${type}&page=1`);
        return data.list || [];
      } catch {
        return [];
      }
    })
  );

  const list = results.flat().slice(0, 48);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
      {list.map((item: any) => (
        <a
          key={item.vod_id}
          href={`/detail?id=${item.vod_id}`}
          className="card group"
        >
          <div className="relative aspect-[2/3]">
            <Image
              src={item.vod_pic || '/placeholder.jpg'}
              alt={item.vod_name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <h3 className="text-white text-sm font-medium line-clamp-2">
                {item.vod_name}
              </h3>
              {item.vod_remarks && (
                <p className="text-xs text-gray-300 mt-1">{item.vod_remarks}</p>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
