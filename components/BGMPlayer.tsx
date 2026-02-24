'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function BGMPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const widgetRef = useRef<any>(null);

  const trackUrl = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/509621919&color=%23ff0000&auto_play=true&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false";

  useEffect(() => {
    const iframeElement = document.getElementById('sc-player-hidden') as HTMLIFrameElement;
    const windowObj = window as any;

    const initWidget = () => {
      if (iframeElement && windowObj.SC) {
        const widget = windowObj.SC.Widget(iframeElement);
        widgetRef.current = widget;

        widget.bind(windowObj.SC.Widget.Events.PLAY, () => setIsPlaying(true));
        widget.bind(windowObj.SC.Widget.Events.PAUSE, () => setIsPlaying(false));
        
        widget.bind(windowObj.SC.Widget.Events.READY, () => {
          window.addEventListener('click', handleFirstInteraction);
        });
      }
    };

    const handleFirstInteraction = () => {
      if (widgetRef.current) {
        widgetRef.current.play();
        window.removeEventListener('click', handleFirstInteraction);
      }
    };

    if (windowObj.SC) {
      initWidget();
    } else {
      const timer = setInterval(() => {
        if (windowObj.SC) {
          initWidget();
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!widgetRef.current) return;
    isPlaying ? widgetRef.current.pause() : widgetRef.current.play();
  };

  return (
    <>
      <div className="hidden">
        <iframe id="sc-player-hidden" allow="autoplay" src={trackUrl} />
      </div>

      <div className="fixed top-5 right-5 z-[9999] flex items-center gap-3 group">
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0 text-[10px] text-white/40 tracking-[0.2em] font-light pointer-events-none uppercase">
          {isPlaying ? 'Pause BGM' : 'Play BGM'}
        </span>

        <button
          onClick={togglePlay}
          className="relative flex items-center justify-center w-10 h-10 rounded-lg transition-all active:scale-95"
        >
          {/* 배경 글로우 */}
          <div className={`absolute inset-0 rounded-lg transition-all duration-700 ${
            isPlaying ? 'bg-red-500/10 blur-md' : 'bg-transparent'
          }`} />

          {/* 비주얼라이저 영역 (재생/정지 통합) */}
          <div className="relative z-10 flex items-end justify-center gap-[3px] h-3.5 px-2">
            {[
              { h: 'h-[6px]', delay: '0.1s' },
              { h: 'h-[12px]', delay: '0.3s' },
              { h: 'h-[8px]', delay: '0.2s' },
              { h: 'h-[10px]', delay: '0.4s' }
            ].map((bar, i) => (
              <span
                key={i}
                className={`w-[2px] rounded-full transition-all duration-500 ${
                  isPlaying 
                    ? 'bg-red-500 animate-visualizer' 
                    : `bg-white/30 group-hover:bg-white/60 ${bar.h}`
                }`}
                style={{
                  animationDelay: isPlaying ? bar.delay : '0s'
                }}
              />
            ))}
          </div>

          {/* 테두리: 호버 시에만 노출 */}
          <div className="absolute inset-0 border border-transparent group-hover:border-white/10 rounded-lg transition-all duration-500" />
        </button>
      </div>

      <style jsx global>{`
        @keyframes visualizer {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        .animate-visualizer {
          animation: visualizer 0.8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}