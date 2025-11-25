// src/components/Player.tsx
'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function Player({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!url || !videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play();
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-contain bg-black"
      controls
      autoPlay
      playsInline
    />
  );
}
