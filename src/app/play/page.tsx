'use client';
import { useSearchParams } from 'next/navigation';
import Player from '@/components/Player';

export default function Play() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url') || '';

  return (
    <div className="w-screen h-screen bg-black">
      {url ? <Player url={url} /> : <div className="flex items-center justify-center h-full text-white text-2xl">无效链接</div>}
    </div>
  );
}
