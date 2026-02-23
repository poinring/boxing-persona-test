'use client';

import { useRef, useState } from 'react';

export default function SoundCloudBGM() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(true);

  const toggle = () => {
    if (!iframeRef.current) return;

    const widget = (window as any).SC.Widget(iframeRef.current);

    if (playing) widget.pause();
    else widget.play();

    setPlaying(!playing);
  };

  return (
    <>
      {/* 숨겨진 플레이어 */}
      <iframe
        ref={iframeRef}
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/509621919&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false"
        className="hidden"
      />

      {/* 컨트롤 버튼 */}
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 z-50 bg-black/60 text-white px-4 py-2 rounded-full text-sm hover:bg-black transition"
      >
        {playing ? '🔊 BGM 끄기' : '🔈 BGM 켜기'}
      </button>
    </>
  );
}